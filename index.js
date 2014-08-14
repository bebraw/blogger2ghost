#!/usr/bin/env node

var program = require('commander');

var convert = require('./lib/convert');
var loadJSON = require('./lib/load_json');
var download = require('./lib/download');

var VERSION = require('./package.json').version;

main();

function main() {
    program.version(VERSION)
        .option('-i --input <input file>')
        .option('-a --authors <authors file>')
        .option('-d --download <download location>')
        .parse(process.argv);

    if (!program.input) {
        return console.error('Missing input file! Pass it using -i parameter');
    }

    loadJSON(program.input, function(err, json) {
        if (err) {
            return console.error('Failed to load input JSON');
        }

        if (program.authors) {
            loadJSON(program.authors, function(err, authors) {
                if (err) {
                    return console.warn('Failed to load authors JSON');
                }

                runTask(json, program, authors);
            });

        } else {
            runTask(json, program);
        }
    });
}

function runTask(json, program, authors) {
    var result = convert(json, {
        authors: authors || {},
        download: program.download
    });

    if (result.images && program.download) {
        console.warn('Downloading ' + result.images.length + ' images, this may take some time');

        download(program.download, result.images, function() {
            delete result.images;

            console.log(JSON.stringify(result));
        });

    } else {                
        console.log(JSON.stringify(result));
    }    
}