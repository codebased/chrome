chrome.contextMenus.create({
    title: "Search Stackoverflow for \"%s\"", contexts: ["selection"],
    onclick: function (info, tab) {
        search(info.selectionText);
    }
});

function search(criteria) {
    var serviceCall = 'http://stackoverflow.com/search?q=' + criteria;
    chrome.tabs.create({url: serviceCall});
}