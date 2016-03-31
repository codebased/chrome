$(function () {

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
                    .addClass("activation")
                    .html(record.title + "<br><a class='text-muted word-wrap activated selected'>" + record.url + "</a>")
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

            $.each(result, function (idx, tab) {
                tab.isTab = true;
            });

            var outputPanel = $("#myTable > tbody");
            outputPanel.empty();
            populatePanel(outputPanel, result);
        });
    };

    var listBookmarks = function () {
        setTimeout(function () {
            ap.bookmarks.getAll(function (bookmarks) {
                var outputPanel = $("#bookmarkTable > tbody");
                populatePanel(outputPanel, bookmarks);
            });
        }, 100);
    }

    var listHistories = function () {
        setTimeout(function () {
            chrome.history.search({text: ''}, function (result) {
                var outputPanel = $("#historyTable > tbody");
                populatePanel(outputPanel, result);
            });
        }, 300);
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

        jQuery.tableNavigation();
    }

    init()
});