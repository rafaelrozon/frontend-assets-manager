const fs = require('fs');
const path = require('path');
const constants = require('./constants');
const utils = require('./utils');
const R = require('ramda');
const chalk = require('chalk');
const ConfigClass = require('./config');

function FAMPlugin(options) {
    this.opts = options;
}

FAMPlugin.prototype.apply = function (compiler) {

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

module.exports = FAMPlugin;