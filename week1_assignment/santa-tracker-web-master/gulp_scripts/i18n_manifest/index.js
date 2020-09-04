/*
 * Copyright 2016 Google Inc. All rights reserved.
 *
 * Licensed under the Apache License, Version 2.0 (the "License"); you may not
 * use this file except in compliance with the License. You may obtain a copy of
 * the License at
 *
 *     http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS, WITHOUT
 * WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied. See the
 * License for the specific language governing permissions and limitations under
 * the License.
 */

/* jshint node: true */

const fs = require('fs');
const path = require('path');
const through = require('through2');
const gutil = require('gulp-util');

module.exports = function translateManifest(opts) {
  const langPromise = getLangs(opts.path);

  const stream = through.obj((file, enc, cb) => {
    if (file.isNull()) { return stream.push(file) }
    if (file.isStream()) { throw new gutil.PluginError('i18n_manifest', 'No stream support'); }

    langPromise.then(function(langs) {
      const src = JSON.parse(file.contents.toString());
      if (!src.start_url) {
        throw new Error('expected manifest to have start_url');
      }

      langs.forEach(lang => {
        if (lang == 'en') { return; }

        const i18nfile = file.clone();
        i18nfile.path = path.dirname(file.path) + `/intl/${lang}_ALL/` + path.basename(file.path);
        i18nfile.contents = new Buffer(JSON.stringify(src));

        stream.push(i18nfile);
      });

      stream.push(file);  // push default (en)
    }).catch(err => {
      stream.destroy(err);  // cb doesn't expect an err, but stream.destroy does
    }).then(cb);
  });

  return stream;
};

/**
 * Read names of languages from _messages/*json. Returns a Promise containing a list of languages.
 *
 * @param {string} msgDir
 * @return {!Promise<!Array<string>>}
 */
function getLangs(msgDir) {
  return new Promise((resolve, reject) => {
    fs.readdir(msgDir, (err, files) => {
      if (err) {
        reject(err);
      } else {
        const langs = files.filter(f => f.endsWith('.json')).map(f => path.basename(f, '.json'));
        resolve(langs);
      }
    });
  });
}
