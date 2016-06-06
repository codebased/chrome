/**
 * Created by codebased on 6/06/16.
 */

function save_options() {
    var includeBookmark = $("#includeBookmark").prop("checked");
    var includeHistory = $("#includeHistory").prop("checked");
    var excludeNoTitleItems = $("#excludeNoTitleItems").prop("checked");

    var settings = {
        includeBookmark: includeBookmark,
        includeHistory: includeHistory,
        excludeNoTitleItems: excludeNoTitleItems
    };

    chrome.storage.sync.set(settings, function () {
        chrome.notifications.create("1024", {
            type: "basic", title: "Preferences", message: "Your preferences have been saved.",
            iconUrl: "../img/ic_launcher.png"
        }, function () {
        });
    });
}

function init() {

    var settings = {
        includeBookmark: true,
        includeHistory: true,
        excludeNoTitleItems: false
    };

    chrome.storage.sync.get(settings, function (savedSettings) {
        $("#includeBookmark").prop("checked", savedSettings.includeBookmark);
        $("#includeHistory").prop("checked", savedSettings.includeHistory);
        $("#excludeNoTitleItems").prop("checked", savedSettings.excludeNoTitleItems);
    });
}

$(function () {
    init();
    $("#save").click(save_options);
});
