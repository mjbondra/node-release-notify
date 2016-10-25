'use strict';

const convict = require('convict');
const { join, resolve } = require('path');

const config = convict({
  config: {
    path: {
      arg: 'config',
      env: 'CONFIG',
      default: resolve(join(__dirname, 'default.json')),
      doc: 'path to configuration',
      format: String
    }
  },
  icon: {
    path: {
      arg: 'icon',
      env: 'ICON',
      default: resolve(join(__dirname, '..', 'assets', 'nodejs-new-pantone-black.png')),
      doc: 'path to locally stored image to display as icon',
      format: String
    }
  },
  localData: {
    path: {
      arg: 'local-data',
      env: 'LOCAL_DATA',
      default: resolve(join(__dirname, '..', 'data', 'releases.atom')),
      doc: 'path to locally stored feed file',
      format: String
    }
  },
  releases: {
    url: {
      arg: 'releases',
      env: 'RELEASES',
      default: 'https://github.com',
      doc: 'base url for releases',
      format: 'url'
    }
  },
  remoteData: {
    url: {
      arg: 'remote-data',
      env: 'REMOTE_DATA',
      default: 'https://github.com/nodejs/node/releases.atom',
      doc: 'atom feed url for releases',
      format: 'url'
    }
  }
});

config.load(config.get('config.path'));


module.exports = config;
