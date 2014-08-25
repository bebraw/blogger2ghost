'use strict';

var fs = require('fs');


module.exports = function(input, cb) {
    fs.readFile(input, 'utf-8', function(err, d) {
        if(err) {
            return cb(err);
        }

        cb(null, JSON.parse(d));
    });
};
