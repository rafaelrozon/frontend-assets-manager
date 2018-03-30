const JS = 'js';
const CSS = 'css';
const JSX = 'jsx';
const DEFAULT_CONFIG_PATH = './assets.json';
const INJECT_REGEX = '[\\S\\s]*?';
const KEYS = {
    DEFAULTS: 'defaults',
    JS: 'js',
    REGEX: 'regex',
    CSS: 'css',
    PRETTY_PRINT: 'prettyPrint',
    PATH_FROM_ROOT: 'pathFromRoot',
    CONFIG: 'config',
    NAME: 'name',
    SRC: 'src',
    ASSETS: 'assets',
    ENTRY: 'entry',
    DEST: 'dest',
    PREPEND: 'prepend',
};

const DEFAULT_ASSETS = {
    [KEYS.DEFAULTS]: {
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