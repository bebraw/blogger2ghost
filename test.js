#!/usr/bin/env node
var convert = require('./convert');


main();

function main() {
    console.log(JSON.stringify(convert('demo.json')));
}

