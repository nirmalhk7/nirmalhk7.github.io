/*! For license information please see 217-b73ee7b35c2c27c3dc45.js.LICENSE.txt */
(self.webpackChunknirmalhk7_personal_website=self.webpackChunknirmalhk7_personal_website||[]).push([[217],{9217:function(t,e,r){"use strict";function n(t,e,r,n,o,i,a){try{var c=t[i](a),u=c.value}catch(l){return void r(l)}c.done?e(u):Promise.resolve(u).then(n,o)}r.r(e),r.d(e,{renderImageToString:function(){return g},swapPlaceholderImage:function(){return p}});var o,i=r(4687),a=r.n(i),c=r(3723),u=r(7294),l=r(7762),s=(r(2369),new WeakMap),f=navigator.connection||navigator.mozConnection||navigator.webkitConnection,h=["image","loading","isLoading","isLoaded","imgClassName","imgStyle","objectPosition","backgroundColor","objectFit"];function d(t,e){t.style.opacity="1",e&&(e.style.opacity="0")}function v(t,e,r,n,o,i){var a=t.querySelector("[data-main-image]"),c=t.querySelector("[data-placeholder-image]"),u=r.has(e);function l(t){var e=this;this.removeEventListener("load",l);var r=t.currentTarget,n=new Image;n.src=r.currentSrc,n.decode?n.decode().then((function(){d(e,c),null==o||o({wasCached:u})})).catch((function(t){d(e,c),null==i||i(t)})):(d(this,c),null==o||o({wasCached:u}))}return a.addEventListener("load",l),null==n||n({wasCached:u}),Array.from(a.parentElement.children).forEach((function(t){var e=t.getAttribute("data-src"),r=t.getAttribute("data-srcset");e&&(t.removeAttribute("data-src"),t.setAttribute("src",e)),r&&(t.removeAttribute("data-srcset"),t.setAttribute("srcset",r))})),r.add(e),a.complete&&l.call(a,{currentTarget:a}),function(){a&&a.removeEventListener("load",l)}}function p(t,e,i,u,l,h,d){if(!(0,c.h)()){var p,g,y,m=(L=function(){p=v(t,e,i,l,h,d)},"IntersectionObserver"in window?(o||(o=new IntersectionObserver((function(t){t.forEach((function(t){var e;t.isIntersecting&&(null==(e=s.get(t.target))||e(),s.delete(t.target))}))}),{rootMargin:"4g"!==(null==f?void 0:f.effectiveType)||null!=f&&f.saveData?"2500px":"1250px"})),function(t){return s.set(t,L),o.observe(t),function(){o&&t&&(s.delete(t),o.unobserve(t))}}):function(){return L(),function(){}}),w=m(t);return"objectFit"in document.documentElement.style||(t.dataset.objectFit=null!=(g=u.objectFit)?g:"cover",t.dataset.objectPosition=""+(null!=(y=u.objectPosition)?y:"50% 50%"),(b=a().mark((function t(e){return a().wrap((function(t){for(;;)switch(t.prev=t.next){case 0:if(t.t0="objectFitPolyfill"in window,t.t0){t.next=4;break}return t.next=4,r.e(231).then(r.t.bind(r,7231,23));case 4:window.objectFitPolyfill(e);case 5:case"end":return t.stop()}}),t)})),x=function(){var t=this,e=arguments;return new Promise((function(r,o){var i=b.apply(t,e);function a(t){n(i,r,o,a,c,"next",t)}function c(t){n(i,r,o,a,c,"throw",t)}a(void 0)}))},function(t){return x.apply(this,arguments)})(t)),function(){p&&p(),w()}}var b,x,L;return v(t,e,i,l,h,d)}function g(t){var e=t.image,r=t.loading,n=void 0===r?"lazy":r,o=t.isLoading,i=t.isLoaded,a=t.imgClassName,s=t.imgStyle,f=void 0===s?{}:s,d=t.objectPosition,v=t.backgroundColor,p=t.objectFit,g=void 0===p?"cover":p,y=(0,c._)(t,h),m=e.width,w=e.height,b=e.layout,x=e.images,L=e.placeholder,E=e.backgroundColor;return f=(0,c.a)({objectFit:g,objectPosition:d,backgroundColor:v},f),(0,l.renderToStaticMarkup)(u.createElement(c.L,{layout:b,width:m,height:w},u.createElement(c.P,(0,c.a)({},(0,c.g)(L,i,b,m,w,E,g,d))),u.createElement(c.M,(0,c.a)({},y,{width:m,height:w,className:a},(0,c.b)(o,i,x,n,f)))))}},7061:function(t,e,r){var n=r(8698).default;function o(){"use strict";t.exports=o=function(){return e},t.exports.__esModule=!0,t.exports.default=t.exports;var e={},r=Object.prototype,i=r.hasOwnProperty,a=Object.defineProperty||function(t,e,r){t[e]=r.value},c="function"==typeof Symbol?Symbol:{},u=c.iterator||"@@iterator",l=c.asyncIterator||"@@asyncIterator",s=c.toStringTag||"@@toStringTag";function f(t,e,r){return Object.defineProperty(t,e,{value:r,enumerable:!0,configurable:!0,writable:!0}),t[e]}try{f({},"")}catch(C){f=function(t,e,r){return t[e]=r}}function h(t,e,r,n){var o=e&&e.prototype instanceof p?e:p,i=Object.create(o.prototype),c=new O(n||[]);return a(i,"_invoke",{value:j(t,r,c)}),i}function d(t,e,r){try{return{type:"normal",arg:t.call(e,r)}}catch(C){return{type:"throw",arg:C}}}e.wrap=h;var v={};function p(){}function g(){}function y(){}var m={};f(m,u,(function(){return this}));var w=Object.getPrototypeOf,b=w&&w(w(F([])));b&&b!==r&&i.call(b,u)&&(m=b);var x=y.prototype=p.prototype=Object.create(m);function L(t){["next","throw","return"].forEach((function(e){f(t,e,(function(t){return this._invoke(e,t)}))}))}function E(t,e){function r(o,a,c,u){var l=d(t[o],t,a);if("throw"!==l.type){var s=l.arg,f=s.value;return f&&"object"==n(f)&&i.call(f,"__await")?e.resolve(f.__await).then((function(t){r("next",t,c,u)}),(function(t){r("throw",t,c,u)})):e.resolve(f).then((function(t){s.value=t,c(s)}),(function(t){return r("throw",t,c,u)}))}u(l.arg)}var o;a(this,"_invoke",{value:function(t,n){function i(){return new e((function(e,o){r(t,n,e,o)}))}return o=o?o.then(i,i):i()}})}function j(t,e,r){var n="suspendedStart";return function(o,i){if("executing"===n)throw new Error("Generator is already running");if("completed"===n){if("throw"===o)throw i;return S()}for(r.method=o,r.arg=i;;){var a=r.delegate;if(a){var c=_(a,r);if(c){if(c===v)continue;return c}}if("next"===r.method)r.sent=r._sent=r.arg;else if("throw"===r.method){if("suspendedStart"===n)throw n="completed",r.arg;r.dispatchException(r.arg)}else"return"===r.method&&r.abrupt("return",r.arg);n="executing";var u=d(t,e,r);if("normal"===u.type){if(n=r.done?"completed":"suspendedYield",u.arg===v)continue;return{value:u.arg,done:r.done}}"throw"===u.type&&(n="completed",r.method="throw",r.arg=u.arg)}}}function _(t,e){var r=e.method,n=t.iterator[r];if(void 0===n)return e.delegate=null,"throw"===r&&t.iterator.return&&(e.method="return",e.arg=void 0,_(t,e),"throw"===e.method)||"return"!==r&&(e.method="throw",e.arg=new TypeError("The iterator does not provide a '"+r+"' method")),v;var o=d(n,t.iterator,e.arg);if("throw"===o.type)return e.method="throw",e.arg=o.arg,e.delegate=null,v;var i=o.arg;return i?i.done?(e[t.resultName]=i.value,e.next=t.nextLoc,"return"!==e.method&&(e.method="next",e.arg=void 0),e.delegate=null,v):i:(e.method="throw",e.arg=new TypeError("iterator result is not an object"),e.delegate=null,v)}function k(t){var e={tryLoc:t[0]};1 in t&&(e.catchLoc=t[1]),2 in t&&(e.finallyLoc=t[2],e.afterLoc=t[3]),this.tryEntries.push(e)}function P(t){var e=t.completion||{};e.type="normal",delete e.arg,t.completion=e}function O(t){this.tryEntries=[{tryLoc:"root"}],t.forEach(k,this),this.reset(!0)}function F(t){if(t){var e=t[u];if(e)return e.call(t);if("function"==typeof t.next)return t;if(!isNaN(t.length)){var r=-1,n=function e(){for(;++r<t.length;)if(i.call(t,r))return e.value=t[r],e.done=!1,e;return e.value=void 0,e.done=!0,e};return n.next=n}}return{next:S}}function S(){return{value:void 0,done:!0}}return g.prototype=y,a(x,"constructor",{value:y,configurable:!0}),a(y,"constructor",{value:g,configurable:!0}),g.displayName=f(y,s,"GeneratorFunction"),e.isGeneratorFunction=function(t){var e="function"==typeof t&&t.constructor;return!!e&&(e===g||"GeneratorFunction"===(e.displayName||e.name))},e.mark=function(t){return Object.setPrototypeOf?Object.setPrototypeOf(t,y):(t.__proto__=y,f(t,s,"GeneratorFunction")),t.prototype=Object.create(x),t},e.awrap=function(t){return{__await:t}},L(E.prototype),f(E.prototype,l,(function(){return this})),e.AsyncIterator=E,e.async=function(t,r,n,o,i){void 0===i&&(i=Promise);var a=new E(h(t,r,n,o),i);return e.isGeneratorFunction(r)?a:a.next().then((function(t){return t.done?t.value:a.next()}))},L(x),f(x,s,"Generator"),f(x,u,(function(){return this})),f(x,"toString",(function(){return"[object Generator]"})),e.keys=function(t){var e=Object(t),r=[];for(var n in e)r.push(n);return r.reverse(),function t(){for(;r.length;){var n=r.pop();if(n in e)return t.value=n,t.done=!1,t}return t.done=!0,t}},e.values=F,O.prototype={constructor:O,reset:function(t){if(this.prev=0,this.next=0,this.sent=this._sent=void 0,this.done=!1,this.delegate=null,this.method="next",this.arg=void 0,this.tryEntries.forEach(P),!t)for(var e in this)"t"===e.charAt(0)&&i.call(this,e)&&!isNaN(+e.slice(1))&&(this[e]=void 0)},stop:function(){this.done=!0;var t=this.tryEntries[0].completion;if("throw"===t.type)throw t.arg;return this.rval},dispatchException:function(t){if(this.done)throw t;var e=this;function r(r,n){return a.type="throw",a.arg=t,e.next=r,n&&(e.method="next",e.arg=void 0),!!n}for(var n=this.tryEntries.length-1;n>=0;--n){var o=this.tryEntries[n],a=o.completion;if("root"===o.tryLoc)return r("end");if(o.tryLoc<=this.prev){var c=i.call(o,"catchLoc"),u=i.call(o,"finallyLoc");if(c&&u){if(this.prev<o.catchLoc)return r(o.catchLoc,!0);if(this.prev<o.finallyLoc)return r(o.finallyLoc)}else if(c){if(this.prev<o.catchLoc)return r(o.catchLoc,!0)}else{if(!u)throw new Error("try statement without catch or finally");if(this.prev<o.finallyLoc)return r(o.finallyLoc)}}}},abrupt:function(t,e){for(var r=this.tryEntries.length-1;r>=0;--r){var n=this.tryEntries[r];if(n.tryLoc<=this.prev&&i.call(n,"finallyLoc")&&this.prev<n.finallyLoc){var o=n;break}}o&&("break"===t||"continue"===t)&&o.tryLoc<=e&&e<=o.finallyLoc&&(o=null);var a=o?o.completion:{};return a.type=t,a.arg=e,o?(this.method="next",this.next=o.finallyLoc,v):this.complete(a)},complete:function(t,e){if("throw"===t.type)throw t.arg;return"break"===t.type||"continue"===t.type?this.next=t.arg:"return"===t.type?(this.rval=this.arg=t.arg,this.method="return",this.next="end"):"normal"===t.type&&e&&(this.next=e),v},finish:function(t){for(var e=this.tryEntries.length-1;e>=0;--e){var r=this.tryEntries[e];if(r.finallyLoc===t)return this.complete(r.completion,r.afterLoc),P(r),v}},catch:function(t){for(var e=this.tryEntries.length-1;e>=0;--e){var r=this.tryEntries[e];if(r.tryLoc===t){var n=r.completion;if("throw"===n.type){var o=n.arg;P(r)}return o}}throw new Error("illegal catch attempt")},delegateYield:function(t,e,r){return this.delegate={iterator:F(t),resultName:e,nextLoc:r},"next"===this.method&&(this.arg=void 0),v}},e}t.exports=o,t.exports.__esModule=!0,t.exports.default=t.exports},4687:function(t,e,r){var n=r(7061)();t.exports=n;try{regeneratorRuntime=n}catch(o){"object"==typeof globalThis?globalThis.regeneratorRuntime=n:Function("r","regeneratorRuntime = r")(n)}}}]);
//# sourceMappingURL=217-b73ee7b35c2c27c3dc45.js.map