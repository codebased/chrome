$(function () {
    $.extend({
        isNullOrWhiteSpace: function (data) {
            //your function code
            if (!!data && data.trim().length > 0) return false;
            return true;
        },

        nl2br: function nl2br(data, isxhtml) {
            var tag = (isxhtml || typeof isxhtml === 'undefined') ? '<br />' : '<br>';
            return (data + '').replace(/([^>\r\n]?)(\r\n|\n\r|\r|\n)/g, '$1' + tag + '$2');
        },
        br2nl: function br2nl(data) {
            return (data + ''.replace(/(<br>|<br\/>)/g, '$1' + '\n' + '$2'));
        },
        escapeHtml: function escapeHtml(text) {
            var map = {
                '&': '&amp;',
                '<': '&lt;',
                '>': '&gt;',
                '"': '&quot;',
                "'": '&#039;'
            };

            return text.replace(/[&<>"']/g, function (m) {
                return map[m];
            });
        },
        componentToHex: function componentToHex(c) {
            var hex = c.toString(16);
            return hex.length == 1 ? "0" + hex : hex;
        },
        rgb2hex: function rgb2hex(r, g, b) {
            return "#" + this.componentToHex(r) + this.componentToHex(g) + this.componentToHex(b);
        },

    });
});
