const { Then, When } = require('@cucumber/cucumber')
const { expect } = require('chai')
const { getSupsersetChart } = require('../helpers/api-helpers')
const SupersetData = require("../helpers/SupersetData");
const SupersetDataHelper = require("../helpers/SupersetDataHelper");

When('I check Superset for chart data using the following', { timeout: 60 * 1000 }, async function (table) {
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

        new Promise(r => setTimeout(r, 50000)); // This step allows time for the Superset webpage scraping to complete 
    })

    if (chartDataReceived) {
        this.output = data;
    }
})

Then('there should be a superset count of {string}', function (value) {
    const chartData = this.output.find(r => Array(r)[0][0] === value)

    expect(chartData, 'The expected result does not match the actual result').to.not.be.undefined
})

Then('there should be a superset result identified by {string} with the following fields and values', function (field, table) {
    const chartData = this.output.find(r => Array(r)[0][0] === field)

    expect(chartData, 'Could not find chart data').to.not.be.undefined

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

Then('there should be a superset row identified by {string} of {string} with the following fields and values', function (field, value, table) {
    const chartData = this.output.find(r => Array(r)[0][0] === field)

    expect(chartData, 'Could not find chart data').to.not.be.undefined

    this.output.find((r) => {
        for (key in Array(r)) {
            table.hashes().forEach(hash => {
                if (r[0] === field) {
                    const rowData = this.output.find(y => Array(y)[0][1] === value)

                    expect(rowData, 'Could not find row data').to.not.be.undefined

                    if (r[1] === value) {
                        expect(Math.round(r[2]), r[0]).to.equal(Math.round(hash.value))
                    }
                }
            })
        }
    });
})

Then('notify browser resources must be terminated after the following test', function () {
    SupersetDataHelper.TERMINATE_PUPPETEER_BROWSER_SESSION = true;
})
