const puppeteer = require('puppeteer');

class SupersetData {
    constructor(visualisationParams, supersetCredentials) {
        this.visualisationParams = visualisationParams;
        this.supersetCredentials = supersetCredentials;
    }

    #filterDashboardData() {
        return new Promise(async (resolve, reject) => {
            try {
                const creds = {
                    username: `${this.supersetCredentials[0]}`,
                    password: `${this.supersetCredentials[1]}`
                };

                (async () => {
                    const browser = await puppeteer.launch({
                        args: [
                            '--disable-web-security',
                        ],
                        headless: true
                    });

                    const page = await browser.newPage();

                    await page.goto(`https://superset.qa.cares-disi.gicsandbox.org/superset/dashboard/${this.visualisationParams.DashboardID}/?native_filters=(NATIVE_FILTER-vQUYoGoee:(__cache:(label:'20 Dec 2020',validateStatus:!f,value:!('20 Dec 2020')),extraFormData:(filters:!((col:pepfar_quarter,op:IN,val:!('20 Dec 2020')))),filterState:(label:'20 Dec 2020',validateStatus:!f,value:!('20 Dec 2020')),id:NATIVE_FILTER-vQUYoGoee,ownState:()))`);

                    await page.type('input[name=username]', creds.username);
                    await page.type('input[name=password]', creds.password)

                    await Promise.all([
                        page.click('input[type=submit]'),
                        page.waitForNavigation({ waitUntil: 'networkidle0' }),
                    ]);

                    if (this.visualisationParams.ChartID == 1) {
                        await page.goto("https://superset.qa.cares-disi.gicsandbox.org/explore/?form_data_key=Px6o5Wvt8dH8hft2cSO0YltuhVUi4TpDZLMx-9PQfkVO7J804lj-QhbUX8ynMjNM&slice_id=1&native_filters_key=7nKyn4UrzAquJ8h_rEWjxXGsc48V2cmzmysr72lp9zR9TV4PYWfo_ofrcERBYIfB");
                    }
                    else if (this.visualisationParams.ChartID == 2) {
                        await page.goto("https://superset.qa.cares-disi.gicsandbox.org/explore/?form_data_key=31ed5rVGLFPNRq7dTBTAA_jbw1Dy6NJ8GBQy3Euyx8XgJ_pFYj4C7XJhuv_dwgCd&slice_id=2");
                    }
                    else if (this.visualisationParams.ChartID == 6) {
                        await page.goto("https://superset.qa.cares-disi.gicsandbox.org/explore/?form_data_key=5kaPoFQH1nxUgCcEYpC3Dq7ET5NUgFQwnXIeN9Fydo-gFJFD-uk6jGEjc4Rg3XCY&slice_id=6");
                    }
                    else if (this.visualisationParams.ChartID == 7) {
                        await page.goto("https://superset.qa.cares-disi.gicsandbox.org/explore/?form_data_key=tN6pZaBv-RR28KVfBI3q0ImFlN75nTfG1vfxnPn9wvZi_34nm4sEpFm1sSzU21MA&slice_id=7")
                    }
                    else if (this.visualisationParams.ChartID == 8) {
                        await page.goto("https://superset.qa.cares-disi.gicsandbox.org/explore/?form_data_key=Uas5lOUakFgpSPQEnANmMbQgzvVD8pg_4E3nrO1DqokH6_bRt8BmpNvuZIKUjtKT&slice_id=8")
                    }
                    else {

                    }

                    await Promise.all([
                        page.waitForNavigation({ waitUntil: 'networkidle0' }),
                    ]);

                    let data = await page.evaluate(async () => {
                        const xpath = '//*[@id="rc-tabs-0-tab-results"]';
                        const result = document.evaluate(xpath, document, null, XPathResult.ANY_TYPE, null);

                        result.iterateNext().click();

                        //Wait for the page to load afetr clickin on the Results tab in Superset
                        await new Promise(resolve => setTimeout(resolve, 3000));

                        let items = document.querySelector("#rc-tabs-0-panel-results > div.table-condensed.css-1jemrau").innerHTML;
                        return items;
                    })

                    await browser.close();

                    //Wait for the chart page to close before allowing a new one to launch
                    await new Promise(resolve => setTimeout(resolve, 3000));

                    return resolve(data);
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
