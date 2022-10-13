const { Then, When } = require('@cucumber/cucumber')
const { expect } = require('chai')
const { getSupsersetChart } = require('../helpers/api-helpers')

function verifyResultRowExistsWithCorrectResultValue(resultField, resultValue, outputData) {
    const res = outputData.result[0].data.find((r) => {
        for (key in r) {
            const chartElementKeyCleaned = String(key).replace("COUNT(", "").replace(")", "")

            return resultField == chartElementKeyCleaned && r[key] == resultValue
        }
    });

    return res;
}

When('I check Superset for chart data using the following', async function (table) {
    const params = {}
    table.hashes().forEach(hash => {
        params[hash.field] = hash.value
    })

    const { data } = await getSupsersetChart(params)
    this.output = data
})

Then('there should be a result identified by {string} of {string}', function (field, value) {
    const chartData = this.output.result.find(r => r['data'] != [])
    expect(chartData, 'Could not find chart data').to.not.be.undefined

    expect(verifyResultRowExistsWithCorrectResultValue(field, value, this.output), 'The expected result does not match the actual result').to.not.be.undefined
})

Then('there should be a result identified by {string} of {string} with the following fields and values', function (field, value, table) {
    const chartData = this.output.result.find(r => r['data'] != [])
    expect(chartData, 'Could not find chart data').to.not.be.undefined

    expect(verifyResultRowExistsWithCorrectResultValue(field, value, this.output), 'The expected result does not match the actual result').to.not.be.undefined

    this.output.result.find((r) => {
        table.hashes().forEach(hash => {
            const row = r.data.find(r => r[field] === value)

            expect(Math.round(row[hash.field]), hash.field).to.equal(Math.round(hash.value))
        })
    });
})
