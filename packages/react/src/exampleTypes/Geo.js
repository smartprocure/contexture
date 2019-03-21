import React from 'react'
import _ from 'lodash/fp'
import { observer } from 'mobx-react'
import { Flex } from '../layout/Flex'
import { exampleTypes } from 'contexture-client'
import injectTreeNode from '../utils/injectTreeNode'

const customStyles = {
  valueContainer: styles => ({
    ...styles,
    ...{
      overflow: 'hidden',
      textOverflow: 'ellipsis',
    },
  }),
}

const elementStyle = {
  flex: 1,
  marginBottom: '5px',
}

const operatorOptions = ['within', 'not within']

let selectInput = 'select'
let numberInput = props => <input type="number" {...props} />

let GeoComponent = injectTreeNode(
  observer(
    ({
      tree,
      node,
      loadOptions,
      SelectInput = selectInput,
      NumberInput = numberInput,
      GeoCodeLocation = _.noop,
      AutoComplete = null,
      placeholder = 'Address ...',
    }) => (
      <Flex style={{ flexFlow: 'column' }}>
        <SelectInput
          style={elementStyle}
          value={node.operator}
          onChange={e => tree.mutate(node.path, { operator: e.target.value })}
        >
          {operatorOptions.map(o => (
            <option key={o} value={o}>
              {o}
            </option>
          ))}
        </SelectInput>
        <div style={elementStyle}>
          <NumberInput
            min="1"
            value={node.radius}
            onChange={e => tree.mutate(node.path, { radius: e.target.value })}
            placeholder="Enter number of miles ..."
          />{' '}
          from
        </div>
        <div style={elementStyle}>
          {AutoComplete && (
            <AutoComplete
              cacheOptions
              escapeClearsValue
              defaultValue={node.selectedOption}
              placeholder={placeholder}
              noOptionsMessage={() => ''}
              styles={customStyles}
              loadOptions={loadOptions}
              onInputChange={newValue => {
                const inputValue = newValue.replace(/[^a-zA-Z0-9\s]+/g, '')
                return inputValue
              }}
              onChange={async selectedOption => {
                let data = await GeoCodeLocation(selectedOption.value)
                if (data && data.latitude && data.longitude && data.location) {
                  tree.mutate(node.path, {
                    selectedOption,
                    latitude: data.latitude,
                    longitude: data.longitude,
                    location: data.location,
                  })
                }
              }}
            />
          )}
          {!AutoComplete && <div>Autocomplete component is required!</div>}
        </div>
      </Flex>
    )
  ),
  exampleTypes.geo
)
GeoComponent.displayName = 'Geo'

export default GeoComponent
