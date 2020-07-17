'use strict'

module.exports = function (existingResponse, language) {
  const fallbackLanguage = 'en'
  let localization

  try {
    localization = require(`./locales/${language}_translated.json`);
  } catch (e) {
    console.log('\x1B[36m%s\x1B[0m', 'Cannot find translation on this language:', language);
  }

  // format it to json if needed
  let data = (existingResponse && existingResponse.toJSON) ? existingResponse.toJSON() : (existingResponse || '')
  let message = ''
  let message_code = ''
  let message_translated = ''
  let validations = null

  // add custom response message option
  if (typeof data === 'object' && data._message) {
    message = data._message
    delete data._message
  }

  // add custom response message option
  if (typeof data === 'object' && data.validations) {
    validations = data.validations
    delete data.validations
  }

  // add field value for validation
  if (typeof data === 'object' && data._message_code) {
    message_code = data._message_code
    delete data._message_code
  }

  if(localization && localization[message_code]) {
    message_translated = localization[message_code]
  } else {
    const defaultLocalization = require(`./locales/${fallbackLanguage}_translated.json`);
    if(defaultLocalization && defaultLocalization[message_code]) {
      message_translated = defaultLocalization[message_code]
    }
  }

  // add custom response message option
  if (typeof data === 'object' && data._data) {
    data = data._data
    delete data._data
  }

  return {data, message, message_code, message_translated, validations}
}
