#! /usr/bin/env node
const testdata = require('./tests/testdata.json');
const replace = require("replace");
const path = require('path');
const R = require('ramda');
const chalk = require('chalk');
const constants = require('./src/constants');
const utils = require('./src/utils');
const args = require('args');
const fs = require('fs');
const ConfigClass = require('./src/config');

const getCliOptions = () => {

    args.options([
        {
            name: 'config',
            description: 'Path to the config file',
            defaultValue: './assets.json'
          }
    ]);

    return args.parse(process.argv);
};


const handlePageAssets = (configSet, cc) => {
    handleAsset(configSet, constants.JS, cc);
    handleAsset(configSet, constants.CSS, cc);
};

const handleAsset = (configSet, type, cc) => {
    console.log('handleAsset', configSet, type);
    const sourcePaths = cc.getSourcePathsForType(configSet, type);
    console.log('sourcePaths ', sourcePaths);

    if (sourcePaths && !R.isEmpty(sourcePaths)) {

        const regex = cc.getRegexForAsset(configSet, type)

        const replacement = utils.buildAssetFilesString(sourcePaths, type);

        const targetPath = cc.getConfigSetTarget(configSet);

        utils.injectAsset(regex, replacement, targetPath);

    }
};

const run = () => {

    try {
        utils.logInfo('Injecting assets...');

        const userInput = getCliOptions();

        const config = utils.getConfigFile(userInput.config, constants.DEFAULT_CONFIG_FILENAME);

        utils.validateConfig(config);

        const cc = new ConfigClass(config);

        const consfigSets = R.keys(cc.getConfig());

        consfigSets.forEach((configSet) => handlePageAssets(configSet, cc));

        utils.logInfo('Done!');

    } catch (error) {
        utils.logError('There was an error: ', error);
    }

};

run();