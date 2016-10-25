'use strict';

const fetch = require('node-fetch');
const fs = require('fs');
const notifier = require('node-notifier');
const opn = require('opn');
const thenify = require('thenify-all');
const { Parser } = require('xml2js');
const winston = require('winston');

const config = require('./conf/loader');

const { readFile, writeFile } = thenify(fs);
const { parseString } = thenify(new Parser({ attrkey: 'attr', explicitArray: false }));

const localDataPath = config.get('localData.path');
const iconPath = config.get('icon.path');
const releasesURL = config.get('releases.url');
const remoteDataURL = config.get('remoteData.url');

const getLocalData = readFile(localDataPath, 'utf8').catch(() => '');


fetch(remoteDataURL)
  .then(res => Promise.all([ res.text(), getLocalData ]))
  .then(data => {
    const remote = data[0];
    const local = data[1];


    if (remote !== local) {
      writeFile(localDataPath, remote)
        .then(() => winston.info(`updated data file: ${localDataPath}`))
        .catch(winston.error);
    }

    return Promise.all([ parseString(remote), parseString(local) ]);
  })
  .then(data => {
    const remote = data[0] || { feed: { entry: [] } };
    const local = data[1] || { feed: { entry: [] } };

    const latestRemote = remote.feed.entry[0] || {};
    const latestLocal = local.feed.entry[0] || {};


    if (latestRemote.id && latestRemote.id !== latestLocal.id) {
      notifier.notify({
        title: 'Node.js Release',
        icon: iconPath,
        message: latestRemote.title,
        wait: true
      });

      notifier.on('click', () => {
        opn(`${releasesURL}${latestRemote.link.attr.href}`);
        return process.exit(0);
      });
    }

    return latestRemote;
  })
  .catch(err => {
    winston.error(err);
    return process.exit(1);
  });
