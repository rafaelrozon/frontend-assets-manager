#! /usr/bin/env node
'use strict';

const constants = require('./constants');
const fs = require('fs');
const utils = require('./utils');
const jsonFormat = require('json-format');

const buildAssetsFile = () => {

    const K = constants.KEYS;

    const defaultConfig = {
        [K.DEFAULTS]: {
            [K.JS]: {
                [K.REGEX]: "js",
                [K.PREPEND]: ""
            },
            [K.CSS]: {
                [K.REGEX]: "css",
                [K.PREPEND]: ""
            },
            [K.PRETTY_PRINT]: true,
            [K.PATH_FROM_ROOT]: "./assets.json"
        },
        [K.CONFIG]: {
            "sample": {
                [K.DEST]: [],
                [K.ASSETS]: {
                    [K.JS]: {
                        [K.SRC]: [],
                        [K.REGEX]: "",
                        [K.PREPEND]: ""
                    },
                    [K.CSS]: {
                        [K.SRC]: [],
                        [K.REGEX]: "",
                        [K.PREPEND]: ""
                    }
                }
            }
        }
    };

    fs.writeFileSync(constants.DEFAULT_CONFIG_PATH, jsonFormat(defaultConfig, { type: 'space', size: 2 }));
};

buildAssetsFile();