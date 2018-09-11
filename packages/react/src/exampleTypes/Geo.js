import React from 'react'
import { observer } from 'mobx-react'
import { Flex } from '../layout/Flex'
import { exampleTypes } from 'contexture-client'
import injectTreeNode from '../utils/injectTreeNode'
import AsyncSelect from 'react-select/lib/Async'

const customStyles = {
  valueContainer: styles => ({ ...styles, ...({
    overflow: 'hidden',
    textOverflow: 'ellipsis'
  }) }),
}

const elementStyle = {
  flex: 1,
  marginBottom: '5px'
}

const operatorOptions = ['within', 'not within']

let GeoComponent = injectTreeNode(
  observer(({ tree, node, loadOptions, placeholder='Address ...' }) => (
    <Flex style={{ flexFlow: 'column' }}>
      <select style={elementStyle} value={node.operator} onChange={e => tree.mutate(node.path, { operator: e.target.value })}>
        {operatorOptions.map(o => (<option key={o} value={o}>{o}</option>))}
      </select>
      <div style={elementStyle}>
        <input type="number" min="1" value={node.radius} onChange={e => tree.mutate(node.path, { radius: e.target.value })} placeholder="Enter number of miles ..."/> from
      </div>
      <div style={elementStyle}>
        <AsyncSelect
          cacheOptions
          escapeClearsValue
          placeholder={placeholder}
          noOptionsMessage={x => ''}
          styles={customStyles}
          loadOptions={loadOptions}
          onInputChange={newValue => {
            const inputValue = newValue.replace(/\W/g, '');
            tree.mutate(node.path, { location: inputValue })
            return inputValue;
          }}
        />
      </div>
    </Flex>
  )),
  exampleTypes.geo
)
GeoComponent.displayName = 'Geo'

export default GeoComponent
