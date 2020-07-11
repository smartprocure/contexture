import React, { useState } from 'react'
import _ from 'lodash/fp'
import F from 'futil'
import { withTheme } from '../utils/theme'
import { toNumber } from '../utils/format'
import { setDisplayName } from 'recompose'
import { observer } from 'mobx-react'
import { Flex } from '../greyVest'
import { contexturifyWithoutLoader } from '../utils/hoc'

let commonStyle = {
  justifyContent: 'space-between',
  alignItems: 'center',
  display: 'flex',
  cursor: 'pointer',
}

export let displayFn = (name, label) => (_.isString(label) ? label : name)
export let displayBlankFn = () => <i>Not Specified</i>

export let Cardinality = _.flow(
  setDisplayName('Cardinality'),
  observer
)(({ node, tree }) =>
  _.get('context.cardinality', node) ? (
    <Flex
      className="contexture-facet-cardinality"
      justifyContent="space-between"
    >
      <div>
        Showing{' '}
        {toNumber(_.min([node.size || 10, _.size(node.context.options)]))} of{' '}
        {toNumber(node.context.cardinality)}
      </div>
      {node.context.cardinality > (node.size || 10) && (
        <div>
          <a
            onClick={() =>
              tree.mutate(node.path, { size: (node.size || 10) + 10 })
            }
            style={{ cursor: 'pointer' }}
          >
            View More
          </a>
        </div>
      )}
    </Flex>
  ) : null
)

export let SelectAll = _.flow(
  setDisplayName('SelectAll'),
  observer,
  withTheme
)(({ node, tree, theme: { Checkbox } }) => {
  let missingOptions = _.difference(
    _.map('name', _.get('context.options', node)),
    node.values
  )
  let allSelected = _.isEmpty(missingOptions)
  return (
    <label style={commonStyle}>
      <Checkbox
        checked={allSelected}
        onChange={() => {
          if (allSelected)
            tree.mutate(node.path, {
              values: [],
            })
          else
            tree.mutate(node.path, {
              values: node.values.concat(missingOptions),
            })
        }}
      />
      <div style={{ flex: 2, padding: '0 5px' }}>Select All Visible</div>
    </label>
  )
})

export let FacetOptionsFilter = _.flow(
  setDisplayName('FacetOptionsFilter'),
  observer,
  withTheme
)(({ tree, node, theme: { TextInput, Button, ButtonGroup } }) => {
  let [val, setVal] = useState(node.optionsFilter)
  let buttonEnabled = val !== node.optionsFilter
  let submit = () =>
    buttonEnabled && tree.mutate(node.path, { optionsFilter: val })
  return (
    <ButtonGroup>
      <TextInput
        value={val}
        onChange={e => {
          setVal(e.target.value)
        }}
        onKeyPress={e => e.key === 'Enter' && submit()}
        onBlur={submit}
        placeholder="Search..."
      />
      <Button primary={node.optionsFilter !== val} onClick={submit}>
        Find
      </Button>
    </ButtonGroup>
  )
})

export let FacetCheckboxList = contexturifyWithoutLoader(
  ({
    tree,
    node,
    hide,
    display = displayFn,
    displayBlank = displayBlankFn,
    formatCount,
    theme: { Checkbox },
  }) =>
    _.flow(
      _.partition(x => _.includes(x.name, node.values)),
      _.flatten,
      _.map(({ name, label, count }) => {
        let lens = tree.lens(node.path, 'values')
        return (
          <label
            key={name}
            style={commonStyle}
            title={`${display(name, label)} : ${formatCount(count)}`}
          >
            <Checkbox {...F.domLens.checkboxValues(name, lens)} />
            <div style={{ flex: 2, padding: '0 5px' }}>
              {display(name, label) || displayBlank()}
            </div>
            {!hide.counts && <div>{formatCount(count)}</div>}
          </label>
        )
      })
    )(_.get('context.options', node))
)
