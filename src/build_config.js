#! /usr/bin/env node
const constants = require('./constants');
const fs = require('fs');
const utils = require('./utils');
const jsonFormat = require('json-format');

const buildAssetsFile = () => {

    const K = constants.KEYS;

    const defaultConfig = {
        [K.META]: {
            [K.JS]: {
                [K.REGEX]: "js",
                [K.PREPEND]: ""
            },
            [K.CSS]: {
                [K.REGEX]: "css",
                [K.PREPEND]: ""
            },
            [K.PRETTY_PRINT]: true,
            [K.PATH_FROM_ROOT]: "./assets.json",
        },
        [K.PAGES]: {
            "sample": {
                [K.TARGET]: [],
                [K.ASSETS]: {
                    [K.JS]: {
                        [K.PATH]: [],
                        [K.REGEX]: "myjs",
                        [K.PREPEND]: ""
                    },
                    [K.CSS]: {
                        [K.PATH]: [],
                        [K.REGEX]: "mycss",
                        [K.PREPEND]: ""
                    }
                }
            }
        }
    };

    fs.writeFileSync(constants.DEFAULT_CONFIG_PATH, jsonFormat(defaultConfig, { type: 'space', size: 2 }));
};


buildAssetsFile();