ap.clipboard = (function () {

    var o = {
        init: function () {
        },
        copyText: function (o) {
            o.focus();
            document.execCommand("SelectAll", false, null);
            document.execCommand("copy");
        },
        getText: function (o) {
            $(o).focus();
            document.execCommand('paste');
            var returnValue = $(o).val();
            return returnValue;
        }
    }

    o.init();
    return o;
})();