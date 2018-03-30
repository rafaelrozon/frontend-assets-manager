'use strict';

const R = require('ramda');
const constants = require('./constants');
const utils = require('./utils');

const K = constants.KEYS;

class Config {

    /**
     * This is the content of the assets.json file
     * data: {
     *      defaults: {
     *
     *      },
     *      config: {
     *
     *      }
     * }
     * @param {object} data
     */
    constructor(data) {
        this.defaults = data.defaults;
        this.config = data.config;
    }

    getConfig() {
        return this.config;
    }

    getDefaults() {
        return this.defaults;
    }

    getJSDefaults() {
        return this.getDefaults()[K.JS];
    }

    getDefaultJSRegex() {
        return this.getJSDefaults()[K.REGEX];
    }

    getConfigSet(set) {
        return this.getConfig()[set];
    }

    /**
     * Get the target file that will receive the assets
     * @param {string} set
     */
    getConfigSetTarget(set) {
        return this.getConfigSet(set)[K.DEST];
    }

    getConsigSetAssets(set) {
        console.log('getConsigSetAssets', set);
        return this.getConfigSet(set)[K.ASSETS];
    }

    getConfigSetJS(set) {
        return this.getConsigSetAssets(set)[K.JS];
    }

    getConfigSetCSS(set) {
        return this.getConsigSetAssets(set)[K.CSS];
    }

    getAssetSrc(set, type) {
        if (utils.isJS(type)) {
            return this.getJSSourcePaths(set);
        } else if (utils.isCSS(type)) {
            return this.getCSSSourcePaths(set);
        }
    }

    /**
     * Get the source files for the specified type and prepend a string if specified
     * @param {string} set  configSet entry
     * @param {string} type js or css
     */
    processSrcPaths(set, type) {

        const sourceFiles = this.getConsigSetAssets(set)[type][K.SRC];
        const that = this;
        const files = sourceFiles.map(file => that.processFilename(file, type, set));

        return files;
    }

    getJSSourcePaths(set) {
        return this.processSrcPaths(set, constants.JS);
    }

    getCSSSourcePaths(set) {
        return this.processSrcPaths(set, constants.CSS);
    }

    getDefaultRegexForType(type) {
        return this.getDefaults()[type][K.REGEX];
    }

    /**
     * Get the regex for the type specified in the config set, if not present use the defaults
     * @param {*} set
     * @param {*} type
     */
    getRegexForAsset(set, type) {
        const assetConfig = this.getConsigSetAssets(set);
        const assetRegex = assetConfig[type][K.REGEX];
        return assetRegex && !R.isEmpty(assetRegex) ? assetRegex : this.getDefaultRegexForType(type);
    }

    setConfigSetAssets(entry, filename) {

        const type = utils.getFileType(filename);

        // only handle js or css files
        if (utils.isJS(type) || utils.isCSS(type)) {

            const configSet = this.getConfigSet(entry);

            // if the config set does not exist yet, create a new one
            if (R.keys(this.config) === 0 || !configSet) {
                this.createConfigSet(entry);
            }

            // add the file name to the config set
            this.config[entry][K.ASSETS][type][K.SRC] = [filename];
        }

        return this.config;
    }

    getContents() {
        return {
            [constants.KEYS.DEFAULTS]: this.defaults,
            [constants.KEYS.CONFIG]: this.config
        };
    }

    getPathFromRoot() {
        return this.defaults[K.PATH_FROM_ROOT];
    }

    processFilename(filename, type, webpackEntry) {

        let finalFilename = filename;

        if (this.defaults[type][K.PREPEND]) {
            finalFilename = `${this.defaults[type][K.PREPEND]}${filename}`;
        }

        if (this.config[webpackEntry][K.PREPEND]) {
            finalFilename = `${this.config[webpackEntry][K.PREPEND]}${filename}`;
        }

        if (this.config[webpackEntry][K.ASSETS][type][K.PREPEND]) {
            finalFilename = `${this.config[webpackEntry][K.ASSETS][type][K.PREPEND]}${filename}`;
        }

        return finalFilename;
    }

    getAssetConfigDefaults(set) {
        return {
            [K.ENTRY]: set,
            [K.DEST]: [],
            [K.ASSETS]: {
                [K.JS]: {
                    [K.SRC]: [],
                    [K.REGEX]: ""
                },
                [K.CSS]: {
                    [K.SRC]: [],
                    [K.REGEX]: ''
                }
            }
        };
    }

    createConfigSet(set) {
        this.config[set] = this.getAssetConfigDefaults(set);
    }

};

module.exports = Config;