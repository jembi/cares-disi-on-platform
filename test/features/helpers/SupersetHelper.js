class SupersetHelper {
    static Data = {
        Dashboard: {
            IS_FILTERED: false,
            FILTER_COUMNS: [[]]
        },

        Puppeteer: {
            TERMINATE_BROWSER_SESSION: false,
            PAGE_OBJECT: null,
            BROWSER_OBJECT: null,
            NAVIGATION_INACTIVITY_TIMER: null
        },
    };
}

module.exports = SupersetHelper;
