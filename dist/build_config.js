#! /usr/bin/env node
'use strict';

const constants = require('./constants');
const fs = require('fs');
const utils = require('./utils');
const jsonFormat = require('json-format');

const buildAssetsFile = () => {

    const K = constants.KEYS;

    const defaultConfig = {
        [K.META]: {
            [K.JS]: {
                [K.REGEX]: "js"
            },
            [K.CSS]: {
                [K.REGEX]: "css"
            },
            [K.PRETTY_PRINT]: true,
            [K.PATH_FROM_ROOT]: "./assets.json"
        },
        [K.PAGES]: {
            "sample": {
                [K.PATH]: [],
                [K.ASSETS]: {
                    [K.JS]: {
                        [K.PATH]: [],
                        [K.REGEX]: "myjs"
                    },
                    [K.CSS]: {
                        [K.PATH]: [],
                        [K.REGEX]: "mycss"
                    }
                }
            }
        }
    };

    fs.writeFileSync(constants.DEFAULT_CONFIG_PATH, jsonFormat(defaultConfig, { type: 'space', size: 2 }));
};

buildAssetsFile();