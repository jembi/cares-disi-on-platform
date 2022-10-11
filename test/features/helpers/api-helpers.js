const axios = require('axios')

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

const getSupsersetChart = async (params) => {
  const { SUPERSET_SERVER, SUPERSET_USERNAME, SUPERSET_PASSWORD } = process.env

  let jwt_token = await axios.post(`${SUPERSET_SERVER}/api/v1/security/login`,
    {
      "username": `${SUPERSET_USERNAME}`,
      "password": `${SUPERSET_PASSWORD}`,
      "refresh": true,
      "provider": "db"
    });

  let access_token = jwt_token.data.access_token;

  let csrf_token = await axios.get(
    `${SUPERSET_SERVER}/api/v1/security/csrf_token/`,
    {
      headers: { 'Authorization': `Bearer ${access_token}` }
    }
  )

  let headers = {
    'accept': 'application/json',
    'Authorization': `Bearer ${access_token}`,
    'X-CSRFToken': csrf_token.data.result,
  }

  try {
    const res = await axios.get(
      `${SUPERSET_SERVER}/api/v1/chart/${params.ID}/data/`,
      {
        headers: headers
      }
    )

    return res
  } catch (err) {
    console.error(err)
    throw new Error(err)
  }
};

module.exports = { getReport, esPost, getSupsersetChart }
