#!/usr/bin/env node
var program = require('commander');

var convert = require('./convert');

var VERSION = require('./package.json').version;


main();

function main() {
    program.version(VERSION).
        option('-i --input <input file>').
        parse(process.argv);

    if(!program.input) {
        return console.error('Missing input file! Pass it using -i parameter');
    }

    console.log(JSON.stringify(convert(program.input)));
}

