#!/usr/bin/env node
var program = require('commander');

var convert = require('./lib/convert');
var loadJSON = require('./lib/load_json');

var VERSION = require('./package.json').version;


main();

function main() {
    program.version(VERSION).
        option('-i --input <input file>').
        parse(process.argv);

    if(!program.input) {
        return console.error('Missing input file! Pass it using -i parameter');
    }

    loadJSON(program.input, function(err, json) {
        if(err) {
            return console.error('Failed to load input JSON');
        }

        console.log(JSON.stringify(convert(json)));
    });
}

