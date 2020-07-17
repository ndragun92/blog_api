const fs = require('fs');
const flatten = require('flat')
const findLocales = fs.readdirSync('./app/Helpers/locales')
const allowedTranslations = ['en.json', 'hr.json']

if (findLocales && findLocales.length) {
  findLocales.forEach(obj => {
    if (obj !== 'generate.js' && allowedTranslations.includes(obj)) {
      const splitFile = obj.split('.')
      const fileLanguage = splitFile[0]
      const path = `./app/Helpers/locales/${fileLanguage}_translated.json`
      const localization = require(`./${fileLanguage}.json`);
      const translations = flatten(localization)
      if (fs.existsSync(path)) {
        fs.unlinkSync(path);
      }
      try {
        fs.writeFileSync(path, JSON.stringify(translations))
        console.log('\x1B[36m%s\x1B[0m',`Generated translation for > ${fileLanguage}_translated.json`);
      } catch (e) {
        return console.log(e);
      }
    }
  })
}
