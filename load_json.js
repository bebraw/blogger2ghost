module.exports = function(input) {
    try {
        return require(input);
    }
    catch(e) {
        try {
            return require('./' + input);
        }
        catch(e) {}
    }
};
