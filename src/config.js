const R = require('ramda');
const constants = require('./constants');
const utils = require('./utils');

class Config {

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

    getDefaultJSRegex() {
        return this.defaults.js.regex;
    }

    getConfigSet(set) {
        return this.getConfig()[set];
    }

    getConfigSetTarget(set) {
        return this.getConfigSet(set).target;
    }

    getConsigSetAssets(set) {
        return this.getConfigSet(set).assets;
    }

    getConfigSetJS(set) {
        return this.getConsigSetAssets(set).js;
    }

    getConfigSetCSS(set) {
        return this.getConsigSetAssets(set).css;
    }

    getSourcePathsForType(set, type) {
        if (utils.isJS(type)) {
            return this.getJSSourcePaths(set);
        } else if (utils.isCSS(type)) {
            return this.getCSSSourcePaths(set);
        }
    }

    getJSSourcePaths(set) {
        return this.getConfigSetJS(set).sourcePaths;
    }

    getJSRegex(set) {
        return this.getConfigSetJS(set).regex;
    }

    getCSSSourcePaths(set) {
        return this.getConfigSetCSS(set).sourcePaths;
    }

    getCSSRegex(set) {
        return this.getConfigSetCSS(set).regex;
    }

    getDefaultRegexForType(type) {
        return this.getDefaults()[type].regex;
    }

    getRegexForAsset(set, type) {
        const assetConfig = this.getConsigSetAssets(set);
        const assetRegex = assetConfig[type].regex;
        return assetRegex && !R.isEmpty(assetRegex) ? assetRegex : this.getDefaultRegexForType(type)
    }

    getConfigSetForWebpackEntry(webpackEntry) {

        const config = this.getConfig();
        const found = R.keys(config).filter((configSet) => {
            return config[configSet].webpackEntry === webpackEntry;
        })

        return found[0];
    }

    setConfigSetAssets(webpackEntry, filename) {
        console.log('setConfigAssets ', webpackEntry, filename);

        const type = utils.getFileType(filename);
        console.log('>> type ', type);
        if (utils.isJS(type) || utils.isCSS(type)) {

            const configSet = this.getConfigSetForWebpackEntry(webpackEntry);

            if (R.keys(this.config) === 0 || !configSet) {
                console.log('init configSet', configSet)
                this.createConfigSet(webpackEntry);
            }
            console.log('>>> config is ', this.config, configSet);
            this.config[webpackEntry].assets[type].sourcePaths = [this.processFilename(filename, type, configSet)];
            console.log('>>> config is after update', JSON.stringify(this.config));
        }
    }

    getContents() {
        return {
            [constants.KEYS.META]: this.defaults,
            [constants.KEYS.PAGES]: this.config
        };
    }

    getPathFromRoot() {
        return this.defaults.pathFromRoot;
    }

    processFilename(filename, type, configSet) {
        console.log('>>>> processFilename', filename, type, configSet, this.config[configSet])
        let finalFilename = filename;

        if (this.defaults[type].prepend) {
            finalFilename = `${this.defaults[type].prepend}${filename}`;
        }

        if (this.config[configSet].prepend) {
            finalFilename = `${this.config[configSet].prepend}${filename}`;
        }

        if (this.config[configSet].assets[type].prepend) {
            finalFilename = `${this.config[configSet].assets[type].prepend}${filename}`;
        }

        return finalFilename;
    }

    getAssetConfigDefaults(set) {
        return {
            [constants.KEYS.WEBPACKENTRY]: set,
            [constants.KEYS.TARGET]: [],
            [constants.KEYS.ASSETS]: {
                [constants.KEYS.JS]: {
                    [constants.KEYS.PATH]: [],
                    [constants.KEYS.REGEX]: ""
                },
                [constants.KEYS.CSS]: {
                    [constants.KEYS.PATH]: [],
                    [constants.KEYS.REGEX]: ''
                }
            }
        }
    }

    getConfigDefaults() {
        return {
            [constants.KEYS.META]: {
                [constants.KEYS.JS]: {
                    [constants.KEYS.REGEX]: constants.KEYS.JS,
                    [constants.KEYS.PREPEND]: ""
                  },
                  [constants.KEYS.CSS]: {
                    [constants.KEYS.REGEX]: constants.KEYS.CSS,
                    [constants.KEYS.PREPEND]: ""
                  },
                  [constants.KEYS.PRETTY_PRINT]: true,
                  [constants.KEYS.PATH_FROM_ROOT]: "./assets.json"
            }
        }
    }

    createConfigSet(set) {
        this.config[set] = this.getAssetConfigDefaults(set);
    }

};


module.exports = Config;