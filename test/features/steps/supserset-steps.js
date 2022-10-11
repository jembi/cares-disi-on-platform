const { Then, When } = require('@cucumber/cucumber')
const { expect } = require('chai')
const { getSupsersetChart } = require('../helpers/api-helpers')

When('I check Superset for chart data using the following', { timeout: 10 * 1000 }, async function (table) {
    const params = {}
    table.hashes().forEach(hash => {
        params[hash.field] = hash.value
    })

    await new Promise(r => setTimeout(r, 5000));

    const { data } = await getSupsersetChart(params)
    this.output = data

    var result = null;

    if (Array.isArray(this.output.result)) {
        result = this.output['result'][0].data; //There is always only one result object with one data element
    }
    else {
        result = this.output;
    }

    for (var j = 0; j < result.length; j++) {
        for (key in result[j]) {
            const chartKey = key;
            const chartValue = result[j][key];

            console.log(chartKey + ": " + chartValue);
        }
    }
})
