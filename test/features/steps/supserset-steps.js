const { Then, When } = require('@cucumber/cucumber')
const { expect } = require('chai')
const { getSupsersetChart } = require('../helpers/api-helpers')

When('I check Superset for chart data using the following', async function (table) {
    const params = {}
    table.hashes().forEach(hash => {
        params[hash.field] = hash.value
    })

    const { data } = await getSupsersetChart(params)
    this.output = data

    var result = null;

    if (Array.isArray(this.output.result)) {
        result = this.output; //There is always only one result object with one data element
    }
    else {
        result = this.output;
    }

    console.log(result)

    /* for (var j = 0; j < result.length; j++) {
         for (key in result[j]) {
             const chartKey = key;
             const chartValue = result[j][key];
 
             console.log(chartKey + ": " + chartValue);
         }
 
         console.log(result[j]);
     }*/
})

Then('there should be a result identified by {string} of {string} with the following fields and values', function (field, value, table) {
    const row = this.output.rows.find(r => r[field] === value)
    expect(row, 'Could not find row').to.not.be.undefined

    table.hashes().forEach(hash => {
        var result = String(row[hash.field]).replace(/\bb\*(.*?)\*/g, "'");

        expect(Math.round(result), hash.field).to.equal(Math.round(hash.value))
    })
})
