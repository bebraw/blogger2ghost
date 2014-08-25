'use strict';

var Download = require('download');
var async = require('async');


module.exports = function(folder, images, limit, callback) {
    async.eachLimit(images, limit, function(image, cb) {
        var download = new Download();

        download.get(image, folder);
        download.run(function(err) {
            if (err) {
                console.error(err);
            }

            cb();
        });
    }, function(err) {
        if (err) {
            console.error(err);
        }

        callback();
    });
};
