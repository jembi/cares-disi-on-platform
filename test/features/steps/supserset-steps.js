const { Then, When } = require('@cucumber/cucumber')
const { expect } = require('chai')
const { getSupsersetChart } = require('../helpers/api-helpers')

function verifyResultRowExistsWithCorrectResultValue(resultField, resultValue, outputData) {
    return outputData.result[0].data.find((r) => {
        for (key in r) {
            const chartElementKeyCleaned = String(key).replace("COUNT(", "").replace(")", "")

            return resultField == chartElementKeyCleaned && r[key] == resultValue
        }
    });
}

When('I check Superset for chart data using the following', { timeout: 20 * 1000 }, async function (table) {
    const params = {}
    table.hashes().forEach(hash => {
        params[hash.field] = hash.value
    })

    var chartDataReceived = false;

    var data = await new Promise((resolve) => {
        getSupsersetChart(params, function (initialiseClientCallback) {
            //const { data } = await getSupsersetChart(params)
            if (initialiseClientCallback != null) {
                chartDataReceived = true;
                resolve(initialiseClientCallback);
            }
        })

        new Promise(r => setTimeout(r, 10000));
    })

    if (chartDataReceived) {
        this.output = data;
        //console.log(this.output['result'][0].data)
        //console.log(this.output['result'][0].charts)

        //console.log(this.output['result'][1].form_data)
        console.log(this.output)

        //console.log(this.output.result[3].id)
    }
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
