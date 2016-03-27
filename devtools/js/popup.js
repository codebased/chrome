$(function () {

    var colorThief = new ColorThief();

    $("#formatButton").click(function () {
        var rawJsonView = $("#jsonData");
        var formattedJson = formatJsonData();
        if ($.isNullOrWhiteSpace(formattedJson)) return;
        rawJsonView.val(formattedJson);
        ap.clipboard.copyText(rawJsonView)
        $("#downloadJsonContainer").empty();
        ap.json.downloadJson(formattedJson, $("#downloadJsonContainer"));
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
                $("#result").text(plain);

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

    $("#searchTextView").keypress(function (e) {
        if (e.keyCode == 13) {
            var serviceCall = 'http://stackoverflow.com/search?q=' + encodeURIComponent($("#searchTextView").val());
            chrome.tabs.create({url: serviceCall});
        }
    });

    $("#colorImage").change(function () {
        readImage(this);
    });

    function readImage(input) {
        if (input.files && input.files[0]) {
            var reader = new FileReader();

            reader.onload = function (e) {
                var img = $('#uploadedImage');
                img.attr('src', e.target.result);
                debugger;
                var imgObj = new Image();
                imgObj.src = e.target.result;
                var result = colorThief.getPalette(imgObj);
                var outputPanel = $("#outputPanel");
                outputPanel.empty();

                $.each(result, function (idx, colorCode) {
                    var hex = $.rgb2hex(colorCode[0], colorCode[1], colorCode[2]);

                    var parentDiv = document.createElement('div');
                    var div = document.createElement('div');
                    var hexP = document.createElement('span');
                    var rgbP = document.createElement('span');

                    $(div)
                        .attr("id", "div" + idx)
                        .width(32)
                        .height(32)
                        .css("background-color", hex)
                        .css("border", "groove")
                        .css("display", "inline-block")
                        .val(hex)
                        .click(function () {
                            ap.clipboard.copyText($(this));
                        });

                    $(hexP).html(hex).css("vertical-align", "middle")
                        .css("padding", "2px")
                        .css("display", "inline-block");

                    $(rgbP).html("rgb(" + colorCode[0] + "," + colorCode[1] + "," + colorCode[2] + ")")
                        .css("vertical-align", "middle")
                        .css("padding", "2px")
                        .css("display", "inline-block");
                    $(parentDiv).append(div);
                    $(parentDiv).append(hexP);
                    $(parentDiv).append(rgbP);

                    outputPanel.append(parentDiv);
                });
            }

            reader.readAsDataURL(input.files[0]);
        }
    }

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
        $('.bottomtooltip').tooltip({
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