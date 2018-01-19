const test = require('tape');
const utils = require('./../src/utils');
const constants = require('./../src/constants');
const fs = require('fs');
const path = require('path');

const baseTemplate = path.resolve(__dirname, './template_base.html');

test('Sample test', function (t) {
    t.equal(1, 1);
    t.end();
});

test('isJSFile', (t) => {
    const filename = 'site_health_site_details.e71255ca6cb86d97a84d.js';
    const expected = true;
    let result = utils.isJSFile(filename);
    t.equal(result, expected);
    t.end();
});

test('getFileType', (t) => {
    const filename = 'site_health_site_details.e71255ca6cb86d97a84d.js';
    const expected = constants.JS;
    let result = utils.getFileType(filename);
    t.equal(result, expected);
    t.end();
});

// test('validateConfig throws error when undefined is passed in', function (t) {
//     t.equal(utils.validateConfig(), undefined);
//     t.end();
// });

// test('validateConfig throws error when null is passed in', (t) => {
//     t.equal(utils.validateConfig(), undefined);
//     t.end();
// });

// test('validateConfig throws error when empty object is passed in', (t) => {
//     t.equal(utils.validateConfig(), undefined);
//     t.end();
// });

test('getStriptTag: returns a valid script tag', (t) => {
    const result = utils.getScriptTag('testfile.js');
    const expected = '<script src="testfile.js"></script>';
    t.equal(result, expected);
    t.end();
});

test('getLinkTag: returns a valid link tag', (t) => {
    const result = utils.getLinkTag('testfile.css');
    const expected = '<link rel="stylesheet" href="testfile.css">';
    t.equal(result, expected);
    t.end();
});

test('getRegexForReplace: returns a custom regex', (t) => {
    const result = utils.getRegexForReplace('myregex');
    const expected = '<!-- /myregex/ -->[\\s\\S]*<!-- /end-of-myregex-inject/ -->';
    t.equal(result, expected);
    t.end();
});

test('getReplacement: returns a replacement wrapped in a inject block', (t) => {
    const result = utils.getReplacement('filename', 'myregex');
    const expected = '<!-- /myregex/ -->filename<!-- /end-of-myregex-inject/ -->';
    t.equal(result, expected);
    t.end();
});

test('injectAsset: inject a replacement inside a regex in a specified path', function(t) {

    t.plan(3);

    t.test('before', function(t) {
        fs.copyFileSync(baseTemplate, path.resolve(__dirname, './template.html'));
        t.end();
    });

    t.test('middle', function(t) {
        const regex = 'myjs';
        const replacement = 'myfile.js';
        const targetPath = path.resolve(__dirname, "template.html");
        const expectedInjectedContent = utils.getReplacement(replacement, regex);

        utils.injectAsset(regex, replacement, [targetPath]);

        const filecontent = fs.readFileSync(targetPath, { encoding: 'utf8' });

        const hasContent = filecontent.indexOf(expectedInjectedContent);

        t.notEqual(hasContent, -1);
        t.end();
    });


    t.test('end', function(t) {
        fs.unlinkSync(path.resolve(__dirname, "template.html"));
        t.end();
    });

});

