const JS = 'js';
const CSS = 'css';
const JSX = 'jsx';
const DEFAULT_CONFIG_PATH = './assets.json';
const INJECT_REGEX = '[\\S\\s]*?';
const KEYS = {
    META: 'defaults',
    JS: 'js',
    REGEX: 'regex',
    CSS: 'css',
    PRETTY_PRINT: 'prettyPrint',
    PATH_FROM_ROOT: 'pathFromRoot',
    PAGES: 'config',
    NAME: 'name',
    PATH: 'src',
    ASSETS: 'assets',
    WEBPACKENTRY: 'entry',
    TARGET: 'dest',
    PREPEND: 'prepend',
    CONFIG: 'config'
};

const DEFAULT_ASSETS = {
    [KEYS.META]: {
        [KEYS.JS]: {
            [KEYS.REGEX]: KEYS.JS,
            [KEYS.PREPEND]: ""
          },
          [KEYS.CSS]: {
            [KEYS.REGEX]: KEYS.CSS,
            [KEYS.PREPEND]: ""
          },
          [KEYS.PRETTY_PRINT]: true,
          [KEYS.PATH_FROM_ROOT]: "./assets.json"
    },
    [KEYS.CONFIG]: {}
};

module.exports = {
    JS,
    CSS,
    JSX,
    DEFAULT_CONFIG_PATH,
    KEYS,
    DEFAULT_ASSETS,
    INJECT_REGEX
};