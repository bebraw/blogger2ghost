#!/usr/bin/env node
var program = require('commander');

var convert = require('./lib/convert');
var loadJSON = require('./lib/load_json');

var VERSION = require('./package.json').version;


main();

function main() {
    program.version(VERSION).
        option('-i --input <input file>').
        option('-a --authors <authors file>').
        parse(process.argv);

    if(!program.input) {
        return console.error('Missing input file! Pass it using -i parameter');
    }

    loadJSON(program.input, function(err, json) {
        if(err) {
            return console.error('Failed to load input JSON');
        }

        loadJSON(program.authors, function(err, authors) {
            if(err) {
                console.warn('Authors JSON not specified or invlaid');
            }

            json.authors = authors || {};

            console.log(JSON.stringify(convert(json)));
        });
    });
}

