import _ from 'lodash/fp.js'
import readPkg from 'read-pkg'
import writePkg from 'write-pkg'

let updatePackage = async mergeObj => {
  let current = await readPkg()
  await writePkg(_.flow(_.merge(_, mergeObj), _.omit(['_id']))(current))
  console.info(`Updated package with ${JSON.stringify(mergeObj)}`)
}

updatePackage({ main: 'dist/esm/greyVest/index.js', name: 'grey-vest' })
