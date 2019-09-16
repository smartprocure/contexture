let _ = require('lodash/fp')
let readPkg = require('read-pkg')
let writePkg = require('write-pkg')

let updatePackage = async mergeObj => {
  let current = await readPkg()
  await writePkg(
    _.flow(
      _.merge(_, mergeObj),
      _.omit(['_id'])
    )(current)
  )
  console.info(`Updated package with ${JSON.stringify(mergeObj)}`)
}

updatePackage({ main: 'dist/greyVest/index.js', name: 'grey-vest' })
