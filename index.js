#!/usr/bin/env node
'use strict';

var program = require('commander');

var convert = require('./lib/convert');
var loadJSON = require('./lib/load_json');
var download = require('./lib/download');

var VERSION = require('./package.json').version;

main();

function main() {
    program.version(VERSION)
        .option('-i, --input <input file>', 'JSON file from Blogger')
        .option('-a, --authors <authors file>', 'JSON file of authors - see README')
        .option('-d, --download <download folder>', 'Folder to be created and populated with images')
        .option('-l, --download-limit <connections number>', 'Concurrent connections limit, default: 5')
        .option('-t, --remove-tables', 'Remove tables from posts')
        .option('-s --strip-diacritics', 'Strip diacritics from tags')
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
    program.authors = authors || {};

    var result = convert(json, program);

    if (result.images && program.download) {
        console.warn('Downloading ' + result.images.length + ' images, this may take some time');

        download(program.download, result.images, program.downloadLimit || 5, function() {
            delete result.images;

            console.log(JSON.stringify(result));
        });

    } else {
        console.log(JSON.stringify(result));
    }
}