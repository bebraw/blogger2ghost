var suite = require('suite.js');

var convertTag = require('../lib/convert_tag');

suite(convertTag, [
    'foo', 'foo',
    'self help', 'self_help',
    'self-help', 'self__help',
    'another self help', 'another_self_help',
    'another-self-help', 'another__self__help',
    'SciFi', 'sci_fi',
    'sci-fi', 'sci__fi'
]);
