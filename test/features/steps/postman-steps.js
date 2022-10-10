const { Given, When } = require('@cucumber/cucumber')
const newman = require('newman')

Given('I set FHIR bundle parameters', function (dataTable) {
  this.input.fhirParams = dataTable.hashes()
})

When('I POST the FHIR bundle to the IOL', { timeout: 10 * 1000 }, async function () {
  const { POSTMAN_ENV } = process.env

  await new Promise(r => setTimeout(r, 5000));

  return new Promise((resolve, reject) => {
    newman.run(
      {
        collection: require('../../CDR.postman_collection.json'),
        environment: require(`../../${POSTMAN_ENV}.postman_environment.json`),
        reporters: 'cli',
        /*
          CARES implements the following bundles:
          a. Cares Submit random bundle
            -> Note: This is to submit resquests for COVID19 data only
          b. FULL HIV CBS & CARES & LAB ORDER Submit random bundle
            -> Note: This is to sunmit requests for HIV, COVID19, Lab Orders and Lab results
        */
        folder: 'FULL HIV CBS & CARES & LAB ORDER Submit random bundle',
        globalVar: this.input.fhirParams
      },
      err => {
        if (err) {
          reject(err)
        }
        resolve()
      }
    )
  })
})
