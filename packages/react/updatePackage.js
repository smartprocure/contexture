let _ = require('lodash/fp')
let readPkg = require('read-pkg')
let writePkg = require('write-pkg')

let updatePackage = async (path, newValue) => {
  let current = await readPkg()
  writePkg(
    _.flow(
      _.set(path, newValue),
      _.omit(['_id'])
    )(current)
  )
  console.info(`Updated ${path} from ${_.get(path, current)} to ${newValue}`)
}

updatePackage(process.argv[2], process.argv[3])
