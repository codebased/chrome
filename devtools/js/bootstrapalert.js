ap.bootstrapalert = (function () {
    var o = {
        init: function () {

        },
        warn: function (object, message) {
            $(object).html('<div id="alertbox" class="alert alert-danger alert-dismissable"><button type="button" class="close" data-dismiss="alert" aria-hidden="true">&times;</button><span>' + message + '</span></div>')

            $("#alertbox").fadeTo(2000, 500).slideUp(500, function () {
                $("#alertbox").alert('close');
            });
        }
    }


    o.init();
    return o;
})();