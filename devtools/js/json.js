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
        }
    };

    return o;

})();