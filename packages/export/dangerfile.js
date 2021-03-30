let { danger, fail, message, warn } = require('danger')
let duti = require('duti')
let fs = require('fs')

let readJsonIfExists = path => {
  try {
    return JSON.parse(fs.readFileSync(path, { encoding: 'utf8' }))
  } catch (e) {
    return undefined
  }
}

let config = {
  prNetChangeThreshold: 500,
  recommendedPrReviewers: 2,
  autoFix: {
    extensions: ['.js'],
  },
}

if (danger.github) {
  duti.prAssignee({ danger, fail })
  duti.netNegativePR({ danger, message })
  duti.bigPr({ danger, warn, config })
  duti.noPrDescription({ danger, fail })
  duti.requestedReviewers({ danger, warn, config })
  duti.autoFix({ message, config })
}

let testResults = readJsonIfExists('./test-results.json')
duti.hasTestErrors({ danger, fail, testResults: testResults })

let lintResults = readJsonIfExists('./lint-results.json')
duti.hasTestErrors({ danger, fail, testResults: lintResults })
