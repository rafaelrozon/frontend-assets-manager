#! /usr/bin/env node
const replace = require("replace");
const path = require('path');
const R = require('ramda');
const chalk = require('chalk');
const constants = require('./constants');
const utils = require('./utils');
const args = require('args');
const fs = require('fs');
const ConfigClass = require('./config');

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

const handleAsset = (configSet, type, cc) => {

    // get js or css source files
    const sourcePaths = cc.getAssetSrc(configSet, type);

    if (sourcePaths && !R.isEmpty(sourcePaths)) {

        // get regex
        const regex = cc.getRegexForAsset(configSet, type)

        // build asset string
        const replacement = utils.buildAssetFilesString(sourcePaths, type);

        // get file to inject the asset
        const targetPath = cc.getConfigSetTarget(configSet);

        // inject the asset in the target
        utils.injectAsset(regex, replacement, targetPath);

    }
};

const run = () => {

    try {

        const userInput = getCliOptions();

        utils.logInfo('Injecting assets...');

        const { config: configFile } = userInput;

        const config = utils.getConfigFile(configFile);

        const cc = new ConfigClass(config);

        const consfigSets = R.keys(cc.getConfig());

        consfigSets.forEach((configSet) => {
            handleAsset(configSet, constants.JS, cc);
            handleAsset(configSet, constants.CSS, cc);
        });

        utils.logInfo('Done!');

    } catch (error) {
        utils.logError('There was an error: ', error);
    }

};

run();