import React from 'react'
import { storiesOf } from '@storybook/react'
import AsyncSelect from 'react-select/lib/Async'
import { loadHereOptions, geoCodeLocation } from '../utils/geo'
import ThemePicker from '../stories/themePicker'
import { Flex } from '../greyVest'
import TestTree from './stories/testTree'
import { Geo } from '.'

storiesOf('Components|ExampleTypes', module)
  .addDecorator(ThemePicker('greyVest'))
  .addWithJSX('Geo filter & HERE maps', () => (
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
          <Geo
            tree={TestTree()}
            placeholder="Enter address, city, state, zip or business name ..."
            loadOptions={loadHereOptions}
            path={['geo']}
            AutoComplete={AsyncSelect}
            GeoCodeLocation={geoCodeLocation}
          />
        </div>
      </Flex>
    </div>
  ))
