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


    $("#bigurlView").keypress(function (e) {
        if (e.keyCode == 13) {
            var bigUrl = $(this).val();
            $(this).val("Have patience when I get your tiny url.");
            ap.url.tinyurl(bigUrl, function (result) {
                if (!!result) {
                    $("#bigurlView").val(result);
                }
                else {
                    $("#bigurlView").val("Looks like something went wrong! :-( Is your net on?");
                }
            });
        }
    });

    $("#colorImage").change(function () {
        readImage(this);
    });

    $("#searchTabTextView").keypress(function (e) {
        var searchFor = $(this).val();

    });

    function readImage(input) {
        if (input.files && input.files[0]) {
            var reader = new FileReader();

            reader.onload = function (e) {
                var img = $('#uploadedImage');
                img.attr('src', e.target.result);
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

    function populatePanel(outputPanel, urlList) {
        outputPanel.empty();

        $.each(urlList, function (idx, record) {

            if (!!record.url) {
                var tr = document.createElement('tr');
                var td1 = document.createElement('td');
                $(td1)
                    .attr("data-url", record.url)
                    .attr("data-tabId", (record.id && record.isTab) ? record.id : 0)
                    .css("cursor", "pointer")
                    .addClass("word-wrap")
                    .html(record.title + "<br><small class='text-muted word-wrap'>" + record.url + "</small>")
                    .click(function () {
                        var dataTabId = parseInt($(this).attr("data-tabId"));
                        if (!!dataTabId) {
                            chrome.tabs.update(parseInt(dataTabId), {selected: true});
                        } else {
                            var url = $(this).attr("data-url");
                            chrome.tabs.create({
                                'url': url
                            });
                        }
                    });
                $(tr).append(td1)
                outputPanel.append(tr);
            }
        });
    }

    var listOpenTabs = function () {
        chrome.tabs.query({}, function (result) {
            var outputPanel = $("#myTable > tbody");
            outputPanel.empty();
            populatePanel(outputPanel, result);
        });
    };

    var listBookmarks = function () {
        ap.bookmarks.getAll(function (bookmarks) {
            var outputPanel = $("#bookmarkTable > tbody");
            populatePanel(outputPanel, bookmarks);
        });

    }

    var listHistories = function () {
        chrome.history.search({text: ''}, function (result) {
            var outputPanel = $("#historyTable > tbody");
            populatePanel(outputPanel, result);
        });
    }

    function init() {

        $('.bottomtooltip').tooltip({
            'show': true,
            'placement': 'bottom'
        });

        listOpenTabs();
        listBookmarks();
        listHistories();

        $('#filter').keyup(function () {
            var rex = new RegExp($(this).val(), 'i');

            $('.searchable tr').hide();
            $('.searchable tr').filter(function () {
                return rex.test($(this).text());
            }).show();

        }).focus();


        chrome.tabs.query({currentWindow: true, active: true}, function (tabs) {
            $("#bigurlView").val(tabs[0].url);
        });
    }

    function getTabId(fun) {
        chrome.tabs.query({currentWindow: true, active: true}, function (tabArray) {
            fun(tabArray[0].id);
        });
    }

    init()
});