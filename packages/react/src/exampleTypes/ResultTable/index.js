import React from 'react'
import _ from 'lodash/fp.js'
import F from 'futil'
import { fieldsToOptions } from '../../utils/fields.js'
import { contexturifyWithoutLoader } from '../../utils/hoc.js'
import { applyDefaults, inferSchema } from '../../utils/schema.js'
import { newNodeFromField } from '../../utils/search.js'
import Header from './Header.js'
import TableBody from './TableBody.js'
import HighlightedColumnHeader from './HighlightedColumnHeader.js'
import ResultTableFooter from './ResultTableFooter.js'
import { withTheme } from '../../utils/theme.js'

let getIncludes = (schema, node) =>
  F.when(_.isEmpty, _.map('field', schema))(node.include)

let DefaultRow = withTheme(({ theme: { Tr = 'tr' }, ...props }) => (
  <Tr
    {..._.omit(['record', 'fields', 'visibleFields', 'hiddenFields'], props)}
  />
))

let ResultTable = ({
  fields,
  infer,
  path,
  criteria,
  node = {},
  tree,
  defaultDisplay,
  NoResultsComponent = 'No Results Found',
  IntroComponent = null, // Initial component to be shown instead of the grid when no data has been loaded
  Row = DefaultRow, // accept a custom Row component so we can do fancy expansion things
  getRowKey, // allow passing a custom function to generate unique row key
  mapNodeToProps = () => ({}),
  pageSizeOptions, // an array of options to set the # of rows per page (default [20, 50, 100, 250])
  limitedResults,
  stickyColumn,
  hideFooter,
  footerStyle,
  theme,
}) => {
  const { Table, Thead, Tr, Th } = theme

  // If there are no fields, we won't render anything. This is most definitely a
  // user error when it happens
  if (_.isEmpty(fields) && !infer) throw new Error('Fields are empty')
  // From Theme/Components
  let mutate = tree.mutate(path)
  // Account for all providers here (memory provider has results with no response parent)
  let resultsLength = F.cascade(
    ['context.response.results.length', 'context.results.length'],
    node
  )
  let totalRecords = F.cascade(
    ['context.response.totalRecords', 'context.totalRecords'],
    node
  )

  let blankRows =
    limitedResults &&
    resultsLength < node.pageSize &&
    totalRecords > resultsLength

  // NOTE infer + add columns does not work together (except for anything explicitly passed in)
  //   When removing a field, it's not longer on the record, so infer can't pick it up since it runs per render
  let schema = _.flow(
    _.merge(infer && inferSchema(node)),
    applyDefaults,
    _.values,
    _.orderBy('order', 'desc')
  )(fields)
  let includes = getIncludes(schema, node)
  let isIncluded = (x) => _.includes(x.field, includes)
  let visibleFields = _.flow(
    _.map((field) => _.find({ field }, schema)),
    _.compact
  )(includes)
  let hiddenFields = _.reject(isIncluded, schema)

  let headerProps = {
    mapNodeToProps,
    fields,
    visibleFields,
    includes,
    addOptions: fieldsToOptions(hiddenFields),
    addFilter: (field) =>
      tree.add(criteria, newNodeFromField({ field, fields })),
    tree,
    node,
    mutate,
    criteria,
    theme,
  }

  let columnGroupsHeight = _.flow(
    _.map('fieldGroup.length'),
    _.max
  )(visibleFields)

  let columnGroups = _.reduce(
    (columnGroups, { fieldGroup, HeaderCell, HeaderGroup }) => {
      for (let i = 0; i < columnGroupsHeight; i++) {
        let groupRow = columnGroups[i] || (columnGroups[i] = [])
        let groupName = _.getOr('', i, fieldGroup)
        let lastGroup = _.last(groupRow)
        if (_.get('groupName', lastGroup) === groupName) {
          lastGroup.colspan++
          lastGroup.HeaderCell = HeaderCell
        } else groupRow.push({ groupName, colspan: 1, HeaderCell, HeaderGroup })
      }
      return columnGroups
    },
    [],
    visibleFields
  )

  return (
    <>
      <Table data-path={node.path}>
        <Thead>
          {F.mapIndexed(
            (columnGroupRow, i) => (
              <Tr key={i}>
                {F.mapIndexed(
                  ({ groupName, colspan, HeaderCell = Th, HeaderGroup }, j) => (
                    <HeaderCell key={j} colSpan={colspan}>
                      <span>
                        {HeaderGroup ? (
                          <HeaderGroup>{groupName}</HeaderGroup>
                        ) : (
                          groupName
                        )}
                      </span>
                    </HeaderCell>
                  ),
                  columnGroupRow
                )}
              </Tr>
            ),
            columnGroups
          )}
          <Tr>
            {F.mapIndexed(
              (x, i) => (
                <Header
                  key={x.field}
                  field={x}
                  isLastColumn={i === visibleFields.length - 1}
                  isStickyColumn={stickyColumn && x.field === stickyColumn}
                  {...headerProps}
                />
              ),
              visibleFields
            )}
            <HighlightedColumnHeader node={node} />
          </Tr>
        </Thead>
        <TableBody
          {...{
            node,
            fields,
            visibleFields,
            hiddenFields,
            schema,
            Row,
            getRowKey,
            blankRows,
            pageSize: Math.min(node.pageSize, totalRecords),
            stickyColumn,
            NoResultsComponent,
            IntroComponent,
            defaultDisplay,
          }}
        />
      </Table>

      {!hideFooter && node.pageSize > 0 && (
        <ResultTableFooter
          {...{
            tree,
            node,
            path,
            pageSizeOptions,
            disabled: blankRows,
            style: footerStyle,
          }}
        />
      )}
    </>
  )
}

export default contexturifyWithoutLoader(ResultTable)
