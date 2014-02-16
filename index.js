#!/usr/bin/env node
var program = require('commander');

var convert = require('./convert');
var loadJSON = require('./load_json');

var VERSION = require('./package.json').version;


main();

function main() {
    program.version(VERSION).
        option('-i --input <input file>').
        parse(process.argv);

    if(!program.input) {
        return console.error('Missing input file! Pass it using -i parameter');
    }

    var json = loadJSON(program.input);

    if(!json) {
        return console.error('Failed to load input JSON');
    }

    console.log(JSON.stringify(convert(json)));
}
