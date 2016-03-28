ap.url = (function () {

    var o = {
        init: function () {
        },
        tinyurl: function (url, callback) {
            if (!!url && url.indexOf("/tinyurl.com/") == -1) {
                $.post("http://tinyurl.com/create.php", {url: url}, function (data) {
                    if (!!data) {
                        var result = data.match(/http:\/\/tinyurl\.com\/(\w)+/ig);
                        if (!!result && result.constructor === Array) {
                            result = result[0];
                        }
                    }
                    callback(result)
                }).fail(function () {
                    callback(null);
                });
            }
            else if (url.indexOf("/tinyurl.com/") === -1) {
                callback(null);
            } else {
                callback(url);
            }
        }
    };

    o.init();
    return o;

})();