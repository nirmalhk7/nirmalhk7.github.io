/* eslint-disable sort-vars */
/* eslint-disable prefer-template */
const
  fs = require('fs'),
  handlebars = require('handlebars'),
  handlebarsWax = require('handlebars-wax'),
  addressFormat = require('address-format'),
  moment = require('moment'),
  Swag = require('swag');

Swag.registerHelpers(handlebars);

handlebars.registerHelper({
  removeProtocol (url) {
    return url.replace(/.*?:\/\//g, '');
  },

  concat () {
    let res = '';

    for (const arg in arguments) {
      if (typeof arguments[arg] !== 'object') {
        res += arguments[arg];
      }
    }

    return res;
  },

  formatAddress (address, city, region, postalCode, countryCode) {
    const addressList = addressFormat({
      address,
      city,
      subdivision: region,
      postalCode,
      countryCode
    });


    return addressList.join('<br/>');
  },

  formatDate (date) {
    return date;
  }
});


function render(resume) {
    const dir = __dirname + '/app',
    css = fs.readFileSync(dir + '/css/main.css', 'utf-8'),
    resumeTemplate = fs.readFileSync(dir + '/views/resume.hbs', 'utf-8');

  const Handlebars = handlebarsWax(handlebars);

  Handlebars.partials(dir + '/views/partials/**/*.{hbs,js}');
  Handlebars.partials(dir + '/views/components/**/*.{hbs,js}');

  return Handlebars.compile(resumeTemplate)({
    css,
    resume
  });
}

module.exports = {
  render
};
