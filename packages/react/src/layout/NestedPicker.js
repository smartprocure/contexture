import React from 'react'
import F from 'futil-js'
import _ from 'lodash/fp'
import { inject, observer } from 'mobx-react'
import { observable } from 'mobx'
import { useLens } from '../utils/react'
import TextHighlight from './TextHighlight'

// Unflatten by with support for arrays (allow dots in paths) and not needing a _.keyBy first
let unflattenObjectBy = _.curry((iteratee, x) =>
  _.zipObjectDeep(F.mapIndexed(iteratee, x), _.values(x))
)

let isField = x => x.typeDefault

const DefaultItem = ({ children, onClick, disabled }) => (
  <div onClick={onClick} disabled={disabled}>
    {children}
  </div>
)

let FilteredSection = observer(
  ({ options, onClick, highlight, Highlight, Item }) => (
    <div>
      {F.mapIndexed(
        (option, field) => (
          <Item key={field} onClick={() => onClick(option.value)}>
            <Highlight text={option.label} pattern={highlight} />
          </Item>
        ),
        options
      )}
    </div>
  )
)
FilteredSection.displayName = 'FilteredSection'

let getItemLabel = item =>
  isField(item) ? item.shortLabel || item.label : _.startCase(item._key)

let Section = observer(({ options, onClick, selected, Item }) => (
  <div>
    {_.map(
      item => (
        <Item
          key={item._key}
          onClick={() => onClick(item.value || item._key, item)}
          active={selected === item._key}
          disabled={selected && selected !== item._key}
          hasChildren={!isField(item)}
        >
          {getItemLabel(item)}
        </Item>
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
  observer(({ selectAtLevel, state, nestedOptions, Item }) => (
    <div
      className="panel-tree-picker"
      style={{ display: 'inline-flex', width: '100%', overflow: 'auto' }}
    >
      <Section
        options={nestedOptions}
        onClick={selectAtLevel(0)}
        selected={state.selected[0]}
        Item={Item}
      />
      {F.mapIndexed(
        (_key, index) => (
          <Section
            key={index}
            options={_.get(state.selected.slice(0, index + 1), nestedOptions)}
            onClick={selectAtLevel(index + 1)}
            selected={state.selected[index + 1]}
            Item={Item}
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
  Input = 'input',
  Highlight = TextHighlight,
  Item = DefaultItem,
}) => {
  let filter = useLens('')
  return (
    <div>
      <Input
        {...F.domLens.value(filter)}
        placeholder="Enter filter keyword..."
      />
      {F.view(filter) ? (
        <FilteredSection
          options={matchLabel(F.view(filter))(options)}
          onClick={onChange}
          highlight={F.view(filter)}
          Highlight={Highlight}
          Item={Item}
        />
      ) : (
        <PanelTreePicker options={options} onChange={onChange} Item={Item} />
      )}
    </div>
  )
}

export default observer(NestedPicker)
