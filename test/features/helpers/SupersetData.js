const puppeteer = require('puppeteer');
const SupersetHelper = require('../helpers/SupersetHelper');

class SupersetData {
    constructor(visualisationParams, supersetCredentials, supersetServerURL) {
        this.visualisationParams = visualisationParams;
        this.supersetCredentials = supersetCredentials;
        this.supersetServerURL = supersetServerURL;
    }

    async #getFilteredChartData(webPage) {
        if (this.visualisationParams.ChartID == 1) {
            await webPage.goto(`${this.supersetServerURL}/explore/?form_data_key=Px6o5Wvt8dH8hft2cSO0YltuhVUi4TpDZLMx-9PQfkVO7J804lj-QhbUX8ynMjNM&slice_id=1&native_filters_key=7nKyn4UrzAquJ8h_rEWjxXGsc48V2cmzmysr72lp9zR9TV4PYWfo_ofrcERBYIfB`);
        }
        else if (this.visualisationParams.ChartID == 2) {
            await webPage.goto(`${this.supersetServerURL}/explore/?form_data_key=31ed5rVGLFPNRq7dTBTAA_jbw1Dy6NJ8GBQy3Euyx8XgJ_pFYj4C7XJhuv_dwgCd&slice_id=2`);
        }
        else if (this.visualisationParams.ChartID == 6) {
            await webPage.goto(`${this.supersetServerURL}/explore/?form_data_key=5kaPoFQH1nxUgCcEYpC3Dq7ET5NUgFQwnXIeN9Fydo-gFJFD-uk6jGEjc4Rg3XCY&slice_id=6`);
        }
        else if (this.visualisationParams.ChartID == 7) {
            await webPage.goto(`${this.supersetServerURL}/explore/?form_data_key=tN6pZaBv-RR28KVfBI3q0ImFlN75nTfG1vfxnPn9wvZi_34nm4sEpFm1sSzU21MA&slice_id=7`)
        }
        else if (this.visualisationParams.ChartID == 8) {
            await webPage.goto(`${this.supersetServerURL}/explore/?form_data_key=Uas5lOUakFgpSPQEnANmMbQgzvVD8pg_4E3nrO1DqokH6_bRt8BmpNvuZIKUjtKT&slice_id=8`)
        }
        else {

        }

        await Promise.all([
            webPage.waitForNavigation({ waitUntil: 'networkidle0' }),
        ]);

        let data = await webPage.evaluate(async () => {
            const xpath = '//*[@id="rc-tabs-0-tab-results"]';
            const result = document.evaluate(xpath, document, null, XPathResult.ANY_TYPE, null);

            result.iterateNext().click();

            //Wait for the page to load afetr clickin on the Results tab in Superset
            await new Promise(resolve => setTimeout(resolve, 3000));

            let items = document.querySelector("#rc-tabs-0-panel-results > div.table-condensed.css-1jemrau").innerHTML;
            return items;
        })

        //No longer need to keep the Puppeteer browser session open
        if (SupersetHelper.TERMINATE_PUPPETEER_BROWSER_SESSION) {
            await SupersetHelper.Data.Puppeteer.BROWSER_OBJECT.close();
        }

        return data;
    }

    #filterDashboardData() {
        return new Promise(async (resolve, reject) => {
            try {
                const creds = {
                    username: `${this.supersetCredentials[0]}`,
                    password: `${this.supersetCredentials[1]}`
                };

                (async () => {
                    if (!SupersetHelper.Data.Dashboard.IS_FILTERED) {
                        SupersetHelper.Data.Dashboard.IS_FILTERED = true;

                        SupersetHelper.Data.Puppeteer.BROWSER_OBJECT = await puppeteer.launch({
                            args: [
                                '--disable-web-security',
                            ],
                            headless: true
                        });

                        SupersetHelper.Data.Puppeteer.PAGE_OBJECT = await SupersetHelper.Data.Puppeteer.BROWSER_OBJECT.newPage();
                        //SupersetHelper.Data.Puppeteer.PAGE_OBJECT.setDefaultNavigationTimeout(30000); //30 sec timeout if no activity found

                        await SupersetHelper.Data.Puppeteer.PAGE_OBJECT.goto(`${this.supersetServerURL}/superset/dashboard/${this.visualisationParams.DashboardID}/?native_filters=(NATIVE_FILTER-vQUYoGoee:(__cache:(label:'${SupersetHelper.Data.Dashboard.FILTER_COUMNS[0][1]}',validateStatus:!f,value:!('${SupersetHelper.Data.Dashboard.FILTER_COUMNS[0][1]}')),extraFormData:(filters:!((col:${SupersetHelper.Data.Dashboard.FILTER_COUMNS[0][0]},op:IN,val:!('${SupersetHelper.Data.Dashboard.FILTER_COUMNS[0][1]}')))),filterState:(label:'${SupersetHelper.Data.Dashboard.FILTER_COUMNS[0][1]}',validateStatus:!f,value:!('${SupersetHelper.Data.Dashboard.FILTER_COUMNS[0][1]}')),id:NATIVE_FILTER-vQUYoGoee,ownState:()))`);

                        await SupersetHelper.Data.Puppeteer.PAGE_OBJECT.type('input[name=username]', creds.username);
                        await SupersetHelper.Data.Puppeteer.PAGE_OBJECT.type('input[name=password]', creds.password)

                        await Promise.all([
                            SupersetHelper.Data.Puppeteer.PAGE_OBJECT.click('input[type=submit]'),
                            SupersetHelper.Data.Puppeteer.PAGE_OBJECT.waitForNavigation({ waitUntil: 'networkidle0' }),
                        ]);
                    }

                    return resolve(await this.#getFilteredChartData(SupersetHelper.Data.Puppeteer.PAGE_OBJECT));
                })();
            } catch (e) {
                return reject(e);
            }
        })
    }

    getFilteredData(callback) {
        this.#filterDashboardData()
            .then(function (data) {
                callback(data);
            })
            .catch(function (error) {
                console.log("\nFailed to fetch Superset Data: %s\n", error);
            });
    }
}

module.exports = SupersetData;
