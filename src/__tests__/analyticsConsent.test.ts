// Runtime imports keep assertions on behavior while the new consent module is introduced.
// eslint-disable-next-line @typescript-eslint/no-var-requires -- Fresh module state for each browser startup scenario.
const consent = () => require('@/util/analyticsConsent') as typeof import('@/util/analyticsConsent');
const savedEnv = process.env.NODE_ENV;
beforeEach(() => { jest.resetModules(); localStorage.clear(); delete (window as Window & {gtag?:unknown;dataLayer?:IArguments[]}).gtag; delete (window as Window & {gtag?:unknown;dataLayer?:IArguments[]}).dataLayer; (process.env as {NODE_ENV?:string}).NODE_ENV = 'production'; });
afterEach(() => { (process.env as {NODE_ENV?:string}).NODE_ENV = savedEnv; jest.restoreAllMocks(); Object.defineProperty(document,'prerendering',{configurable:true,value:false}); });
const commands = () => ((window as Window & {gtag?:unknown;dataLayer?:IArguments[]}).dataLayer || []).map((entry: IArguments) => Array.from(entry));

test('denies all consent before config and sends no automatic page view', () => {
  consent().initializeAnalytics('G-TEST123');
  const queue = commands();
  expect(queue[0]).toEqual(['consent', 'default', { analytics_storage: 'denied', ad_storage: 'denied', ad_user_data: 'denied', ad_personalization: 'denied' }]);
  expect(queue[2]).toEqual(['config', 'G-TEST123', expect.objectContaining({ send_page_view: false, page_location: 'http://localhost/', page_referrer: '' })]);
  consent().initializeAnalytics('G-TEST123');
  expect(commands()).toHaveLength(3);
});

test('restores a valid choice before measurement configuration', () => {
  const api = consent();
  localStorage.setItem(api.CONSENT_KEY, JSON.stringify({version: 1, expires: Date.now() + 10000, analytics: true, advertising: false}));
  api.initializeAnalytics('G-TEST123');
  expect(commands()[0][2]).toEqual({ analytics_storage: 'granted', ad_storage: 'denied', ad_user_data: 'denied', ad_personalization: 'denied' });
});

test.each(['{}', 'invalid', JSON.stringify({version: 1, expires: 1, analytics: true, advertising: true}), JSON.stringify({version: 1, expires: Date.now()+10000, analytics: 'yes', advertising: false})])('rejects malformed or expired preference %s', (record) => {
  const api = consent(); localStorage.setItem(api.CONSENT_KEY, record);
  expect(api.readConsent().analytics).toBe(false);
  expect(api.readConsent().decided).toBe(false);
});

test('updates, persists for 180 days, and withdraws independently', () => {
  const api = consent(); api.initializeAnalytics('G-TEST123');
  api.updateConsent({analytics: true, advertising: false});
  expect(api.readConsent()).toMatchObject({analytics: true, advertising: false, decided: true});
  expect(JSON.parse(localStorage.getItem(api.CONSENT_KEY) || "{}").expires).toBeGreaterThan(Date.now()+179*86400000);
  api.updateConsent({analytics: false, advertising: true});
  expect(commands().at(-1)).toEqual(['consent', 'update', {analytics_storage:'denied', ad_storage:'granted', ad_user_data:'granted', ad_personalization:'granted'}]);
});

test('keeps choice in memory when browser storage unavailable', () => {
  const api = consent();
  jest.spyOn(Storage.prototype, 'setItem').mockImplementation(() => {throw new Error('blocked');});
  api.updateConsent({analytics:true, advertising:false});
  expect(api.readConsent()).toMatchObject({analytics:true, decided:true});
});

test('invalid measurement ID does not configure a tag or queue measurements', () => {
  consent().initializeAnalytics('not-a-tag');
  expect(commands()).toEqual([]);
});

test('new in-memory preference wins over stale stored value when storage writes fail',()=>{
  const api=consent(); api.updateConsent({analytics:true,advertising:true});
  jest.spyOn(Storage.prototype,'setItem').mockImplementation(()=>{throw new Error('blocked');});
  api.updateConsent({analytics:false,advertising:false});
  expect(api.readConsent()).toMatchObject({analytics:false,advertising:false});
});

test('clearing preferences in another tab restores denied defaults',()=>{
  const api=consent();api.updateConsent({analytics:true,advertising:true});localStorage.clear();
  api.synchronizeConsent(true);
  expect(api.readConsent()).toMatchObject({analytics:false,advertising:false,decided:false});
});

test('does not initialize measurement for speculative prerenders before activation',()=>{
  Object.defineProperty(document,'prerendering',{configurable:true,value:true});
  const api=consent(); api.initializeAnalytics('G-TEST123');
  expect(commands()).toHaveLength(0);
  Object.defineProperty(document,'prerendering',{configurable:true,value:false});
  api.initializeAnalytics('G-TEST123'); expect(commands()[0][0]).toBe('consent');
});
