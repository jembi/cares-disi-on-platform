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
            await webPage.goto(`${this.supersetServerURL}/explore/?form_data_key=I9Wa7X6p6Eg8D-vH0kX-tI3YNVbyrNZbGGg-BOg99IP-AYI-rUr65uoTJPxILyn_&slice_id=1&native_filters_key=5GTODVX6cd0wc3gZlnG2rmS35UDIrrWym38K8QIQEySdQ-0xSHL2pWmuNo1X3fGA`);
        }
        else if (this.visualisationParams.ChartID == 2) {
            await webPage.goto(`${this.supersetServerURL}/explore/?form_data_key=qg1iS2Hz6YEk6N7jH0WRbWpfZHepRDnON_qD_80w-GtkHc73O2tKXorX_B_Ubz-G&slice_id=2`);
        }
        else if (this.visualisationParams.ChartID == 6) {
            await webPage.goto(`${this.supersetServerURL}/explore/?form_data_key=m-BhlCtib5dpk2B3z2TOXKB5wFE6dPD9tVvdOoIVwqkg3R-plvaZAXk9SCn58dN0&slice_id=6`);
        }
        else if (this.visualisationParams.ChartID == 7) {
            await webPage.goto(`${this.supersetServerURL}/explore/?form_data_key=ioaMNXPsCEjX2LMbLHPhFNjlbiUt69cnPZrsyC4zfdBGA-EDuDeIPWpxcJCct1ei&slice_id=7`)
        }
        else if (this.visualisationParams.ChartID == 8) {
            await webPage.goto(`${this.supersetServerURL}/explore/?form_data_key=wWn4ctpT-7cTX62aeCb5leTZWEL9Bm64nMa1uoZgUFxxDJW8KeQxcLFM1xpjLYTw&slice_id=8`)
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
        if (SupersetHelper.Data.Puppeteer.TERMINATE_BROWSER_SESSION) {
            await SupersetHelper.Data.Puppeteer.BROWSER_OBJECT.close();

            console.log("Notified browser to be terminated!");
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
