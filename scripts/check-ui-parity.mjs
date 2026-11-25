import fs from 'node:fs';
import path from 'node:path';
import { compare, settle, snapshot } from './ui-style-snapshot.mjs';

// Playwright is used only for verification and is not part of the site bundle.
const playwright = await import(process.env.PLAYWRIGHT_MODULE || 'playwright');
const { chromium } = playwright.default ?? playwright;
const baseline = process.argv[2] || 'http://localhost:3105', current = process.argv[3] || 'http://localhost:3106';
const output = process.env.PLAYWRIGHT_OUTPUT || path.resolve(import.meta.dirname, '../output/playwright');
fs.mkdirSync(output, { recursive: true });
const viewports = [{ width: 1440, height: 1000 }, { width: 768, height: 1024 }, { width: 390, height: 844 }];
const routes = ['/', '/projects', '/blog', '/blog/homelab_gitops', '/privacy', '/resume', '/404', '/500'];
const report = { baselineRevision: process.env.PLAYWRIGHT_BASE_REVISION || '2621bf2ebe81889b055442606c66fd918d2599f8', scenarios: [], differences: [] };
async function record(pages, label) { const [a, b] = await Promise.all(pages.map(snapshot)); const diffs = compare(a, b, label); report.scenarios.push({ label, elements: a.length, differences: diffs.length }); report.differences.push(...diffs); fs.writeFileSync(output + '/ui-parity-report.json', JSON.stringify(report, null, 2)); console.log(diffs.length ? 'DIFF' : 'PASS', label, diffs.length); }
async function both(pages, fn) { await Promise.all(pages.map(fn)); }
async function dismiss(page) { const button = page.getByRole('button', { name: 'Reject optional', exact: true }); if (await button.count())
    await button.click(); }
async function openMobileNavigation(page) {
    // Homepage navigation appears after the hero has scrolled out.
    await page.evaluate(() => window.scrollTo(0, window.innerHeight + 100));
    await settle(page);
    await page.getByRole('button', { name: 'Open navigation menu', exact: true }).click();
}
async function recordHomeInteractions(pages, label, width) {
    if (width !== 768) {
        const device = width === 1440 ? 'desktop' : 'mobile';
        await pages[1].screenshot({ path: path.join(output, `tailwind-homepage-${device}.png`) });
    }
    await both(pages, p => p.getByRole('textbox', { name: 'Name', exact: true }).focus());
    await record(pages, label + '-contact-focus');
    await both(pages, p => p.evaluate(() => window.dispatchEvent(new Event('open-command-palette'))));
    await record(pages, label + '-search');
    await both(pages, p => p.keyboard.press('Escape'));
    await both(pages, settle);
    if (width < 1024) {
        await both(pages, openMobileNavigation);
        await record(pages, label + '-navigation');
    }
}
async function recordProjectInteractions(pages, label) {
    const projectRow = page => page.locator('main button[aria-expanded="false"]').first();
    await both(pages, p => projectRow(p).hover());
    await record(pages, label + '-row-hover');
    await both(pages, async p => {
        const row = projectRow(p);
        if (await row.count()) await row.click();
    });
    await record(pages, label + '-expanded');
    await both(pages, p => p.getByRole('searchbox').fill('no-such-project-123'));
    await record(pages, label + '-empty-search');
}
async function loadMotionPage(page, origin) {
    const start = Date.UTC(2026, 0, 1);
    await page.route('https://**/*', route => route.abort());
    await page.clock.install({ time: start });
    await page.clock.pauseAt(start + 1000);
    await page.goto(origin, { waitUntil: 'networkidle' });
    await page.clock.runFor(100);
    await dismiss(page);
    await page.clock.runFor(900);
}
(async () => {
    const browser = await chromium.launch({ headless: true, ...(process.env.PLAYWRIGHT_CHROMIUM_EXECUTABLE ? { executablePath: process.env.PLAYWRIGHT_CHROMIUM_EXECUTABLE } : { channel: 'chrome' }) });
    try {
        for (const viewport of viewports) {
            const contexts = await Promise.all([0, 1].map(() => browser.newContext({ viewport, reducedMotion: 'reduce' })));
            const pages = await Promise.all(contexts.map(c => c.newPage()));
            await both(pages, p => p.route('https://**/*', r => r.abort()));
            for (const route of routes) {
                const label = (route === '/' ? 'home' : route.slice(1).replaceAll('/', '-')) + '-' + viewport.width;
                await both(pages, (p) => p.goto((p === pages[0] ? baseline : current) + route, { waitUntil: 'networkidle' }));
                if (route === '/') {
                    await record(pages, label + '-consent');
                    await both(pages, p => p.getByRole('button', { name: 'Customize', exact: true }).click());
                    await record(pages, label + '-consent-options');
                }
                await both(pages, dismiss);
                await record(pages, label + '-default');
                if (route === '/') await recordHomeInteractions(pages, label, viewport.width);
                else if (route === '/projects') await recordProjectInteractions(pages, label);
                else if (route === '/blog/homelab_gitops') {
                    await both(pages, p => p.locator('main a[href]').first().hover());
                    await record(pages, label + '-article-link-hover');
                }
            }
            await Promise.all(contexts.map(c => c.close()));
        }
        // Exercise the desktop GSAP layout with motion enabled and a short viewport fallback.
        for (const viewport of [{ width: 1440, height: 1000 }, { width: 1440, height: 700 }]) {
            const contexts = await Promise.all([0, 1].map(() => browser.newContext({ viewport, reducedMotion: 'no-preference' })));
            const pages = await Promise.all(contexts.map(c => c.newPage()));
            await both(pages, p => loadMotionPage(p, p === pages[0] ? baseline : current));
            await record(pages, 'home-motion-' + viewport.height + '-top');
            await both(pages, p => p.evaluate(() => window.scrollTo(0, 1800)));
            await both(pages, p => p.clock.runFor(1400));
            await record(pages, 'home-motion-' + viewport.height + '-scroll');
            await Promise.all(contexts.map(c => c.close()));
        }
        if (report.scenarios.length !== 54) throw new Error('Incomplete UI matrix: expected 54 scenarios');
        report.status = report.differences.length ? 'failed' : 'passed';
        report.comparison = 'DOM structure and all computed properties of elements and pseudo-elements, excluding animation, transition, and custom properties';
        fs.writeFileSync(output + '/ui-parity-report.json', JSON.stringify(report, null, 2) + '\n');
        console.log('Scenarios:', report.scenarios.length, 'Differences:', report.differences.length);
        if (report.differences.length)
            process.exitCode = 1;
    }
    finally {
        await browser.close();
    }
})().catch(e => { console.error(e); process.exitCode = 1; });
