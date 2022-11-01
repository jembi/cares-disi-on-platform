class SupersetHelper {
    static Data = {
        Dashboard: {
            IS_FILTERED: false,
            FILTER_COUMNS: [],
            FILTER_VALUES: []
        },

        Puppeteer: {
            TERMINATE_BROWSER_SESSION: false,
            PAGE_OBJECT: null,
            BROWSER_OBJECT: null
        },
    };
}

module.exports = SupersetHelper;
