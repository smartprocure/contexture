import React from 'react'
import F from 'futil-js'
import _ from 'lodash/fp'
import { inject, observer } from 'mobx-react'
import { observable } from 'mobx'
import { useLens } from '../utils/react'
import { withTheme } from '../utils/theme'

// Unflatten by with support for arrays (allow dots in paths) and not needing a _.keyBy first
let unflattenObjectBy = _.curry((iteratee, x) =>
  _.zipObjectDeep(F.mapIndexed(iteratee, x), _.values(x))
)

let isField = x => x.typeDefault

let FilteredSection = _.flow(
  observer,
  withTheme
)(({ options, onClick, highlight, theme: { TextHighlight, PickerItem } }) => (
  <div>
    {F.mapIndexed(
      (option, field) => (
        <PickerItem key={field} onClick={() => onClick(option.value)}>
          <TextHighlight text={option.label} pattern={highlight} />
        </PickerItem>
      ),
      options
    )}
  </div>
))
FilteredSection.displayName = 'FilteredSection'

let getItemLabel = item =>
  isField(item) ? item.shortLabel || item.label : _.startCase(item._key)

let Section = _.flow(
  observer,
  withTheme
)(({ options, onClick, selected, theme: { PickerItem } }) => (
  <div>
    {_.map(
      item => (
        <PickerItem
          key={item._key}
          onClick={() => onClick(item.value || item._key, item)}
          active={selected === item._key}
          disabled={selected && selected !== item._key}
          hasChildren={!isField(item)}
        >
          {getItemLabel(item)}
        </PickerItem>
      ),
      _.flow(
        F.unkeyBy('_key'),
        _.sortBy(getItemLabel)
      )(options)
    )}
  </div>
))
Section.displayName = 'Section'

let toNested = _.flow(
  _.map(x => _.defaults({ path: x.value }, x)),
  unflattenObjectBy('path')
)
let PanelTreePicker = inject((store, { onChange, options }) => {
  let x = {
    state: observable({ selected: [] }),
    nestedOptions: toNested(options),
    selectAtLevel: _.curry((level, key, field) => {
      if (isField(field)) onChange(field.value)
      else x.state.selected.splice(level, x.state.selected.length - level, key)
    }),
  }
  return x
})(
  observer(({ selectAtLevel, state, nestedOptions }) => (
    <div
      className="panel-tree-picker"
      style={{ display: 'inline-flex', width: '100%', overflow: 'auto' }}
    >
      <Section
        options={nestedOptions}
        onClick={selectAtLevel(0)}
        selected={state.selected[0]}
      />
      {F.mapIndexed(
        (_key, index) => (
          <Section
            key={index}
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

let NestedPicker = ({ options, onChange, theme }) => {
  let filter = useLens('')
  return (
    <div>
      <theme.Input
        {...F.domLens.value(filter)}
        placeholder="Enter filter keyword..."
      />
      {F.view(filter) ? (
        <FilteredSection
          options={matchLabel(F.view(filter))(options)}
          onClick={onChange}
          highlight={F.view(filter)}
        />
      ) : (
        <PanelTreePicker options={options} onChange={onChange} />
      )}
    </div>
  )
}

export default _.flow(
  observer,
  withTheme
)(NestedPicker)
