const axios = require('axios')
const puppeteer = require('puppeteer');

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

var test = async function (callback) {
  const { SUPERSET_USERNAME, SUPERSET_PASSWORD } = process.env

  run(`${SUPERSET_USERNAME}`, `${SUPERSET_PASSWORD}`)
    .then(function (resp) {

      filteredDashboardData = resp; //JSON.parse(resp);

      callback(true);
    })
    .catch(function (error) {
      console.log("\nFailed to fetch Superset Data: %s\n", error);

      callback(false);
    });
}

const getSupsersetChart = async (params, callback) => {

  const IS_INITIALISED = await new Promise((resolve) => {
    test(function (initialiseClientCallback) {
      if (initialiseClientCallback) {
        resolve(true);
      }
    });
  });

  if (IS_INITIALISED) {
    callback(filteredDashboardData);
  }
}

const getSupsersetChartsss = async (params) => {
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

  try {

    /*getfilteredDashboardData(function (dataSetsCallback) {
      if (dataSetsCallback) {
        return filteredDashboardData;
      }
    });*/



    /*const res = await axios.get(
      //`${SUPERSET_SERVER}/api/v1/chart/${params.ID}/data/`,
      `${SUPERSET_SERVER}/api/v1/chart/2/data/`,
      {
        headers: headers
      }
    )*/

    /* waitFor(res, function () {
 
       return res;
     });*/



    return filteredDashboardData;

  } catch (err) {
    console.error(err)
    throw new Error(err)
  }
};

function run(ssUser, ssPassword) {
  return new Promise(async (resolve, reject) => {
    try {
      const creds = {
        username: `${ssUser}`,
        password: `${ssPassword}`
      };

      (async () => {
        const browser = await puppeteer.launch({
          args: [
            '--disable-web-security',
          ],
          headless: false
        });

        const page = await browser.newPage();

        await page.goto("https://superset.qa.cares-disi.gicsandbox.org/superset/dashboard/1/?native_filters=(NATIVE_FILTER-vQUYoGoee:(__cache:(label:'20 Dec 2020',validateStatus:!f,value:!('20 Dec 2020')),extraFormData:(filters:!((col:pepfar_quarter,op:IN,val:!('20 Dec 2020')))),filterState:(label:'20 Dec 2020',validateStatus:!f,value:!('20 Dec 2020')),id:NATIVE_FILTER-vQUYoGoee,ownState:()))");
        //await page.goto("https://superset.qa.cares-disi.gicsandbox.org/explore/?form_data_key=4Hi4i9rXIb9zRVSgffGhEooCACWSKJ0HcZ13URU19MreEoIJ689x5zU-8vDVNJ8m&slice_id=1&native_filters_key=7nKyn4UrzAquJ8h_rEWjxXGsc48V2cmzmysr72lp9zR9TV4PYWfo_ofrcERBYIfB");


        await page.type('input[name=username]', creds.username);
        await page.type('input[name=password]', creds.password)
        await Promise.all([
          page.click('input[type=submit]'),
          page.waitForNavigation({ waitUntil: 'networkidle0' }),
        ]);

        await page.goto("https://superset.qa.cares-disi.gicsandbox.org/explore/?form_data_key=31ed5rVGLFPNRq7dTBTAA_jbw1Dy6NJ8GBQy3Euyx8XgJ_pFYj4C7XJhuv_dwgCd&slice_id=2");
        await Promise.all([
          //page.click('input[type=submit]'),
          page.waitForSelector("#rc-tabs-3-tab-results"),
          page.click('#rc-tabs-3-tab-results'),
          page.waitForNavigation({ waitUntil: 'networkidle0' }),
        ]);

        let urls = await page.evaluate(() => {
          let items = document.querySelector("body").innerText;

          //let items = document.querySelector("#rc-tabs-3-panel-results").innerText;


          return items
        })

        //const POST_REPLIES = '#rc-tabs-3-panel-results > div.table-condensed.css-1jemrau > table > tbody';
        /* const urls = await page.evaluate(() => {
           let names = document.querySelectorAll(
             '#rc-tabs-3-panel-results > div.table-condensed.css-1jemrau > table > tbody'
           );
           let arr = Array.prototype.slice.call(names);
           let text_arr = [];
           for (let i = 0; i < arr.length; i += 1) {
             text_arr.push(arr[i].innerHTML);
           }
           return text_arr;
         });*/


        await browser.close();

        return resolve(urls);
      })();
    } catch (e) {
      return reject(e);
    }
  })
}

module.exports = { getReport, esPost, getSupsersetChart }
