module.exports = function(str) {
    return str.replace(/ /g, '_').replace(/-/g, '__').replace(/[A-ZÅÄÖ]/g, function(match, i) {
        var prefix = i > 0? '_': '';

        return prefix + match.toLowerCase();
    });
};
