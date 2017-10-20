import * as F from 'futil-js'
import _ from 'lodash/fp'

export let promisedProps = Promise.props || (async x => _.zipObject(_.keys(x), await Promise.all(_.values(x))))

export let mapAsync = _.curry((f, d) => Promise.all(F.mapIndexed(f, d)))
export let mapValuesAsync = _.curry((f, d) => promisedProps(_.mapValues(f, d)))