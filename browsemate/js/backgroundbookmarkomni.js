(function () {

    var services = {
        prepareSuggestions: prepareSuggestions,
        navigate: navigate,
        nav: nav,
        escapeXML: escapeXML
    }

    chrome.omnibox.onInputChanged.addListener(
        function (criteria, suggest) {
            chrome.bookmarks.search(criteria, function (searchresult) {
                var suggestions = [];
                // let the default bookmark comes first.
                suggestions.push({
                    'content': "?" + criteria,
                    'description': "Search <match>" + services.escapeXML(criteria) + "</match> in Bookmarks"
                });

                suggestions = services.prepareSuggestions(searchresult, suggestions, 5);
                suggest(suggestions);
            });
        }
    );

    chrome.omnibox.onInputEntered.addListener(function (text, disposition) {
        services.navigate(text, disposition)
    });

    function prepareSuggestions(searchresult, suggestions, length) {

        $.each(searchresult, function (idx, item) {

            if (!!item.url) {
                // if it is folder then the url is undefined.
                suggestions.push({
                    'content': "browse " + item.url,
                    'description': services.escapeXML(item.title)
                });
            }

            if (!!length && suggestions.length === length) return false;
        });

        return suggestions;
    }

    function escapeXML(str) {
        return str.replace(/&/g, "&amp;").replace(/"/g, "&quot;").replace(/'/g, "&apos;").replace(/</g, "&lt;").replace(/>/g, "&gt;");
    }

    function navigate(text, disposition) {
        if (text.substring(0, 7) === "browse ") {
            services.nav(text.substr(7), disposition);
        } else if (text.substr(0, 1) == "?") {
            services.nav("chrome://bookmarks/#q=" + text.substr(1), disposition);
        } else {
            services.nav("chrome://bookmarks/#q=" + text, disposition);
        }
    }

    function nav(url, disposition) {

        switch (DISPOSITIONOPTIONS[disposition]) {
            case DISPOSITIONOPTIONS.newForegroundTab:
                chrome.tabs.create({
                    'url': url
                });
                break;
            case DISPOSITIONOPTIONS.newBackgroundTab:
                chrome.tabs.create({
                    'url': url,
                    'active': false
                });
                break;
            case DISPOSITIONOPTIONS.currentTab:
            default:
                chrome.tabs.update({
                    'url': url
                });
        }
    }

    var DISPOSITIONOPTIONS = Object.freeze({currentTab: 0, newForegroundTab: 1, newBackgroundTab: 2});
})();
