import React from 'react'
import F from 'futil'
import _ from 'lodash/fp'
import { setDisplayName } from 'recompose'
import { inject, observer, Observer, useLocalStore } from 'mobx-react'
import { observable } from 'mobx'
import { withTheme } from '../utils/theme'
import pluralize from 'pluralize'
import Box from './Box'
import Flex from './Flex'
import GVTextInput from './TextInput'
import GVTextHighlight from './TextHighlight'
import { isField } from '../utils/fields'

let PickerContext = React.createContext()

// Unflatten by with support for arrays (allow dots in paths) and not needing a _.keyBy first
let unflattenObjectBy = _.curry((iteratee, x) =>
  _.zipObjectDeep(F.mapIndexed(iteratee, x), _.values(x))
)

let getItemLabel = item =>
  isField(item)
    ? F.cascade(['shortLabel', 'label'], item)
    : _.startCase(item._key)

let toNested = _.flow(
  _.map(x => _.defaults({ path: x.value }, x)),
  unflattenObjectBy('path')
)

let FilteredSection = _.flow(
  setDisplayName('FilteredSection'),
  observer
)(
  ({
    options,
    highlight,
    style = { maxHeight: 340, overflowY: 'scroll' },
    checked,
  }) => {
    let { PickerItem, TextHighlight } = React.useContext(PickerContext)
    return (
      <div style={style}>
        {F.mapIndexed(
          (option, field) => (
            <PickerItem
              key={field}
              isChecked={checked.has(option.value)}
              onClick={() => {
                checked.has(option.value)
                  ? checked.delete(option.value)
                  : checked.set(option.value, option)
              }}
            >
              <TextHighlight text={option.label} pattern={highlight} />
            </PickerItem>
          ),
          options
        )}
      </div>
    )
  }
)

let Section = _.flow(
  setDisplayName('Section'),
  observer
)(
  ({
    options,
    onClick,
    selected,
    checked,
    style = { overflow: 'auto', width: '100%', maxHeight: 300 },
  }) => {
    let { PickerItem } = React.useContext(PickerContext)
    return (
      <div style={style}>
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
  }
)

let PanelTreePicker = inject((store, { options, checked }) => {
  let x = {
    checked,
    state: observable({ selected: [] }),
    nestedOptions: toNested(options),
    selectAtLevel: _.curry((level, key, field) => {
      if (isField(field)) {
        checked.has(field.value)
          ? checked.delete(field.value)
          : checked.set(field.value, field)
      } else {
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
  itemType = 'filter',
  style = {
    margin: 0,
    padding: 0,
    minWidth: 500,
    maxHeight: 400,
    paddingBottom: 10,
  },
  theme: { Button },
}) => {
  let state = useLocalStore(() => ({
    filter: '',
    checked: new Map(),
  }))
  return (
    <PickerContext.Provider value={{ PickerItem, TextHighlight }}>
      <Box style={style}>
        <Observer>
          {() => (
            <>
              <TextInput
                style={{ marginBottom: 10 }}
                value={state.filter}
                onChange={e => (state.filter = e.target.value)}
                placeholder="Enter filter keyword..."
              />
              {state.filter ? (
                <FilteredSection
                  checked={state.checked}
                  highlight={state.filter}
                  options={matchLabel(state.filter)(options)}
                />
              ) : (
                <PanelTreePicker
                  options={options}
                  checked={state.checked}
                />
              )}
            </>
          )}
        </Observer>
      </Box>
      <Flex justifyContent="space-between" style={{ marginTop: 20 }}>
        <Button
          onClick={() => {
            state.checked = new Map()
            onChange()
          }}
        >
          Cancel
        </Button>
        <Observer>
          {() =>
            !!state.checked.size && (
              <Button
                primary
                onClick={() => onChange(Array.from(state.checked.values()))}
              >
                Add{' '}
                {`${state.checked.size} ${pluralize(
                  itemType,
                  state.checked.size
                )}`}
              </Button>
            )
          }
        </Observer>
      </Flex>
    </PickerContext.Provider>
  )
}

export default withTheme(NestedPicker)
