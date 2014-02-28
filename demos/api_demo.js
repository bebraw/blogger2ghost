#!/usr/bin/env node
var convert = require('../lib/convert');
var loadJSON = require('../lib/load_json');
var extension = require('./extension');


main();

function main() {
    loadJSON('demo.json', function(err, json) {
        if(err) {
            return console.error(err);
        }

        console.log(JSON.stringify(convert(json, extension)));
    });
}

