const timeago = require('timeago.js');

const timeagoInstance = timeago();

module.exports = {
    registerHelpers: () => {
        return {
            // Time ago format
            timeago: function (timestamps) {
                return timeagoInstance.format(timestamps, 'en');
            }
            // Next helper
        };
    }
};