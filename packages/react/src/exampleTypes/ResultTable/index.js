import React from 'react'
import _ from 'lodash/fp'
import * as F from 'futil'
import { fieldsToOptions } from '../../FilterAdder'
import { contexturify } from '../../utils/hoc'
import { applyDefaults, inferSchema } from '../../utils/schema'
import { newNodeFromField } from '../../utils/search'
import Header from './Header'
import TableBody from './TableBody'
import HighlightedColumnHeader from './HighlightedColumnHeader'
import ResultTableFooter from './ResultTableFooter'

let getIncludes = (schema, node) =>
  F.when(_.isEmpty, _.map('field', schema))(node.include)

let Tr = props => (
  <tr
    {..._.omit(['record', 'fields', 'visibleFields', 'hiddenFields'], props)}
  />
)

let ResultTable = ({
  fields,
  infer,
  path,
  criteria,
  node = {},
  tree,
  NoResultsComponent = 'No Results Found',
  IntroComponent = null, // Initial component to be shown instead of the grid when no data has been loaded
  Row = Tr, // accept a custom Row component so we can do fancy expansion things
  mapNodeToProps = () => ({}),
  pageSizeOptions, // an array of options to set the # of rows per page (default [20, 50, 100, 250])
  theme: { Table },
}) => {
  // From Theme/Components
  let mutate = tree.mutate(path)
  // Account for all providers here (memory provider has results with no response parent)
  let hasResults =
    !!_.get('context.response.results.length', node) ||
    !!_.get('context.results.length', node)
  // NOTE infer + add columns does not work together (except for anything explicitly passed in)
  //   When removing a field, it's not longer on the record, so infer can't pick it up since it runs per render
  let schema = _.flow(
    _.merge(infer && inferSchema(node)),
    applyDefaults,
    _.values,
    _.orderBy('order', 'desc')
  )(fields)
  let includes = getIncludes(schema, node)
  let isIncluded = x => _.includes(x.field, includes)
  let visibleFields = _.flow(
    _.map(field => _.find({ field }, schema)),
    _.compact
  )(includes)
  let hiddenFields = _.reject(isIncluded, schema)

  let headerProps = {
    mapNodeToProps,
    fields,
    visibleFields,
    includes,
    addOptions: fieldsToOptions(hiddenFields),
    addFilter: field => tree.add(criteria, newNodeFromField({ field, fields })),
    tree,
    node,
    mutate,
    criteria,
  }
  if (!node.updating && hasResults) {
    return (
      <>
        <Table>
          <thead>
            <tr>
              {F.mapIndexed(
                x => (
                  <Header key={x.field} field={x} {...headerProps} />
                ),
                visibleFields
              )}
              <HighlightedColumnHeader node={node} />
            </tr>
          </thead>
          <TableBody
            {...{
              node,
              fields,
              visibleFields,
              hiddenFields,
              schema,
              Row,
            }}
          />
        </Table>
        {node.pageSize > 0 && (
          <ResultTableFooter {...{ tree, node, path, pageSizeOptions }} />
        )}
      </>
    )
  }
  if (!node.markedForUpdate && !node.updating && !hasResults) {
    return NoResultsComponent
  }
  return IntroComponent
}

export let PagedResultTable = contexturify(ResultTable)
export default PagedResultTable
