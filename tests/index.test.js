const test = require('tape');
const utils = require('./../src/utils');
const constants = require('./../src/constants');

test('Sample test', function (t) {
    t.equal(1,2);
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
    console.log('>>>> ', result);
    t.equal(result, expected);
    t.end();
});