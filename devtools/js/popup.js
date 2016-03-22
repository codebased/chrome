$(function () {

    $("#formatButton").click(function () {
        var rawJsonView = $("#jsonData");
        var formattedJson = formatJsonData();
        if ($.isNullOrWhiteSpace(formattedJson)) return;
        rawJsonView.val(formattedJson);
        ap.clipboard.copyText(rawJsonView)
    });

    $('captureScreen').click(function () {
        ap.screenshot.currentTab();
    });

    $("#csharpButton").click(function () {

        var jsonData = formatJsonData();

        $("#jsonData").val(jsonData);

        if ($.isNullOrWhiteSpace(jsonData)) return;

        if (ap.network.hasConnection()) {
            $.post('http://json2csharp.com/Home/GenerateClasses', {"json": jsonData}, function (data) {
                var plain = '';
                $.each(data.Classes, function (idx, o) {
                    plain += data.Classes[idx];
                });
                var oClassResult = $("#csharpclassresult");

                oClassResult.val(plain);
                $("#result").val($.escapeHtml(plain));

                ap.clipboard.copyText(oClassResult)
            });
        }
        else {
            ap.bootstrapalert.warn("#alert_placeholder", "It seems like you are out of Internet fuel :-(");
        }
    });

    $("#completeShotButton").click(function () {
        getTabId(startCapture);
    });

    function startCapture(tabId) {
        chrome.extension.sendMessage({msg: "startCapture", tabId: tabId});
        window.close();
    }

    function getRawJson() {
        var jsonData = $("#jsonData").val();
        if ($.isNullOrWhiteSpace(jsonData)) {
            jsonData = ap.clipboard.getText("#jsonData");
        }

        return jsonData;
    }

    function formatJsonData() {
        var rawJson = getRawJson();

        if ($.isNullOrWhiteSpace(rawJson)) return;

        var result = ap.json.isValid(rawJson);

        return result.valid ? ap.json.format(rawJson) : warn(result.exception);
    }

    function warn(exception) {
        ap.bootstrapalert.warn(("#alert_placeholder"), exception);
    }

    function init() {
        $('button.bottomtooltip').tooltip({
            'show': true,
            'placement': 'bottom'
        });
    }

    function getTabId(fun) {
        chrome.tabs.query({currentWindow: true, active: true}, function (tabArray) {
            fun(tabArray[0].id);
        });
    }

    init()

});