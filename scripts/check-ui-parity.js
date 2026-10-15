const fs = require('fs'), path = require('path');
// Playwright is a verification-only tool; no browser dependency is shipped to users.
let chromium;
try {
    ({ chromium } = require(process.env.PLAYWRIGHT_MODULE || 'playwright'));
}
catch {
    console.error('Install Playwright locally or set PLAYWRIGHT_MODULE to its module directory.');
    process.exit(1);
}
const baseline = process.argv[2] || 'http://localhost:3105', current = process.argv[3] || 'http://localhost:3106';
const output = path.resolve(__dirname, '../output/playwright');
fs.mkdirSync(output, { recursive: true });
const viewports = [{ width: 1440, height: 1000 }, { width: 768, height: 1024 }, { width: 390, height: 844 }];
const routes = ['/', '/projects', '/blog', '/blog/homelab_gitops', '/privacy', '/resume', '/404', '/500'];
const report = { baselineRevision: '2621bf2ebe81889b055442606c66fd918d2599f8', scenarios: [], differences: [] };
async function settle(page) { await page.evaluate(() => document.fonts.ready); await page.waitForTimeout(1100); }
async function snapshot(page) {
    await settle(page);
    return page.evaluate(() => {
        const ignored = /^(--|animation|transition)/;
        const css = (el, pseudo) => { const style = getComputedStyle(el, pseudo); return Object.fromEntries(Array.from(style).filter(key => !ignored.test(key)).map(key => [key, style.getPropertyValue(key)])); };
        return [...document.querySelectorAll('body *')].filter(el => !['SCRIPT', 'STYLE', 'NOSCRIPT', 'NEXT-ROUTE-ANNOUNCER'].includes(el.tagName)).map(el => ({ tag: el.tagName, label: (el.textContent || '').trim().slice(0, 65), classes: el.getAttribute('class'), style: css(el), before: css(el, '::before'), after: css(el, '::after') }));
    });
}
function compare(a, b, label) { const diffs = []; if (a.length !== b.length)
    diffs.push({ label, structure: [a.length, b.length] }); for (let i = 0; i < Math.min(a.length, b.length); i++) {
    if (a[i].tag !== b[i].tag)
        diffs.push({ label, element: i, tag: [a[i].tag, b[i].tag] });
    for (const kind of ['style', 'before', 'after'])
        for (const prop of Object.keys(a[i][kind]))
            if (a[i][kind][prop] !== b[i][kind][prop])
                diffs.push({ scenario: label, element: i, tag: a[i].tag, label: a[i].label, classes: b[i].classes, kind, prop, before: a[i][kind][prop], after: b[i][kind][prop] });
} return diffs; }
async function record(pages, label) { const [a, b] = await Promise.all(pages.map(snapshot)); const diffs = compare(a, b, label); report.scenarios.push({ label, elements: a.length, differences: diffs.length }); report.differences.push(...diffs); fs.writeFileSync(output + '/ui-parity-report.json', JSON.stringify(report, null, 2)); console.log(diffs.length ? 'DIFF' : 'PASS', label, diffs.length); }
async function both(pages, fn) { await Promise.all(pages.map(fn)); }
async function dismiss(page) { const button = page.getByRole('button', { name: 'Reject optional', exact: true }); if (await button.count())
    await button.click(); }
(async () => {
    const browser = await chromium.launch({ channel: 'chrome', headless: true });
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
                if (route === '/') {
                    if (viewport.width !== 768)
                        await pages[1].screenshot({ path: output + '/tailwind-homepage-' + (viewport.width === 1440 ? 'desktop' : 'mobile') + '.png' });
                    await both(pages, p => p.getByRole('textbox', { name: 'Name', exact: true }).focus());
                    await record(pages, label + '-contact-focus');
                    await both(pages, p => p.evaluate(() => window.dispatchEvent(new Event('open-command-palette'))));
                    await record(pages, label + '-search');
                    await both(pages, p => p.keyboard.press('Escape'));
                    await both(pages, settle);
                    if (viewport.width < 1024) {
                        // Homepage navigation is intentionally hidden until the hero has scrolled out.
                        await both(pages, p => p.evaluate(() => window.scrollTo(0, window.innerHeight + 100)));
                        await both(pages, settle);
                        await both(pages, p => p.getByRole('button', { name: 'Open navigation menu', exact: true }).click());
                        await record(pages, label + '-navigation');
                    }
                }
                else if (route === '/projects') {
                    await both(pages, p => p.locator('main button[aria-expanded="false"]').first().hover());
                    await record(pages, label + '-row-hover');
                    await both(pages, async (p) => { const button = p.locator('main button[aria-expanded="false"]').first(); if (await button.count())
                        await button.click(); });
                    await record(pages, label + '-expanded');
                    await both(pages, p => p.getByRole('searchbox').fill('no-such-project-123'));
                    await record(pages, label + '-empty-search');
                }
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
            await both(pages, p => p.route('https://**/*', r => r.abort()));
            await both(pages, p => p.goto((p === pages[0] ? baseline : current) + '/', { waitUntil: 'networkidle' }));
            await both(pages, dismiss);
            await record(pages, 'home-motion-' + viewport.height + '-top');
            await both(pages, p => p.evaluate(() => window.scrollTo(0, 1800)));
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
