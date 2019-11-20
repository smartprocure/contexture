import React from 'react'
import _ from 'lodash/fp'
import F from 'futil'
import { Flex } from '../greyVest'
import { contexturify } from '../utils/hoc'

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

let GeoComponent = ({
  tree,
  node,
  loadOptions,
  GeoCodeLocation = _.noop,
  AutoComplete = null,
  placeholder = 'Address ...',
  theme: { Select, NumberInput },
}) => (
  <Flex style={{ flexFlow: 'column' }}>
    <Select
      style={elementStyle}
      value={node.operator}
      onChange={e => tree.mutate(node.path, { operator: e.target.value })}
      options={F.autoLabelOptions(operatorOptions)}
    />
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
          defaultInputValue={node.location}
          placeholder={placeholder}
          noOptionsMessage={() => ''}
          styles={customStyles}
          loadOptions={loadOptions}
          onInputChange={newValue => {
            const inputValue = newValue.replace(/[^a-zA-Z0-9\s]+/g, '')
            return inputValue
          }}
          onChange={async ({ label, value }) => {
            let data = await GeoCodeLocation(value)
            if (data && data.latitude && data.longitude) {
              tree.mutate(node.path, {
                latitude: data.latitude,
                longitude: data.longitude,
                location: label,
              })
            }
          }}
        />
      )}
      {!AutoComplete && <div>Autocomplete component is required!</div>}
    </div>
  </Flex>
)

export default contexturify(GeoComponent)
