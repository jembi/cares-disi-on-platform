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

    console.log(this.output)

})
