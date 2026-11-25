export async function settle(page) { await page.evaluate(() => document.fonts.ready); await page.waitForTimeout(1100); }
export async function snapshot(page) {
    await settle(page);
    return page.evaluate(() => {
        const ignored = /^(--|animation|transition)/;
        const css = (el, pseudo) => { const style = getComputedStyle(el, pseudo); return Object.fromEntries(Array.from(style).filter(key => !ignored.test(key)).map(key => [key, style.getPropertyValue(key)])); };
        return [...document.querySelectorAll('body *')].filter(el => !['SCRIPT', 'STYLE', 'NOSCRIPT', 'NEXT-ROUTE-ANNOUNCER'].includes(el.tagName)).map(el => ({ tag: el.tagName, label: (el.textContent || '').trim().slice(0, 65), classes: el.getAttribute('class'), style: css(el), before: css(el, '::before'), after: css(el, '::after') }));
    });
}
const categories = ['style', 'before', 'after'];

function compareProperties(before, after, field, details) {
  return Object.keys(before[field]).flatMap(prop => {
    if (before[field][prop] === after[field][prop]) return [];
    return [{ ...details, kind: field, prop, before: before[field][prop], after: after[field][prop] }];
  });
}

function compareElement(before, after, element, scenario) {
  const { tag, label } = before;
  const details = { scenario, element, tag, label, classes: after.classes };
  const differences = categories.flatMap(field => compareProperties(before, after, field, details));
  if (tag !== after.tag) differences.unshift({ label: scenario, element, tag: [tag, after.tag] });
  return differences;
}

export function compare(before, after, label) {
  const length = Math.min(before.length, after.length);
  const diff = before.slice(0, length).flatMap((element, index) => compareElement(element, after[index], index, label));
  if (before.length !== after.length) diff.unshift({ label, structure: [before.length, after.length] });
  return diff;
}
