/*
 * Copyright 2016 Resin.io
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *    http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */

'use strict';

const m = require('mochainon');
const shelljs = require('shelljs');
const utils = require('../utils');
const TEST_DIRECTORY = utils.getTestTemporalPathFromFilename(__filename);

shelljs.rm('-rf', TEST_DIRECTORY);
shelljs.mkdir('-p', TEST_DIRECTORY);
shelljs.cd(TEST_DIRECTORY);

utils.createRepoYaml({
  type: 'generic'
});

shelljs.exec('git init');
shelljs.exec('touch VERSION');

utils.createCommit('feat: implement x', {
  'Changelog-Entry': 'Implement x',
  'Change-Type': 'minor'
});

utils.createCommit('fix: fix y', {
  'Changelog-Entry': 'Fix y',
  'Change-Type': 'patch'
});

utils.createCommit('fix: fix z', {
  'Changelog-Entry': 'Fix z',
  'Change-Type': 'patch'
});

utils.callBalenaVersionist();

utils.compareChangelogs(shelljs.cat('CHANGELOG.md').stdout, [
  '# Change Log',
  '',
  'All notable changes to this project will be documented in this file',
  'automatically by Versionist. DO NOT EDIT THIS FILE MANUALLY!',
  'This project adheres to [Semantic Versioning](http://semver.org/).',
  '',
  '# v0.1.0',
  '',
  '* Fix z [Versionist]',
  '* Fix y [Versionist]',
  '* Implement x [Versionist]',
  ''
].join('\n'));

m.chai.expect(shelljs.cat('VERSION').stdout).to.deep.equal('0.1.0');
