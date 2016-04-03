(function () {

    var services = {
        prepareSuggestions: prepareSuggestions,
        navigate: navigate,
        nav: nav,
        escapeXML: escapeXML
    }

    var wait;
    chrome.omnibox.onInputChanged.addListener(
        function (criteria, suggest) {
            clearTimeout(wait);
            wait = setTimeout(function () {
                var suggestions = [];

                chrome.omnibox.setDefaultSuggestion({"description": "Search <match>" + services.escapeXML(criteria) + "</match> in Bookmarks"});

                chrome.tabs.query({}, function (searchresult) {

                    var rex = new RegExp(criteria, 'ig');

                    searchresult = $.grep(searchresult, function (tab) {
                        return (tab.url && rex.test(tab.url)) || (tab.title && rex.test(tab.title));
                    });

                    suggestions = services.prepareSuggestions(searchresult, suggestions, 5, "tab", " in tab");

                    if (suggestions.length < 5) {
                        chrome.bookmarks.search(criteria, function (searchresult) {


                            // let the default bookmark comes first.
                            //suggestions.push({
                            //    'content': "?" + criteria,
                            //    'description': "Search <match>" + services.escapeXML(criteria) + "</match> in Bookmarks"
                            //});

                            suggestions = services.prepareSuggestions(searchresult, suggestions, 5, "browse", " in bookmark");

                            if (suggestions.length < 5) {
                                chrome.history.search({text: criteria}, function (searchresult) {
                                    suggestions = services.prepareSuggestions(searchresult, suggestions, 5, "browse", " in history");
                                    suggest(suggestions);
                                });
                            } else {
                                suggest(suggestions);
                            }
                        });
                    } else {
                        suggest(suggestions);
                    }
                });
            }, 500);
        }
    );

    chrome.omnibox.onInputEntered.addListener(function (text, disposition) {
        services.navigate(text, disposition)
    });

    function prepareSuggestions(searchresult, suggestions, length, prefixCommand, postfixDescription) {

        $.each(searchresult, function (idx, item) {

            if (!!item.url) {
                // if it is folder then the url is undefined.
                suggestions.push({
                    'content': prefixCommand + " " + item.url,
                    'description': "Search <match>" + services.escapeXML(item.title) + "</match>" + (postfixDescription || "")
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
        } else if (text.substr(0, 4) === "tab ") {
            services.nav(text.substr(4), "existingTab");
        } else if (text.substr(0, 1) == "?") {
            services.nav("chrome://bookmarks/#q=" + text.substr(1), disposition);
        }
        else {
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
            case DISPOSITIONOPTIONS.existingTab:
                chrome.tabs.query({url: url.split('#')[0]}, function (result) {
                    if (!!result && result.length > 0) {
                        chrome.tabs.update(result[0].id, {selected: true, highlighted: true, active: true});
                    }
                });
                break;
            case DISPOSITIONOPTIONS.currentTab:
            default:
                chrome.tabs.update({
                    'url': url
                });
        }
    }

    var DISPOSITIONOPTIONS = Object.freeze({currentTab: 0, newForegroundTab: 1, newBackgroundTab: 2, existingTab: 3});
})();
