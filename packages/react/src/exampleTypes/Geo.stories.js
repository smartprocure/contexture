import React from 'react'
import { storiesOf } from '@storybook/react'
import AsyncSelect from 'react-select/lib/Async'
import ThemePicker from '../stories/themePicker'
import { Flex } from '../greyVest'
import TestTree from './stories/testTree'
import { Geo } from '.'

storiesOf('ExampleTypes|Geo filter & HERE maps', module)
  .addDecorator(ThemePicker('greyVest'))
  .add('Geo filter & HERE maps', () => (
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
            loadOptions={async () => [
              {
                label: 'Result A',
                value: 'foo'
              },
              {
                label: 'Result B',
                value: 'boo'
              }
            ]}
            path={['geo']}
            AutoComplete={AsyncSelect}
            GeoCodeLocation={async () => ({
              latitude: 42.697708,
              longitude: 23.321867
            })}
          />
        </div>
      </Flex>
    </div>
  ))
