ap.json = (function () {

    var o = {
        init: function () {
        },
        isValid: function (data) {
            try {
                JSON.parse(data);
                return {valid: true, exception: null};
            }
            catch (ex) {
                console.warn(ex);
                return {valid: false, exception: ex};
            }
        },
        format: function (data) {
            var jsonObj = JSON.parse(data);
            var jsonPretty = JSON.stringify(jsonObj, null, '\t');

            return jsonPretty;
        },
        downloadJson: function (json, appendToView) {

            if (!!appendToView && !!json) {
                json = typeof json == "object" ? JSON.stringify(json) : json;
                var fileName = ap.file.newFileName("data", "json");
                this.download(json, appendToView, "text/json;charset=utf-8", fileName);
            }
        },
        download: function (data, appendToView, contentType, fileName) {
            if (!!appendToView && !!data) {
                var dataURI = contentType + "," + encodeURIComponent(data);
                $('<a href="data:' + dataURI + '" download="' + fileName + '">Download</a>').appendTo(appendToView);
            }
        }
    };

    return o;

})();