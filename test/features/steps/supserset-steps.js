const { Then, When } = require('@cucumber/cucumber')
const { expect } = require('chai')
const { getSupsersetChart } = require('../helpers/api-helpers')

function verifyResultRowExistsWithCorrectResultValue(resultValue, outputData, resultField = null) {
    return outputData.find((r) => {
        for (key in r) {
            if (resultField != null) {
                const chartElementKey = Array(r)[0][0];
                const chartElementKeyValue = Array(r)[0][1];

                return resultField == chartElementKey && chartElementKeyValue == resultValue;
            }
            else {
                const chartElementKeyValue = Array(r)[0];

                return chartElementKeyValue == resultValue;
            }
        }
    });
}

When('I check Superset for chart data using the following', { timeout: 40 * 1000 }, async function (table) {
    const params = {}
    table.hashes().forEach(hash => {
        params[hash.field] = hash.value
    })

    var chartDataReceived = false;

    const data = await new Promise((resolve) => {
        getSupsersetChart(params, function (initialiseClientCallback) {

            if (initialiseClientCallback != null) {
                chartDataReceived = true;
                resolve(initialiseClientCallback);
            }
        })

        new Promise(r => setTimeout(r, 20000));
    })

    if (chartDataReceived) {
        this.output = data;
    }
})

Then('there should be a result identified by {string} of {string}', function (field, value) {
    expect(this.output != [], 'Could not find chart data').to.not.be.undefined

    expect(verifyResultRowExistsWithCorrectResultValue(value, this.output, field), 'The expected result does not match the actual result').to.not.be.undefined
})

Then('there should be a count of {string}', function (value) {
    expect(this.output != [], 'Could not find chart data').to.not.be.undefined

    expect(verifyResultRowExistsWithCorrectResultValue(value, this.output), 'The expected result does not match the actual result').to.not.be.undefined
})

Then('there should be a result identified by {string} with the following fields and values', function (field, table) {
    expect(this.output != [], 'Could not find chart data').to.not.be.undefined

    this.output.find((r) => {
        for (key in Array(r)) {
            table.hashes().forEach(hash => {
                if (r[0] === field) {
                    expect(Math.round(r[1]), r[0]).to.equal(Math.round(hash.value))
                }
            })
        }
    });
})

Then('there should be a result identified by {string} of {string} with the following fields and values', function (field, value, table) {
    expect(this.output != [], 'Could not find chart data').to.not.be.undefined

    this.output.find((r) => {
        for (key in Array(r)) {
            table.hashes().forEach(hash => {
                if (r[0] === field) {
                    if (r[1] === value) {
                        expect(Math.round(r[2]), r[0]).to.equal(Math.round(hash.value))
                    }
                }
            })
        }
    });
})
