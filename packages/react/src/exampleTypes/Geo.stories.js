import React from 'react'
import AsyncSelect from 'react-select/lib/Async.js'
import { Flex } from '../greyVest/index.js'
import TestTree from './stories/testTree.js'
import Component from './Geo.js'

export default {
  component: Component,
}

export const Geo = () => (
  <div
    style={{
      backgroundColor: '#333',
      color: '#AAA',
      padding: '20px',
      borderRadius: '10px',
    }}
  >
    <Flex style={{ flexFlow: 'column wrap' }}>
      <div style={{ flex: 1 }}>
        <Component
          tree={TestTree()}
          placeholder="Enter address, city, state, zip or business name ..."
          loadOptions={async () => [
            {
              label: 'Result A',
              value: 'foo',
            },
            {
              label: 'Result B',
              value: 'boo',
            },
          ]}
          path={['geo']}
          AutoComplete={AsyncSelect}
          GeoCodeLocation={async () => ({
            latitude: 42.697708,
            longitude: 23.321867,
          })}
        />
      </div>
    </Flex>
  </div>
)
