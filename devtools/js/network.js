ap.network = (function () {

    var o = {
        init: function () {
        },
        hasConnection: function () {
            return navigator.onLine;
        }
    }

    o.init();
    return o;
})();