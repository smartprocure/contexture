import F from 'futil-js'
import _ from 'lodash/fp'

let differentFirst = (firstCase, normalCase) => (acc, i, list) =>
i === 0
  ? _.iteratee(firstCase)(acc, i, list)
  : _.iteratee(normalCase)(acc, i, list)

let hasPunctuation = F.testRegex(/.*(?=[.!?]$)/)

let punctuate = (punctuation = '.') => F.when(
  F.overNone([_.isEmpty, hasPunctuation]),
  F.append(punctuation)
)

let joinDescriptions = _.flow(
  _.compact,
  F.flowMap(_.trim, punctuate('.')),
  F.mapIndexed(differentFirst(_.upperFirst, _.lowerFirst)),
  _.join(' Then '),
  F.append(' Then press the "done" button.')
)

export let mapNodeToDescription = types => (node, fields) => joinDescriptions([
  _.get([node.field, 'description'], fields) || node.description,
  _.get([node.type, 'description'], types)
])
