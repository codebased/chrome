/**
 * Created by codebased on 30/03/16.
 */
ap.bookmarks = (function () {
    var o = {
        init: function () {
        },
        getAll: function (callback) {

            function fetch_bookmarks(parentNode, output) {
                parentNode.forEach(function (bookmark) {
                    if (!(bookmark.url === undefined || bookmark.url === null)) {
                        output.push({url: bookmark.url, title: bookmark.title});
                    }
                    if (bookmark.children) {
                        fetch_bookmarks(bookmark.children, output);
                    }
                });
            }

            chrome.bookmarks.getTree(function (rootNode) {
                var output = new Array();
                fetch_bookmarks(rootNode, output);
                callback(output);
            });
        }
    }

    o.init();
    return o;
})();