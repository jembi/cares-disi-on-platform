const axios = require('axios')
const puppeteer = require('puppeteer');

const HtmlTableToJson = require('html-table-to-json');

const getReport = async (params, isForKibanaDashboard, chartName = null) => {
  const { JSREPORT_SERVER, JS_USERNAME, JS_PASSWORD } = process.env

  var template = null;

  if (!isForKibanaDashboard) {
    template = `report-${params.report}-test`;
  }
  else {
    template = `${params.report}-${chartName}-test`;
  }

  var data = JSON.stringify({
    template: { name: template },
    data: {
      params: {
        ...params,
        mrnFilter: params.id
      }
    }
  });

  const config = {
    method: "POST",
    url: `${JSREPORT_SERVER}/api/report`,
    data: data,
    headers: {
      "Content-Type": "application/json",
      Authorization: `Basic ${new Buffer.from(
        `${JS_USERNAME}:${JS_PASSWORD}`
      ).toString("base64")}`,
    },
  };

  try {
    const res = await axios(config);
    return res
  } catch (err) {
    console.error(err)
    throw new Error(err)
  }
};

const esPost = async (query, esRequest) => {
  const { ELASTIC_SERVER, ES_INDEX } = process.env

  const config = {
    method: 'POST',
    url: `${ELASTIC_SERVER}/${ES_INDEX}/` + esRequest,
    data: JSON.stringify(query),
  }

  try {
    const res = await queryES(config);
    return res
  } catch (err) {
    console.error(err)
    throw new Error(err)
  }
}

const queryES = async (config) => {
  const { ES_USERNAME, ES_PASSWORD } = process.env

  const auth = config.url.includes('openhim')
    ? 'Custom test'
    : `Basic ${new Buffer.from(
      `${ES_USERNAME}:${ES_PASSWORD}`
    ).toString('base64')}`

  const fullConfig = {
    ...config,
    headers: {
      'Content-Type': 'application/json',
      Authorization: auth,
    }
  }

  try {
    const res = await axios(fullConfig);
    return { res }
  } catch (err) {
    console.error(err)
    throw new Error(err)
  }
}

var filteredDashboardData = null;

var fetchFilteredDashboardData = async function (ssUsername, ssPassword, testParams, callback) {

  run(`${ssUsername}`, `${ssPassword}`, testParams)
    .then(function (resp) {

      const data = new HtmlTableToJson(resp, { values: true });
      filteredDashboardData = data.results[0];

      callback(true);
    })
    .catch(function (error) {
      console.log("\nFailed to fetch Superset Data: %s\n", error);

      callback(false);
    });
}

const getSupsersetChart = async (params, callback) => {
  const { SUPERSET_USERNAME, SUPERSET_PASSWORD } = process.env
  const DATA_IS_FILTERED = await new Promise((resolve) => {
    fetchFilteredDashboardData(SUPERSET_USERNAME, SUPERSET_PASSWORD, params, function (initialiseClientCallback) {
      if (initialiseClientCallback) {
        resolve(true);
      }
    });
  });

  if (DATA_IS_FILTERED) {
    callback(filteredDashboardData);
  }
}

//Only used if using Suoerset API calls
const generateSuperSetToken = async (params) => {
  const { SUPERSET_SERVER, SUPERSET_USERNAME, SUPERSET_PASSWORD } = process.env
  var jwt_token = null;
  var csrf_token = null;

  try {
    jwt_token = await axios.post(`${SUPERSET_SERVER}/api/v1/security/login`,
      {
        "username": `${SUPERSET_USERNAME}`,
        "password": `${SUPERSET_PASSWORD}`,
        "refresh": true,
        "provider": "db"
      });
  } catch (err) {
    console.error(err)
    throw new Error(err)
  }

  let access_token = jwt_token.data.access_token;

  try {
    csrf_token = await axios.get(
      `${SUPERSET_SERVER}/api/v1/security/csrf_token/`,
      {
        headers: { 'Authorization': `Bearer ${access_token}` }
      }
    )
  } catch (err) {
    console.error(err)
    throw new Error(err)
  }

  let headers = {
    'accept': 'application/json',
    'Authorization': `Bearer ${access_token}`,
    'X-CSRFToken': csrf_token.data.result,
  }

  return headers;
};

function run(ssUser, ssPass, params) {
  return new Promise(async (resolve, reject) => {
    try {
      const creds = {
        username: `${ssUser}`,
        password: `${ssPass}`
      };

      (async () => {
        const browser = await puppeteer.launch({
          args: [
            '--disable-web-security',
          ],
          headless: true
        });

        const page = await browser.newPage();

        await page.goto("https://superset.qa.cares-disi.gicsandbox.org/superset/dashboard/1/?native_filters=(NATIVE_FILTER-vQUYoGoee:(__cache:(label:'20 Dec 2020',validateStatus:!f,value:!('20 Dec 2020')),extraFormData:(filters:!((col:pepfar_quarter,op:IN,val:!('20 Dec 2020')))),filterState:(label:'20 Dec 2020',validateStatus:!f,value:!('20 Dec 2020')),id:NATIVE_FILTER-vQUYoGoee,ownState:()))");
        await page.type('input[name=username]', creds.username);
        await page.type('input[name=password]', creds.password)
        await Promise.all([
          page.click('input[type=submit]'),
          page.waitForNavigation({ waitUntil: 'networkidle0' }),
        ]);

        if (params.ID == 1) {
          await page.goto("https://superset.qa.cares-disi.gicsandbox.org/explore/?form_data_key=Px6o5Wvt8dH8hft2cSO0YltuhVUi4TpDZLMx-9PQfkVO7J804lj-QhbUX8ynMjNM&slice_id=1&native_filters_key=7nKyn4UrzAquJ8h_rEWjxXGsc48V2cmzmysr72lp9zR9TV4PYWfo_ofrcERBYIfB");
        }
        else if (params.ID == 2) {
          await page.goto("https://superset.qa.cares-disi.gicsandbox.org/explore/?form_data_key=31ed5rVGLFPNRq7dTBTAA_jbw1Dy6NJ8GBQy3Euyx8XgJ_pFYj4C7XJhuv_dwgCd&slice_id=2");
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

          let items = document.querySelector("#rc-tabs-0-panel-results > div.table-condensed.css-1jemrau").innerHTML //document.querySelector("body").innerText;
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

module.exports = { getReport, esPost, getSupsersetChart }
