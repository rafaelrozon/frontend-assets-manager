const test = require("tape");
const utils = require("./../src/utils");
const constants = require("./../src/constants");
const fs = require("fs");
const path = require("path");
const R = require("ramda");
const ConfigClass = require("./../src/config");

const baseTemplate = path.resolve(__dirname, "./template_base.html");

const configMock = {
    defaults: {
        js: {
            regex: "js",
            prepend: ""
        },
        css: {
            regex: "css",
            prepend: ""
        },
        prettyPrint: true,
        pathFromRoot: "./src/assets.json"
    },
    config: {
        myApp: {
            entry: "myApp",
            dest: ["./tests/sub1/template.html", "./tests/sub2/template.html"],
            assets: {
                js: {
                    src: [
                        "myApp-7da312ce1c35525dc3e0.js",
                        "myApp-7da312ce1c35525dc3e2.js"
                    ],
                    regex: "",
                    prepend: ""
                },
                css: {
                    src: ["myApp-7da312ce1c35525dc3e0.css"],
                    regex: "",
                    prepend: ""
                }
            }
        }
    }
};

test("isJS for js", t => {
    const expected = true;
    const result = utils.isJS("js");
    t.equal(result, expected);
    t.end();
});

test("isJS for jsx", t => {
    const expected = true;
    const result = utils.isJS("jsx");
    t.equal(result, expected);
    t.end();
});

test("isCSS", t => {
    const expected = true;
    const result = utils.isCSS("css");
    t.equal(result, expected);
    t.end();
});

test("formatTag", t => {
    const expected = "    mytag\n    ";
    const result = utils.formatTag("mytag");
    t.equal(expected, result);
    t.end();
});

test("isJSFile", t => {
    const filename = "site_health_site_details.e71255ca6cb86d97a84d.js";
    const expected = true;
    const result = utils.isJSFile(filename);
    t.equal(result, expected);
    t.end();
});

test("isCSSFile", t => {
    const filename = "site_health_site_details.e71255ca6cb86d97a84d.css";
    const expected = true;
    const result = utils.isCssFile(filename);
    t.equal(result, expected);
    t.end();
});

test("getFileType: js", t => {
    const filename = "site_health_site_details.e71255ca6cb86d97a84d.js";
    const expected = constants.JS;
    let result = utils.getFileType(filename);
    t.equal(result, expected);
    t.end();
});

test("getFileType: css", t => {
    const filename = "site_health_site_details.e71255ca6cb86d97a84d.css";
    const expected = constants.CSS;
    let result = utils.getFileType(filename);
    t.equal(result, expected);
    t.end();
});

test("getConfigFile: it returns the content of the file", t => {
    const expected = {
        test: 123
    };
    const result = utils.getConfigFile("./tests/assets_base.json");
    t.deepEquals(expected, result);
    t.end();
});

test('getConfigFile: uses default file', (t) => {
    t.plan(2);

    t.test("getConfigFile main test", t => {
        const mockConstants = R.clone(constants);
        const expected = {
            test: 1234
        };
        const result = utils.getConfigFile("nonexistent.json");
        t.deepEquals(result, constants.DEFAULT_ASSETS);
        t.end();
    });

    t.test("getConfigFile end", function(t) {
        fs.unlinkSync(path.resolve(__dirname, "../nonexistent.json"));
        t.end();
    });

})


test("validateConfig: it throws an error if config is undefined", t => {
    t.throws(() => {
        const expected = {};
        const result = utils.validateConfig();
    });
    t.end();
});

test("validateConfig: it throws an error if config is empty", t => {
    t.throws(() => {
        const expected = {};
        const result = utils.validateConfig({});
    });
    t.end();
});

test("getStriptTag: returns a valid script tag", t => {
    const result = utils.getScriptTag("testfile.js");
    const expected = '<script src="testfile.js"></script>';
    t.equal(result, expected);
    t.end();
});

test("getLinkTag: returns a valid link tag", t => {
    const result = utils.getLinkTag("testfile.css");
    const expected = '<link rel="stylesheet" href="testfile.css">';
    t.equal(result, expected);
    t.end();
});

test("getRegexForReplace: returns a custom regex", t => {
    const result = utils.getRegexForReplace("myregex");
    const expected = `<!-- myregex -->${
    constants.INJECT_REGEX
  }<!-- endinject -->`;
    t.equal(result, expected);
    t.end();
});

test("getReplacement: returns a replacement wrapped in a inject block", t => {
    const result = utils.getReplacement("filename", "myregex");
    const expected = "<!-- myregex -->filename<!-- endinject -->";
    t.equal(result, expected);
    t.end();
});

test("injectAsset: inject a replacement inside a regex in a specified path", function(t) {
    t.plan(3);

    t.test("preparing file for injection", function(t) {
        fs.copyFileSync(baseTemplate, path.resolve(__dirname, "./template.html"));
        t.end();
    });

    t.test("injecting assets in file", function(t) {
        const regex = "myjs";
        const replacement = "myfile.js";
        const targetPath = path.resolve(__dirname, "template.html");
        const expectedInjectedContent = utils.getReplacement(replacement, regex);

        utils.injectAsset(regex, replacement, [targetPath]);

        const filecontent = fs.readFileSync(targetPath, {
            encoding: "utf8"
        });

        const hasContent = filecontent.indexOf(expectedInjectedContent);

        t.notEqual(hasContent, -1);
        t.end();
    });

    t.test("end", function(t) {
        fs.unlinkSync(path.resolve(__dirname, "template.html"));
        t.end();
    });
});

test("buildAssetFilesString for js", t => {
    const expected = `    \n        <script src="test1.js"></script>\n        <script src="test2.js"></script>\n    `;
    const files = ["test1.js", "test2.js"];
    const type = "js";
    const result = utils.buildAssetFilesString(files, type);
    t.equal(result, expected);
    t.end();
});

test("buildAssetFilesString for css", t => {
    const expected = `    \n        <link rel="stylesheet" href="test1.css">\n        <link rel="stylesheet" href="test2.css">\n    `;
    const files = ["test1.css", "test2.css"];
    const type = "css";
    const result = utils.buildAssetFilesString(files, type);
    t.equal(result, expected);
    t.end();
});

test("getConfig", t => {
    const params = {
        defaults: {
            b: 456
        },
        config: {
            a: 123
        }
    };

    const c = new ConfigClass(params);

    const expectedValue = params.config;
    const result = c.getConfig();
    t.equal(result, expectedValue);
    t.end();
});

test("getDefaults", t => {
    const params = {
        defaults: {
            b: 456
        },
        config: {
            a: 123
        }
    };

    const c = new ConfigClass(params);

    const expectedValue = params.defaults;
    const result = c.getDefaults();
    t.equal(result, expectedValue);
    t.end();
});

test("getDefaultJSRegex", t => {
    const params = {
        defaults: {
            js: {
                regex: "myjs:js",
                prepend: ""
            },
            css: {
                regex: "mycss:css",
                prepend: ""
            },
            prettyPrint: true,
            pathFromRoot: "./src/assets.json"
        },
        config: {}
    };

    const c = new ConfigClass(params);

    const expectedValue = params.defaults.js.regex;
    const result = c.getDefaultJSRegex();
    t.equal(result, expectedValue);
    t.end();
});

test("getConfigSetTarget", t => {
    const params = {
        defaults: {},
        config: {
            setA: {
                entry: "setA",
                dest: ["set_a.js"]
            },
            setB: {
                entry: "setB",
                dest: ["set_b.js"]
            }
        }
    };

    const c = new ConfigClass(params);
    const expectedValue = params.config.setA.dest;
    const result = c.getConfigSetTarget("setA");
    t.deepEquals(result, expectedValue);
    t.end();
});

test("getConsigSetAssets", t => {
    const copy = R.clone(configMock);
    const c = new ConfigClass(copy);
    const expectedValue = copy.config.myApp.assets;
    const result = c.getConsigSetAssets("myApp");
    t.deepEqual(result, expectedValue);
    t.end();
});

test("getConfigSetJS", t => {
    const copy = R.clone(configMock);
    const c = new ConfigClass(copy);
    const expectedValue = copy.config.myApp.assets.js;
    const result = c.getConfigSetJS("myApp");
    t.equal(result, expectedValue);
    t.end();
});

test("getConfigSetCSS", t => {
    const copy = R.clone(configMock);
    const c = new ConfigClass(copy);
    const expectedValue = copy.config.myApp.assets.css;
    const result = c.getConfigSetCSS("myApp");
    t.equal(result, expectedValue);
    t.end();
});

test("getAssetSrc: css type", t => {
    const copy = R.clone(configMock);
    const c = new ConfigClass(copy);
    const expectedValue = copy.config.myApp.assets.css.src;
    const result = c.getAssetSrc("myApp", constants.CSS);
    t.deepEquals(result, expectedValue);
    t.end();
});

test("getAssetSrc: js type", t => {
    const copy = R.clone(configMock);
    const c = new ConfigClass(copy);
    const expectedValue = copy.config.myApp.assets.js.src;
    const result = c.getAssetSrc("myApp", constants.JS);
    t.deepEquals(result, expectedValue);
    t.end();
});

test("getDefaultRegexForType", t => {
    const copy = R.clone(configMock);
    const c = new ConfigClass(copy);
    const expectedValue = copy.defaults.js.regex;
    const result = c.getDefaultRegexForType(constants.JS);
    t.equal(result, expectedValue);
    t.end();
});

test("getRegexForAsset: regex for js  asset is defined", t => {
    const copy = R.clone(configMock);
    copy.config.myApp.assets.js.regex = "myregex:js";
    const c = new ConfigClass(copy);
    const expectedValue = copy.config.myApp.assets.js.regex;
    const result = c.getRegexForAsset("myApp", constants.JS);
    t.equal(result, expectedValue);
    t.end();
});

test("getRegexForAsset: regex for js asset is not defined and default is returned", t => {
    const copy = R.clone(configMock);
    const c = new ConfigClass(copy);
    const expectedValue = copy.defaults.js.regex;
    const result = c.getRegexForAsset("myApp", constants.JS);
    t.equal(result, expectedValue);
    t.end();
});

test("getRegexForAsset: regex for css asset is defined", t => {
    const copy = R.clone(configMock);

    copy.config.myApp.assets.css.regex = "myregex:css";

    const c = new ConfigClass(copy);
    const expectedValue = copy.config.myApp.assets.css.regex;
    const result = c.getRegexForAsset("myApp", constants.CSS);
    t.equal(result, expectedValue);
    t.end();
});

test("getRegexForAsset: regex for js asset is not defined and default is returned", t => {
    const copy = R.clone(configMock);
    const c = new ConfigClass(configMock);
    const expectedValue = copy.defaults.css.regex;
    const result = c.getRegexForAsset("myApp", constants.CSS);
    t.equal(result, expectedValue);
    t.end();
});

test("getConfigSet", t => {
    const copy = R.clone(configMock);
    const c = new ConfigClass(configMock);
    const expectedValue = copy.config.myApp;
    const result = c.getConfigSet("myApp");
    t.deepEquals(result, expectedValue);
    t.end();
});

test("setConfigSetAssets: a new config set is created for a js file", t => {
    const c = new ConfigClass(configMock);
    const cpy = R.clone(configMock);
    const set = "myApp2";
    const filename = "myfile2.js";
    cpy.config[set] = {
        [constants.KEYS.WEBPACKENTRY]: set,
        [constants.KEYS.TARGET]: [],
        [constants.KEYS.ASSETS]: {
            [constants.KEYS.JS]: {
                [constants.KEYS.PATH]: [filename],
                [constants.KEYS.REGEX]: ""
            },
            [constants.KEYS.CSS]: {
                [constants.KEYS.PATH]: [],
                [constants.KEYS.REGEX]: ""
            }
        }
    };
    const expectedValue = cpy.config;
    const result = c.setConfigSetAssets("myApp2", filename);
    t.deepEquals(result, expectedValue);
    t.end();
});

test("nothing is created for files that are not js or css", t => {
    const copy = R.clone(configMock);
    const c = new ConfigClass(copy);
    const expectedValue = copy.config;
    const result = c.setConfigSetAssets("myApp2", "myfile2.html");
    t.deepEquals(result, expectedValue);
    t.end();
});

test("setConfigSetAssets: update to existing config set", t => {
    const copy = R.clone(configMock);
    const c = new ConfigClass(copy);
    const filename = "myfile2.js";
    // console.log('>>>> before', JSON.stringify(copy, null, '  '));
    copy.config.myApp.assets.js.src = [filename];
    // console.log('>>>>', JSON.stringify(copy, null, '  '));
    const expectedValue = copy.config;
    const result = c.setConfigSetAssets("myApp", filename);
    // console.log('>>>> result', JSON.stringify(copy, null, '  '));
    t.deepEquals(result, expectedValue);
    t.end();
});

test("getContents", t => {
    const copy = R.clone(configMock);

    const c = new ConfigClass(copy);
    const expectedValue = copy;
    const result = c.getContents("myApp");
    t.deepEquals(result, expectedValue);
    t.end();
});

test("getPathFromRoot", t => {
    const copy = R.clone(configMock);

    const c = new ConfigClass(copy);
    const expectedValue = copy.defaults.pathFromRoot;
    const result = c.getPathFromRoot("myApp");
    t.equal(result, expectedValue);
    t.end();
});

test("getAssetConfigDefaults", t => {
    const copy = R.clone(configMock);

    const c = new ConfigClass(copy);
    const set = "myTestPage";
    const expectedValue = {
        [constants.KEYS.WEBPACKENTRY]: set,
        [constants.KEYS.TARGET]: [],
        [constants.KEYS.ASSETS]: {
            [constants.KEYS.JS]: {
                [constants.KEYS.PATH]: [],
                [constants.KEYS.REGEX]: ""
            },
            [constants.KEYS.CSS]: {
                [constants.KEYS.PATH]: [],
                [constants.KEYS.REGEX]: ""
            }
        }
    };
    const result = c.getAssetConfigDefaults(set);
    t.deepEqual(result, expectedValue);
    t.end();
});

test("createConfigSet", t => {
    const copy = R.clone(configMock);
    const c = new ConfigClass(copy);
    const set = "myTestPage";
    copy.config[set] = {
        [constants.KEYS.WEBPACKENTRY]: set,
        [constants.KEYS.TARGET]: [],
        [constants.KEYS.ASSETS]: {
            [constants.KEYS.JS]: {
                [constants.KEYS.PATH]: [],
                [constants.KEYS.REGEX]: ""
            },
            [constants.KEYS.CSS]: {
                [constants.KEYS.PATH]: [],
                [constants.KEYS.REGEX]: ""
            }
        }
    };

    c.createConfigSet(set);

    const result = c.getConfig();
    t.deepEqual(result, copy.config);
    t.end();
});

test("processSrcPaths for js with no prepend", t => {
    const copy = R.clone(configMock);
    const c = new ConfigClass(copy);
    const expectedValue = copy.config.myApp.assets.js.src;
    const result = c.processSrcPaths("myApp", constants.JS);
    t.deepEquals(result, expectedValue);
    t.end();
});

test("processSrcPaths for js with prepend", t => {
    const copy = R.clone(configMock);
    copy.config.myApp.assets.js.prepend = "/dist/";

    const c = new ConfigClass(copy);
    const expectedValue = [
        "/dist/myApp-7da312ce1c35525dc3e0.js",
        "/dist/myApp-7da312ce1c35525dc3e2.js"
    ];
    const result = c.processSrcPaths("myApp", constants.JS);
    t.deepEqual(result, expectedValue);
    t.end();
});

test("processFilename: using default", t => {
    const copy = R.clone(configMock);
    copy.defaults.js.prepend = "/dist/";
    const c = new ConfigClass(copy);
    const expectedValue = "/dist/myfile.js";
    const result = c.processFilename("myfile.js", constants.JS, "myApp");
    t.deepEqual(result, expectedValue);
    t.end();
});

test("processFilename: using value from config set ", t => {
    const copy = R.clone(configMock);
    copy.config.myApp.prepend = "/dist/";
    const c = new ConfigClass(copy);
    const expectedValue = "/dist/myfile.js";
    const result = c.processFilename("myfile.js", constants.JS, "myApp");
    t.deepEqual(result, expectedValue);
    t.end();
});