var suite = require('suite.js');

var convertTag = require('../lib/convert_tag');

suite(convertTag, [
    'foo', 'Foo',
    'self help', 'Self Help',
    'self-help', 'Self-help',
    'another self help', 'Another Self Help',
    'another-self-help', 'Another-self-help',
    'SciFi', 'Scifi',
    'SciFiToo', 'Scifitoo',
    'sci-fi', 'Sci-fi'
]);
