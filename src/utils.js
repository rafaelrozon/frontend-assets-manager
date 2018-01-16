const constants = require('./constants');
const replace = require("replace");
const path = require('path');
const R = require('ramda');
const chalk = require('chalk');
const fs = require('fs');

const isJS = (type) => {
    return type === constants.JS || type === constants.JSX;
};

const isCSS = (type) => {
    return type === constants.CSS;
};

const outputConfig = (config) => {
    if (config.defaults.prettyPrint) {
        return JSON.stringify(config, null, '  ');
    } else {
        return JSON.stringify(config);
    }
};
const isJSFile = (filename) => {
    const ext = path.extname(filename);
    return ext === `.${constants.JS}` || ext === `.${constants.JSX}`;
};

const isCssFile = (filename) => {
    const ext = path.extname(filename);
    return ext === `.${constants.CSS}`;
}

const getConfigFile = (configFilePath = constants.DEFAULT_CONFIG_PATH) => {
    const config = fs.readFileSync(configFilePath, { encoding: 'utf8' });
    return JSON.parse(config);
};

const writeConfigFile = (config, path) => {
    fs.writeFileSync(path, outputConfig(config));
}

const validateConfig = (config) => {
    if (R.isNil(config) || R.isEmpty(config)) {
        throw new Error('Invalid Config');
    }
};

const logError = (msg, error) => {
    console.error(chalk.red(msg, error));
};

const logInfo = (msg) => {
    console.log(chalk.blue(msg));
}

const formatTag = (tag) => `${tag}\n\t`;

const getScriptTag = (filename) => `<script src="${filename}"></script>`;

const getLinkTag = (filename) => `<link rel="stylesheet" href="${filename}">`;

const getReplacement = (replacement, regex) => `<!-- /${regex}/ -->${replacement}<!-- /end-of-${regex}-inject/ -->`;

const getRegexForReplace = (customRegex) => `<!-- /${customRegex}/ -->[\\s\\S]*<!-- /end-of-${customRegex}-inject/ -->`;

const injectAsset = (regex, replacement, targetPath) => {
    console.log('injectAsset ', regex, replacement, targetPath)
    const finalRegex = getRegexForReplace(regex);
    const finalReplacement = getReplacement(replacement, regex);
    console.log('>> final ', finalRegex);
    console.log('>> final ', finalReplacement);
    replace({
        regex: finalRegex,
        replacement: finalReplacement,
        paths: targetPath,
        recursive: false,
        silent: true,
    });

};

const buildAssetFilesString = (assetFiles, type) => {

    let content = '\n\t';
    const tagFn = isJS(type) ? getScriptTag : getLinkTag;

    assetFiles.forEach((asset) => {
        content += formatTag(tagFn(asset));
    });

    return content;
};


const getFileType = (filename) => {

    const isJSType = isJSFile(filename);
    const isCSSType = isCssFile(filename);

    if (isJSType) {
        return constants.JS;
    } else if (isCSSType) {
        return constants.CSS;
    }

};

module.exports = {
    outputConfig,
    isCssFile,
    isJSFile,
    getConfigFile,
    validateConfig,
    writeConfigFile,
    logError,
    logInfo,
    formatTag,
    getScriptTag,
    getLinkTag,
    getReplacement,
    getRegexForReplace,
    injectAsset,
    buildAssetFilesString,
    isJS,
    isCSS,
    getFileType
};