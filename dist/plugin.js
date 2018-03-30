'use strict';

const fs = require('fs');
const path = require('path');
const R = require('ramda');
const chalk = require('chalk');
const ConfigClass = require('./config');
const constants = require('./constants');
const utils = require('./utils');

/**
 *
 * @param {Object} options it comes from webpack config
 */
function FAMPlugin(options) {
    this.opts = options;
}

FAMPlugin.prototype.apply = function (compiler) {

    try {

        let config = utils.getConfigFile(this.opts.config);

        const cc = new ConfigClass(config);

        compiler.plugin("emit", function (compilation, callback) {

            try {
                compilation.chunks.forEach(function (chunk) {
                    chunk.files.forEach(function (filename) {
                        const webpackEntry = chunk.name;
                        config = cc.setConfigSetAssets(webpackEntry, filename);
                    });
                });

                utils.writeConfigFile(cc.getContents(), cc.getPathFromRoot());
                callback();
            } catch (error) {
                console.log(error);
                callback();
            }
        });
    } catch (e) {
        utils.logError('There was and error: ', e);
    }
};

module.exports = FAMPlugin;