$(function () {
    $.extend({
        isNullOrWhiteSpace: function (data) {
            //your function code
            if (!!data && data.trim().length > 0) return false;
            return true;
        },

        nl2br: function nl2br(data, isxhtml) {
            var tag = (isxhtml || typeof isxhtml === 'undefined') ? '<br />' : '<br>';
            return (data + '').replace(/([^>\r\n]?)(\r\n|\n\r|\r|\n)/g, '$1' + tag + '$2');
        },
        escapeHtml: function escapeHtml(text) {
            var map = {
                '&': '&amp;',
                '<': '&lt;',
                '>': '&gt;',
                '"': '&quot;',
                "'": '&#039;'
            };

            return text.replace(/[&<>"']/g, function (m) {
                return map[m];
            });
        }

    });
});


$(function () {

    $("#formatButton").click(function () {
        $("#jsonData").val(formatJsonData());
        setClipboardData($("#jsonData"));
    });

    $("#csharpButton").click(function () {

        var jsonData = formatJsonData();

        $("#jsonData").val(jsonData);

        if ($.isNullOrWhiteSpace(jsonData)) return;

        $.post('http://json2csharp.com/Home/GenerateClasses', {"json": jsonData}, function (data) {
            var plain = '';
            $.each(data.Classes, function (idx, o) {
                plain += data.Classes[idx];
            });

            debugger;
            var oClassResult = $("#csharpclassresult");

            oClassResult.val(plain);
            $("#result").html(($.nl2br($.escapeHtml(plain))));
            setClipboardData(oClassResult);
        });
    });

    function getRawJson() {
        var jsonData = $("#jsonData").val();

        if ($.isNullOrWhiteSpace(jsonData)) {
            jsonData = getClipboardData();
        }
        return jsonData;
    }

    function getClipboardData() {
        $("#jsonData").focus();
        document.execCommand('paste');
        console.log($("#jsonData").val())
        return $("#jsonData").val();
    }

    function setClipboardData(o) {
        o.focus();
        document.execCommand("SelectAll", false, null);
        document.execCommand("copy");
    }

    function formatJsonData() {
        var rawJson = getRawJson();

        if ($.isNullOrWhiteSpace(rawJson)) return;

        var jsonObj = JSON.parse(rawJson);
        var jsonPretty = JSON.stringify(jsonObj, null, '\t');

        return jsonPretty;


    }
});