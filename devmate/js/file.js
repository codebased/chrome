ap.file = (function () {

    var o = {
        init: function () {
        },
        newFileName: function (prefix, extension) {
            prefix = !!prefix ? prefix : "data";
            extension = !!extension ? (extension.substring(0, 1) == "." ? extension : "." + extension) : "";

            var fileName = prefix + '-' + (new Date()).getTime() + extension;
            return fileName;
        }

    };

    return o;

})();