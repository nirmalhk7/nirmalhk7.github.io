---
title: "Signed Updates for a Rust + CEF Browser: Building the Sparkle Release Pipeline"
category: ['Engineering']
tags: ["rust", "macos", "cef", "sparkle", "release-engineering", "security"]
img: /assets/rust-cef-sparkle-updates.webp
description: "How I integrated Sparkle into a Rust and CEF browser, bound release signing to the bundled public key, and tested signed feeds with real macOS tools."
date: "2026-11-20"
draft: false
---

“Check for Updates…” is a small menu item with a release pipeline attached to it.

For **Thor**, my developer browser, I added Sparkle to the native macOS shell and connected it to packaging, signing, and GitHub release automation. Thor embeds the Chromium Embedded Framework, or CEF, inside a Rust application. That gives the update integration a few boundaries to cross: Rust and Objective-C ownership, the application bundle and its embedded frameworks, and the release archive and the key that existing installations trust.

The central question was how to keep those pieces consistent. A release job should establish that its signing key matches the application it is shipping, and the update feed should be verified before it becomes a published artifact.

I built those checks into the pipeline and exercised the signer with disposable macOS bundles and real Sparkle tools. The tests cover valid signatures, a modified download URL, and a mismatched signing key. They make the release contract concrete without needing to install an update over someone's browser.

## Authenticate the archive and the instructions for finding it

Sparkle uses an **appcast**, an XML feed describing available releases and where to download them. Thor's configured feed URL points to a stable GitHub Releases location; generated download links point to versioned ZIP archives.

Those are two different artifacts. The archive contains the application. The feed tells the updater which release and download location to present.

I configured Thor to require signed feeds and verify update archives before extraction. [Sparkle documents these settings together](https://sparkle-project.org/documentation/customization/): `SURequireSignedFeed` validates the feed, and requires `SUVerifyUpdateBeforeExtraction`. The packaging code writes both into `Info.plist`, alongside the public verification key:

```python
"SUPublicEDKey": public_key,
"SURequireSignedFeed": True,
"SUVerifyUpdateBeforeExtraction": True,
"SUEnableAutomaticChecks": False,
"SUAllowsAutomaticUpdates": False,
```

These are entries from the bundle configuration, not a complete Python program. The last two keep checks user-initiated and disable automatic updates. Thor also disables release-note display in this integration.

The public key belongs in the application. The private key belongs in the signing step. Sparkle's [Ed25519 signing model](https://sparkle-project.org/documentation/#eddsa-ed25519-signatures) gives installed applications a way to verify update archives using that embedded public key.

Checksums remain useful for checking that release files have not changed during the build. The signatures answer a different question: whether the artifact verifies under the configured signing key.

## Put the verifier in the bundle before sealing it

Thor's packaging helper copies `Sparkle.framework` into `Thor.app/Contents/Frameworks`. It preserves symlinks, which matter for a versioned macOS framework: an entry such as `Sparkle.framework/Sparkle` can resolve through `Versions/Current` to the actual executable.

Before modifying the bundle, the helper validates that the supplied public key is strict Base64 encoding of exactly 32 bytes, and that the source framework executable exists. Invalid inputs leave the original `Info.plist` and framework destination untouched. The filesystem tests check those outcomes directly, along with replacing an existing embedded framework during repackaging.

The order of operations is intentional:

```text
Build the Rust application and CEF helpers
Embed Sparkle and configure Info.plist
Seal the CEF framework, Thor helpers, and outer app bundle
Verify the bundle
Create the ZIP and DMG, then compute checksums
Sign the completed update archive and feed
```

Adding a framework or changing `Info.plist` happens before the outer bundle is sealed. The packager preserves Sparkle's upstream framework signature and helper entitlements while signing Thor's own bundle components.

There are separate signing responsibilities here. The bundle step uses ad-hoc macOS code signatures for integrity; Sparkle update authentication uses the release's Ed25519 key. Ad-hoc signing does not supply an Apple Developer ID identity or notarization. Keeping those concepts separate makes it clear what each verification establishes.

## Keep native updater ownership in Rust

Thor's update control lives in the native shell. It doesn't require a browser page to own an updater object or decide how to install an application.

The Rust entry point loads the bundled framework with `dlopen`, obtains `SPUStandardUpdaterController`, and connects the menu item's `checkForUpdates:` action to it. Two lifetime details matter more than the amount of code suggests.

First, `NSMenuItem` holds a weak target reference. A controller created inside the menu setup function needs an owner after that function returns. Thor keeps a strong reference in main-thread-local storage:

```rust
thread_local! {
    // NSMenuItem's target is weak. Keep its controller alive on the main thread.
    static CONTROLLER: RefCell<Option<StrongPtr>> = const { RefCell::new(None) };
}
```

Second, loading the framework introduces Objective-C classes and callbacks whose lifetimes extend beyond menu construction. The library stays loaded until process exit. Releasing a Rust setup variable is not a useful signal that an Objective-C updater has finished its work.

Initialization also has an explicit outcome. The controller is created without starting the updater immediately, then `startUpdater:` is checked. If configuration cannot initialize, the menu action is disabled and the shell records an operational warning. Developer mode uses local builds and skips updater initialization.

That keeps the menu tied to a real native capability, with ownership and initialization handled in the same layer.

## Check the key against the archive being shipped

The release signer reads `SUPublicEDKey` from the `Info.plist` **inside the completed ZIP**. That choice avoids validating one configuration file while publishing a bundle assembled from something else.

The relevant step is:

```bash
unzip -p "$UPDATES/Thor-v${VERSION}-macos.zip" Thor.app/Contents/Info.plist > "$UPDATES/Info.plist"
PUBLIC_KEY="$(/usr/libexec/PlistBuddy -c 'Print SUPublicEDKey' "$UPDATES/Info.plist")"
printf '%s' "$THOR_UPDATE_PRIVATE_KEY" | /usr/bin/swift "$SCRIPT_DIR/verify_update_key.swift" "$PUBLIC_KEY"
```

The Swift helper reads the private signing seed from standard input. It requires a 32-byte seed and public key, derives the public key using CryptoKit, and compares the result with the one extracted from the archive. A mismatch stops the script before feed generation.

The private value stays out of command arguments and temporary key files in this step. It is still a secret supplied through the signing process's environment, so the workflow limits where that environment is available: the build step unsets it before invoking the compiler and packager, and a separate signing step receives it afterward.

The signer copies the completed archive into a temporary staging directory, generates an appcast with a versioned GitHub download URL, and asks Sparkle to verify that feed with the same key. Only then does it move `appcast.xml` into the release output directory. An exit trap cleans up the temporary staging area.

I also disabled delta generation for this pipeline. The release path produces a full update archive, giving the signing tests a focused artifact to exercise.

## Exercise the signer with real tools and disposable keys

The native integration tests build a minimal `Thor.app` in a temporary directory. Its executable is `/usr/bin/true`; the purpose is to exercise packaging and signing rather than launch CEF. Each test generates an ephemeral signing key with CryptoKit, embeds its public key using the same packaging helper, ad-hoc signs the fixture, and creates the ZIP with `ditto`.

Then it invokes the actual release signer and Sparkle's tools.

The first test generates a valid feed and verifies its signature. It then changes the download filename to `untrusted.zip` without signing again. Verification must reject the edited feed. That tests the integrity of the release metadata, including the location it advertises.

The second test supplies a different private key from the one corresponding to the application's embedded public key. The signer must return a failure and leave no published `dist/appcast.xml` in the test output.

Together with the packaging tests, these checks exercise both the positive path and the boundaries where output must not be produced. A successful script exit by itself would say less about either.

The [implementation commit](https://github.com/nirmalhk7/thor/commit/c6fe3a18f2e8c5dfeadbc0a2a11d5e7f637cf128) includes the native controller, bundle configuration, signing script, and tests. The [native signing tests](https://github.com/nirmalhk7/thor/blob/c6fe3a18f2e8c5dfeadbc0a2a11d5e7f637cf128/tests/test_sparkle_signing.py) show the exact fixture and tampering procedure.

The menu item is the visible end of this work. Underneath it, the application carries the verification key, the signer checks that key against the completed archive, and the feed is verified before publication. Those connections are what make the update pipeline worth testing as a system.
