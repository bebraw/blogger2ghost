#!/usr/bin/env node
var convert = require('./convert');
var loadJSON = require('./load_json');


main();

function main() {
    console.log(JSON.stringify(convert(loadJSON('demo.json'))));
}

