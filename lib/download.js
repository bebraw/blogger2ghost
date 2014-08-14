var Download = require('download');

module.exports = function(folder, images, cb) {

    var download = new Download();

    images.forEach(function(image) {
        download.get({
            url: image.url,
            name: image.name
        }, folder);
    });

    download.run(function(err) {
        if (err) {
            throw err;
        }

        cb();
    });

};
