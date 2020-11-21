/* eslint-disable no-unused-vars */
/*!
 * ioBroker gulpfile
 * Date: 2019-01-28
 */

const util = require('util');
const gulp = require('gulp');
const fs = require('fs');
const pkg = require('./package.json');
const iopackage = require('./io-package.json');

const version = (pkg && pkg.version) ? pkg.version : iopackage.common.version;
const fileName = 'words.js';
const EMPTY = '';
// eslint-disable-next-line import/order
const translate = require('./lib/trans/tools').translateText;

const languages = {
  en: {},
  de: {},
  ru: {},
  pt: {},
  nl: {},
  fr: {},
  it: {},
  es: {},
  pl: {},
  'zh-cn': {},
};

async function translateNotExisting(obj, baseText, yandex) {
  let t = obj.en;
  if (!t) {
    t = baseText;
  }

  if (t) {
    for (const l in languages) {
      if (!obj[l]) {
        const time = new Date().getTime();
        obj[l] = await translate(t, l, yandex);
        console.log(`en -> ${l} ${new Date().getTime() - time} ms`);
      }
    }
  }
}

// TASKS

gulp.task('updatePackages', (done) => {
  iopackage.common.version = pkg.version;
  iopackage.common.news = iopackage.common.news || {};
  if (!iopackage.common.news[pkg.version]) {
    const { news } = iopackage.common;
    const newNews = {};

    newNews[pkg.version] = {
      en: 'news',
      de: 'neues',
      ru: 'новое',
      pt: 'novidades',
      nl: 'nieuws',
      fr: 'nouvelles',
      it: 'notizie',
      es: 'noticias',
      pl: 'nowości',
      'zh-cn': '新',
    };
    iopackage.common.news = Object.assign(newNews, news);
  }
  fs.writeFileSync('io-package.json', JSON.stringify(iopackage, null, 4));
  done();
});

gulp.task('updateReadme', (done) => {
  const readme = fs.readFileSync('README.md')
    .toString();
  const pos = readme.indexOf('## Changelog\n');
  if (pos !== -1) {
    const readmeStart = readme.substring(0, pos + '## Changelog\n'.length);
    const readmeEnd = readme.substring(pos + '## Changelog\n'.length);

    if (readme.indexOf(version) === -1) {
      const timestamp = new Date();
      const date = `${timestamp.getFullYear()}-${
        (`0${(timestamp.getMonth() + 1).toString(10)}`).slice(-2)}-${
        (`0${(timestamp.getDate()).toString(10)}`).slice(-2)}`;

      let news = '';
      if (iopackage.common.news && iopackage.common.news[pkg.version]) {
        news += `* ${iopackage.common.news[pkg.version].en}`;
      }

      fs.writeFileSync('README.md', `${readmeStart}### ${version} (${date})\n${news ? `${news}\n\n` : '\n'}${readmeEnd}`);
    }
  }
  done();
});

gulp.task('translate', async (done) => {
  let yandex;
  const i = process.argv.indexOf('--yandex');

  if (i > -1) {
    yandex = process.argv[i + 1];
  }

  async function trans(enTrans, existing, l) {
    for (const t in enTrans) {
      if (typeof enTrans[t] === 'object') {
        const tmp = await trans(enTrans[t], existing[t] ? existing[t] : {}, l);
        existing[t] = tmp;

        continue;
      }

      if (!existing[t]) {
        console.log(`${t}: ${existing[t]}`);

        existing[t] = await translate(enTrans[t], l, yandex);
      }
    }

    return existing;
  }

  if (iopackage && iopackage.common) {
    if (iopackage.common.news) {
      console.log('Translate News');

      for (const k in iopackage.common.news) {
        console.log(`News: ${k}`);

        const nw = iopackage.common.news[k];
        await translateNotExisting(nw, null, yandex);
      }
    }

    if (iopackage.common.titleLang) {
      console.log('Translate Title');
      await translateNotExisting(iopackage.common.titleLang, iopackage.common.title, yandex);
    }

    if (iopackage.common.desc) {
      console.log('Translate Description');
      await translateNotExisting(iopackage.common.desc, null, yandex);
    }

    fs.writeFileSync('io-package.json', JSON.stringify(iopackage, null, 4));

    if (fs.existsSync('./src/i18n/en/index.js')) {
      const enTranslations = require('./src/i18n/en/index.js');

      for (const l in languages) {
        console.log(`Translate Text: ${l}`);

        let existing = {};
        if (fs.existsSync(`./src/i18n/${l}/index.js`)) {
          existing = require(`./src/i18n/${l}/index.js`);
        }

        await trans(enTranslations, existing, l);

        if (!fs.existsSync(`./src/i18n/${l}/index.js`)) {
          fs.mkdirSync(`./src/i18n/${l}/`);
        }

        fs.writeFileSync(`./src/i18n/${l}/index.js`, `module.exports = ${util.inspect(existing, {
          compact: false,
          sorted: true,
          depth: null
        })};${'\n'}`);
      }
    }
  }
});

gulp.task('default', gulp.series('updatePackages', 'updateReadme'));
