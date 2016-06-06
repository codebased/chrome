$(function () {

    function populatePanel(outputPanel, urlList) {
        outputPanel.empty();

        $.each(urlList, function (idx, record) {

            var titleRequired = settings && settings.excludeNoTitleItems;

            if (!!record.url) {

                if (titleRequired && !record.title) return;

                var tr = document.createElement('tr');
                var td1 = document.createElement('td');
                $(td1)
                    .attr("data-rowindex", idx)
                    .attr("data-url", record.url)
                    .attr("data-tabId", (record.id && record.isTab) ? record.id : 0)
                    .attr("data-windowId", (record.id && record.isTab) ? record.windowId : 0)
                    .css("cursor", "pointer")
                    .addClass("word-wrap")
                    .html(record.title + "<br><small class='text-muted word-wrap '>" + record.url + "</small>")
                    .click(function () {

                    });
                $(tr).append(td1).addClass("activated");
                outputPanel.append(tr);
            }
        });
    }

    var listOpenTabs = function () {
        var deferred = Q.defer();
        chrome.tabs.query({}, function (result) {
            console.log('listOpenTabs')
            $.each(result, function (idx, tab) {
                tab.isTab = true;
            });

            var outputPanel = $("#myTable > tbody");
            populatePanel(outputPanel, result);
            deferred.resolve();
        });
        return deferred.promise;
    };

    var listBookmarks = function () {
        var deferred = Q.defer();

        ap.bookmarks.getAll(function (bookmarks) {
            console.log('listBookmarks')
            var outputPanel = $("#bookmarkTable > tbody");
            populatePanel(outputPanel, bookmarks);
            deferred.resolve();
        });
        return deferred.promise;
    }

    var listHistories = function () {
        var deferred = Q.defer();

        chrome.history.search({text: '', maxResults: 0}, function (result) {
            console.log('listHistories')
            var outputPanel = $("#historyTable > tbody");
            populatePanel(outputPanel, result);
            deferred.resolve();
        });
        return deferred.promise;
    }

    function init() {


        var defaultSettings = {
            includeBookmark: true,
            includeHistory: true,
            excludeNoTitleItems: false
        }

        settings = defaultSettings;

        chrome.storage.sync.get(defaultSettings, function (savedSettings) {
            settings = savedSettings;
            $("#includeBookmark").prop("checked", savedSettings.includeBookmark);
            $("#includeHistory").prop("checked", savedSettings.includeHistory);

            if (savedSettings.includeHistory) {
                $("#historyTable").show()
            } else {
                $("#historyTable").hide();
            }
            if (savedSettings.includeBookmark) {
                $("#bookmarkTable").show()
            } else {
                $("#bookmarkTable").hide();
            }
        });

        $('#includeBookmark').click(function () {
            if ($(this).is(':checked')) {
                $("#bookmarkTable").show()
            } else {
                $("#bookmarkTable").hide();
            }
            $("#filter").focus()
        });

        $('#includeHistory').click(function () {
            if ($(this).is(':checked')) {
                $("#historyTable").show()
            } else {
                $("#historyTable").hide();
            }
            $("#filter").focus()
        });

        $('.bottomtooltip').tooltip({
            'show': true,
            'placement': 'bottom'
        });


        Q.fcall(listOpenTabs).then(listBookmarks).then(listHistories).then(function () {
            console.log('tableNavigation')
            jQuery.tableNavigation({

                activate_event: 'click',
                cookie_name: null,
                bind_key_events_to_links: false,
                on_activate: function (row) {
                    var td = $($(row).find('td')[0]);
                    var dataTabId = parseInt($(td).data("tabid"));
                    var dataWindowId = parseInt($(td).data("windowid"));
                    if (!!dataTabId) {
                        chrome.tabs.update(parseInt(dataTabId), {selected: true, highlighted: true, active: true});
                        if (!!dataWindowId) {
                            chrome.windows.update(dataWindowId, {focused: true});
                        }
                    } else {
                        var url = $(td).data("url");
                        chrome.tabs.create({
                            'url': url
                        });
                    }
                }
            });
        });

        $('#filter').keyup(function () {
            var rex = new RegExp($(this).val(), 'i');

            $('.searchable tr').hide();
            $('.searchable tr').filter(function () {
                return rex.test($(this).text());
            }).show();
        }).focus();
    }

    var settings = null;

    $.fn.wrapInTag = function (opts) {

        var tag = opts.tag || 'strong',
            words = opts.words || [],
            regex = RegExp(words.join('|'), 'gi'),
            replacement = '<' + tag + '>$&</' + tag + '>';

        return this.html(function () {
            return $(this).text().replace(regex, replacement);
        });
    };


    init()
});