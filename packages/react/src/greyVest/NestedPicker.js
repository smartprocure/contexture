import React from 'react'
import F from 'futil'
import _ from 'lodash/fp'
import { setDisplayName } from 'recompose'
import { inject, observer, Observer } from 'mobx-react'
import { observable } from 'mobx'
import { withTheme } from '../utils/theme'
import Box from './Box'
import pluralize from 'pluralize'

import GVTextHighlight from './TextHighlight'
import GVTextInput from './TextInput'

let PickerContext = React.createContext()

// Unflatten by with support for arrays (allow dots in paths) and not needing a _.keyBy first
let unflattenObjectBy = _.curry((iteratee, x) =>
  _.zipObjectDeep(F.mapIndexed(iteratee, x), _.values(x))
)

let isField = x => x.typeDefault

let getItemLabel = item =>
  isField(item) ? item.shortLabel || item.label : _.startCase(item._key)

let toNested = _.flow(
  _.map(x => _.defaults({ path: x.value }, x)),
  unflattenObjectBy('path')
)

let FilteredSection = _.flow(
  setDisplayName('FilteredSection'),
  observer
)(({ options, onClick, highlight, checked }) => {
  let { PickerItem, TextHighlight } = React.useContext(PickerContext)
  return (
    <div>
      {F.mapIndexed(
        (option, field) => (
          <PickerItem
            key={field}
            isChecked={checked.has(option.value)}
            onClick={() => {
              checked.has(option.value)
              ? checked.delete(option.value)
              : checked.set(option.value, option.value)
              onClick(Array.from(checked.keys()))
            }}
          >
            <TextHighlight text={option.label} pattern={highlight} />
          </PickerItem>
        ),
        options
      )}
    </div>
  )
})

let Section = _.flow(
  setDisplayName('Section'),
  observer
)(({ options, onClick, selected, checked }) => {
  let { PickerItem } = React.useContext(PickerContext)
  return (
    <div style={{ overflow: 'auto', width: '100%' }}>
      {_.map(
        item => (
          <PickerItem
            key={item._key}
            onClick={() => onClick(item.value || item._key, item)}
            active={selected === item._key}
            hasChildren={!isField(item)}
            isChecked={checked.has(item.value)}
          >
            {getItemLabel(item)}
          </PickerItem>
        ),
        _.flow(F.unkeyBy('_key'), _.sortBy(getItemLabel))(options)
      )}
    </div>
  )
})

let PanelTreePicker = inject((store, { onChange, options, checked }) => {
  let x = {
    checked,
    state: observable({ selected: [] }),
    nestedOptions: toNested(options),
    selectAtLevel: _.curry((level, key, field) => {
      if (isField(field)) {
        checked.has(field.value)
          ? checked.delete(field.value)
          : checked.set(field.value, field.value)
        onChange(Array.from(checked.keys()))
      }
      else {
        x.state.selected.splice(level, x.state.selected.length - level, key)
      }
    }),
  }
  return x
})(
  observer(({ selectAtLevel, state, nestedOptions, checked }) => (
    <div
      className="panel-tree-picker"
      style={{ display: 'inline-flex', width: '100%' }}
    >
      <Section
        checked={checked}
        options={nestedOptions}
        onClick={selectAtLevel(0)}
        selected={state.selected[0]}
      />
      {F.mapIndexed(
        (_key, index) => (
          <Section
            key={index}
            checked={checked}
            options={_.get(state.selected.slice(0, index + 1), nestedOptions)}
            onClick={selectAtLevel(index + 1)}
            selected={state.selected[index + 1]}
          />
        ),
        state.selected
      )}
    </div>
  ))
)
PanelTreePicker.displayName = 'PanelTreePicker'

let matchLabel = str => _.filter(x => F.matchAllWords(str)(x.label))

let NestedPicker = ({
  options,
  onChange,
  PickerItem = 'div',
  TextInput = GVTextInput,
  TextHighlight = GVTextHighlight,
  filterLabel = 'column',
  theme: { Button }
}) => {
  let filter = React.useState('')
  let checked = observable(new Map())
  return (
    <PickerContext.Provider value={{ PickerItem, TextHighlight }}>
    <Box style={{margin: 0, padding: 0}}>
      <TextInput style={{marginBottom: 15}}
        {...F.domLens.value(filter)}
        placeholder="Enter filter keyword..."
      />
      {F.view(filter) ? (
        <FilteredSection
          checked={checked}
          highlight={F.view(filter)}
          options={matchLabel(F.view(filter))(options)}
        />
      ) : (
        <PanelTreePicker options={options} checked={checked} />
      )}
      <Observer>
      {() => !!checked.size &&
        <Button
          primary
          style={{ marginTop: 20, width: '100%'}}
          onClick={() => onChange(Array.from(checked.keys()))}
        >
          Add {`${checked.size} ${pluralize(filterLabel, checked.size)}`}
        </Button>}
      </Observer>
      </Box>
    </PickerContext.Provider>
  )
}

export default withTheme(NestedPicker)
