'use strict';

const fs = require('fs');
const path = require('path');
const constants = require('./constants');
const utils = require('./utils');
const R = require('ramda');
const chalk = require('chalk');
const ConfigClass = require('./config');

function HelloWorldPlugin(options) {
    this.opts = options;
}

const updatePageAssets = (webpackEntry, filename, cc) => {
    console.log('>>>> updatePageAssets >>>>', webpackEntry, filename);
    const configCopy = R.clone(config);

    if (utils.isJSFile(filename)) {
        configCopy.pages[webpackEntry].assets.js.path = [filename];
    } else if (utils.isCssFile(filename)) {
        configCopy.pages[webpackEntry].assets.css.path = [filename];
    }

    return configCopy;
};

HelloWorldPlugin.prototype.apply = function (compiler) {

    try {
        console.log('>>>>>>>>>>>>>>', this.opts);
        let config = utils.getConfigFile(this.opts.config);

        const cc = new ConfigClass(config);

        console.log('config is ', config);

        compiler.plugin("emit", function (compilation, callback) {

            compilation.chunks.forEach(function (chunk) {
                console.log('chunk ', chunk);
                chunk.files.forEach(function (filename) {

                    const webpackEntry = chunk.name;
                    console.log('filename is ', filename);
                    config = cc.setConfigSetAssets(webpackEntry, filename);
                    //updatePageAssets(webpackEntry, filename, cc);
                });
            });

            utils.writeConfigFile(cc.getContents(), cc.getPathFromRoot());

            callback();
        });
    } catch (e) {
        utils.logError('There was and error: ', e);
        callback();
    }
};

module.exports = HelloWorldPlugin;