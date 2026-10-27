/* Isolated production verification. All Google collection is intercepted; Formspree is stubbed. */
const assert = require('node:assert/strict');
const fs = require('node:fs');
const { chromium } = require(process.env.GA4_PLAYWRIGHT_MODULE || 'playwright');
const base = process.env.GA4_TEST_URL || 'http://127.0.0.1:3100';
if (!['127.0.0.1', 'localhost'].includes(new URL(base).hostname)) throw new Error('GA4_TEST_URL must be a local loopback server');
if (!process.env.GA4_GOOGLE_TAG_PATH) throw new Error('Set GA4_GOOGLE_TAG_PATH to a local copy of the public Google tag script for G-TEST123');
const googleTag = fs.readFileSync(process.env.GA4_GOOGLE_TAG_PATH, 'utf8');
const results = [];
const record = name => { results.push(name); console.log(`PASS ${name}`); };
const commands = page => page.evaluate(() => (window.dataLayer || []).filter(entry => Object.prototype.toString.call(entry) === '[object Arguments]').map(entry => Array.from(entry)));
const events = async (page, name) => (await commands(page)).filter(command => command[0] === 'event' && command[1] === name).map(command => command[2]);
const lastConsent = async page => (await commands(page)).filter(command => command[0] === 'consent').at(-1)?.[2];
const waitEvent = async (page, name, predicate = () => true) => {
  for (let i = 0; i < 100; i++) { const matches = await events(page, name); if (matches.some(predicate)) return matches; await page.waitForTimeout(50); }
  throw new Error(`Missing ${name}`);
};
const vercelStub = `(()=>{let beforeSend;const queue=window.vaq||[];window.__vercelSent=[];window.va=(type,payload)=>{if(type==='beforeSend'){beforeSend=payload;return;}if(type==='event'){const data={type:'event',url:location.href,...payload};const clean=beforeSend?beforeSend(data):data;if(clean)window.__vercelSent.push(clean)}};queue.forEach(args=>window.va(...args));window.vaq=[]})()`;

(async () => {
  const browser = await chromium.launch({ headless: true });
  const requests = [];
  const vendorLoads = [];
  let formOutcome = 'success';
  const setup = async (options = {}) => {
    const context = await browser.newContext({ viewport: { width: 1440, height: 1000 }, ...options });
    await context.route('**/*', async route => {
      const url = route.request().url();
      if (url.startsWith('https://www.googletagmanager.com/gtag/js')) return route.fulfill({ contentType: 'application/javascript', body: googleTag });
      if (url.includes('formspree.io/')) return route.fulfill({ status: formOutcome === 'success' ? 200 : 422, contentType: 'application/json', body: formOutcome === 'success' ? '{"next":"/mock-success"}' : '{"errors":[{"code":"TYPE_EMAIL","field":"contactEmail: ","message":"private@example.com"}]}' });
      if (/google-analytics\.com|analytics\.google\.com|doubleclick\.net|googleadservices\.com|googlesyndication\.com|google\.com/.test(url)) { requests.push({ url, body: route.request().postData() || '' }); return route.fulfill({ status: 204 }); }
      if (url.includes('/_vercel/')) { vendorLoads.push(url); return route.fulfill({contentType:'application/javascript',body:url.includes('/insights/')?vercelStub:'window.si=function(){};'}); }
      if (url.startsWith(base)) return route.continue();
      return route.abort();
    });
    return context;
  };
  try {
    const context = await setup();
    await context.grantPermissions(['clipboard-read','clipboard-write'],{origin:base});
    const page = await context.newPage();
    const runtimeErrors = [];
    page.on('pageerror', error => runtimeErrors.push(error.message));
    await page.goto(`${base}/projects?utm_source=linkedin&utm_medium=social&email=secret@example.com&gclid=opaque-${"x".repeat(180)}`);
    await page.getByRole('button', {name:'Reject optional',exact:true}).waitFor();
    const banner=page.getByRole('region',{name:'Privacy preferences'});
    assert.ok(await banner.locator('p').evaluate(element=>parseFloat(getComputedStyle(element).fontSize))>=14,'Consent text must be readable despite the site root font size');
    assert.ok((await banner.getByRole('button',{name:'Accept all',exact:true}).boundingBox()).height>=44,'Consent actions must have touch-sized targets');
    await page.waitForTimeout(1000);
    const queue = await commands(page);
    assert.equal(queue[0][0], 'consent'); assert.equal(queue[0][1], 'default');
    assert.deepEqual(queue[0][2], {analytics_storage:'denied',ad_storage:'denied',ad_user_data:'denied',ad_personalization:'denied'});
    assert.equal(queue.find(command=>command[0]==='config')[1], 'G-TEST123', 'Build with the dummy measurement ID');
    assert.ok(queue.find(command=>command[0]==='config')[2].page_location.includes(`gclid=opaque-${'x'.repeat(180)}`));
    assert.equal((await events(page,'page_view')).length,1);
    assert.equal((await context.cookies()).some(cookie=>cookie.name.startsWith('_ga')),false);
    assert.equal(vendorLoads.length,0);
    record('fresh denied consent, default-before-config, one initial page view, no Analytics cookies or Vercel loads');

    await page.getByRole('button',{name:'Customize',exact:true}).click();
    await page.getByRole('checkbox',{name:'Analytics',exact:true}).check();
    await page.getByRole('button',{name:'Save preferences',exact:true}).click();
    assert.deepEqual(await lastConsent(page),{analytics_storage:'granted',ad_storage:'denied',ad_user_data:'denied',ad_personalization:'denied'});
    await page.waitForTimeout(600);
    assert.ok(vendorLoads.some(url=>url.includes('/insights/')));
    await page.reload(); await page.waitForTimeout(1000);
    assert.equal((await commands(page))[0][2].analytics_storage,'granted');
    assert.equal((await events(page,'page_view')).length,1);
    record('Analytics-only consent and restored choice before measurement after reload');

    await page.locator('summary').filter({hasText:'Filter by technology'}).click();
    await waitEvent(page,'disclosure_toggle',event=>event.action==='open');
    await page.locator('summary').filter({hasText:'Filter by technology'}).click();
    await waitEvent(page,'disclosure_toggle',event=>event.action==='close');
    await page.getByRole('button',{name:'Systems',exact:true}).click();
    await waitEvent(page,'project_filter',event=>event.category==='Systems');
    await page.getByRole('searchbox').fill('private@example.com');
    await waitEvent(page,'site_search',event=>event.query_length===19);
    assert.equal((await events(page,'site_search')).at(-1).search_term,undefined);
    await page.getByRole('button',{name:'Clear search and filters',exact:true}).click();
    await page.getByRole('button',{name:/View all \d+ projects/}).click();
    await waitEvent(page,'project_archive');
    const expand=page.getByRole('button',{name:/^Expand .* details$/}).first();
    await expand.click(); await waitEvent(page,'project_toggle',event=>event.action==='expand');
    await page.getByRole('button',{name:/^Collapse .* details$/}).click();
    await waitEvent(page,'project_toggle',event=>event.action==='collapse');
    assert.equal((await events(page,'page_view')).length,1);
    record('project filters, archive, search without raw text, expand/collapse and shallow navigation without extra page views');

    await page.keyboard.press('Control+k');
    await page.getByRole('combobox').fill('Java');
    await waitEvent(page,'site_search',event=>event.search_scope==='command_palette');
    await page.getByRole('combobox').press('Enter');
    await page.waitForURL(`${base}/#workexperience`);
    await waitEvent(page,'page_view',event=>event.page_type==='home');
    assert.equal((await events(page,'page_view')).length,2);
    assert.ok((await events(page,'page_view')).at(-1).page_title.startsWith('Nirmal Khedkar'));
    record('palette keyboard search/selection and SPA navigation with settled title and one destination page view');

    await page.getByRole('button',{name:'Privacy preferences',exact:true}).click();
    await page.getByRole('button',{name:'Reject optional',exact:true}).click();
    assert.equal((await lastConsent(page)).analytics_storage,'denied');
    const countBeforeWithdrawal=await page.evaluate(()=>window.__vercelSent?.length||0);
    await page.getByRole('link',{name:'Explore my projects',exact:true}).click();
    await waitEvent(page,'page_view',event=>event.page_type==='projects');
    assert.equal(await page.evaluate(()=>window.__vercelSent?.length||0),countBeforeWithdrawal);
    record('withdrawal updates Google immediately and stops previously loaded Vercel collection');

    await page.getByRole('button',{name:'Privacy preferences',exact:true}).click();
    await page.getByRole('checkbox',{name:'Advertising',exact:true}).check();
    await page.getByRole('button',{name:'Save preferences',exact:true}).click();
    assert.deepEqual(await lastConsent(page),{analytics_storage:'denied',ad_storage:'granted',ad_user_data:'granted',ad_personalization:'granted'});
    await page.getByRole('button',{name:'Privacy preferences',exact:true}).click();
    await page.getByRole('button',{name:'Accept all',exact:true}).click();
    assert.equal((await lastConsent(page)).analytics_storage,'granted');
    assert.equal((await lastConsent(page)).ad_personalization,'granted');
    record('Advertising-only and full consent combinations');

    const other = await context.newPage(); await other.goto(`${base}/privacy`);
    await other.getByRole('button',{name:'Change privacy preferences',exact:true}).click();
    await other.getByRole('button',{name:'Reject optional',exact:true}).click();
    await page.waitForTimeout(250);
    assert.equal((await lastConsent(page)).analytics_storage,'denied');
    record('cross-tab withdrawal synchronizes preference and Google consent');
    await other.close(); await page.bringToFront();

    await page.goto(`${base}/blog/relaunch`);
    await waitEvent(page,'page_view',event=>event.page_type==='blog_post');
    assert.equal(await page.locator('[data-analytics-exposure="relaunch"]').count(),1);
    await page.getByRole('button',{name:'Reject optional',exact:true}).waitFor({state:'hidden'});
    await page.getByRole('button',{name:'Copy link',exact:true}).click();
    await waitEvent(page,'share',event=>event.share_action==='link_copied');
    record('article identity and successful share-copy measurement');

    for (const path of ['/resume','/en-US/resume']) {
      const response=await context.request.get(`${base}${path}`,{maxRedirects:0});
      assert.equal(response.status(),200);
      assert.ok((await response.text()).includes('Nirmal Khedkar résumé'));
    }
    const pdf=await context.request.get(`${base}/Resume.pdf`);
    assert.equal(pdf.status(),200);
    assert.ok(pdf.headers()['content-type'].startsWith('application/pdf'));
    assert.equal((await pdf.body()).subarray(0,5).toString(),'%PDF-');
    await page.getByRole('link',{name:'View résumé',exact:true}).click();
    await page.waitForURL(`${base}/resume`);
    await page.getByTitle('Nirmal Khedkar résumé').waitFor({state:'visible'});
    record('embedded résumé page, canonical résumé links, and real PDF response');

    await page.goto(`${base}/#contact`);
    await page.getByRole('textbox',{name:'Email',exact:true}).fill('private@example.com');
    await page.getByRole('textbox',{name:'Message',exact:true}).fill('Private contact message');
    formOutcome='failure';
    await page.locator('#contact-form button[type="submit"]').click();
    await waitEvent(page,'form_pending',event=>event.interaction_type==='failure');
    await waitEvent(page,'form_validation_error',event=>event.interaction_type==='server');
    formOutcome='success';
    await page.locator('#contact-form button[type="submit"]').click();
    await page.getByRole('status').filter({hasText:'Thanks for your submission!'}).waitFor();
    assert.equal((await events(page,'generate_lead')).length,1);
    record('Formspree failure/retry/success with no live submission or raw field values in measurement');

    await page.goto(`${base}/not-a-real-page?token=private`);
    await waitEvent(page,'error_page',event=>event.error_category==='not_found');
    await page.goto(`${base}/500`);await waitEvent(page,'error_page',event=>event.error_category==='server');
    record('404 and 500 exposure');

    for (const request of requests) {
      const decoded=decodeURIComponent(`${request.url}\n${request.body}`);
      assert.equal(/secret@example\.com|private@example\.com|Private contact message|token=private/.test(decoded),false);
      assert.ok(new URL(request.url).searchParams.get('tid')==='G-TEST123' || !request.url.includes('/g/collect'));
    }
    assert.ok(requests.length>0,'Real Google tag must attempt collection');
    assert.equal(runtimeErrors.length,0);
    record('real Google requests intercepted, dummy property only, prohibited test data absent, no runtime exceptions');
    await context.close();

    const blocked=await setup();
    await blocked.route('https://www.googletagmanager.com/**',route=>route.abort());
    const blockedPage=await blocked.newPage();await blockedPage.goto(`${base}/projects`);
    await blockedPage.getByRole('button',{name:'Reject optional',exact:true}).click();
    await blockedPage.getByRole('searchbox').fill('java');
    await waitEvent(blockedPage,'site_search');
    record('blocked Google script preserves usable UI and queues safe events');
    await blocked.close();

    const storageBlocked=await setup({viewport:{width:390,height:844}});
    await storageBlocked.addInitScript(()=>{Storage.prototype.getItem=()=>{throw new Error('blocked')};Storage.prototype.setItem=()=>{throw new Error('blocked')};});
    const mobile=await storageBlocked.newPage();await mobile.goto(`${base}/privacy`);
    await mobile.getByRole('button',{name:'Customize',exact:true}).click();
    await mobile.getByRole('checkbox',{name:'Analytics',exact:true}).check();
    await mobile.getByRole('button',{name:'Save preferences',exact:true}).click();
    assert.equal((await lastConsent(mobile)).analytics_storage,'granted');
    await mobile.evaluate(()=>window.scrollTo(0,window.innerHeight));
    await mobile.getByRole('button',{name:'Open navigation menu',exact:true}).click();
    await waitEvent(mobile,'navigation_menu',event=>event.action==='open');
    await mobile.keyboard.press('Escape');await waitEvent(mobile,'navigation_menu',event=>event.action==='close');
    await mobile.getByRole('button',{name:'Change privacy preferences',exact:true}).click();
    await mobile.screenshot({path:process.env.GA4_SCREENSHOT_PATH||'/tmp/ga4-consent.png'});
    await mobile.getByRole('button',{name:'Reject optional',exact:true}).click();
    assert.equal((await lastConsent(mobile)).analytics_storage,'denied');
    record('mobile keyboard menu, accessible preference controls, and unavailable storage accept/withdraw');
    await storageBlocked.close();
    const report={scenarios:results,interceptedRequests:requests.length,date:new Date().toISOString(),measurementId:'G-TEST123',externalWrites:0};
    fs.writeFileSync(process.env.GA4_REPORT_PATH||'/tmp/ga4-browser-verification.json',JSON.stringify(report,null,2)+'\n');
    console.log(JSON.stringify(report,null,2));
  } finally { await browser.close(); }
})().catch(error=>{console.error(error);process.exitCode=1;});
