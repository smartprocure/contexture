import F from 'futil'
import React from 'react'
import { storiesOf } from '@storybook/react'
import TestTree from './stories/testTree'
import ThemePicker from '../stories/themePicker'
import { CheckableResultTable } from '.'

storiesOf('Components|ExampleTypes/CheckableResultTable', module)
  .addDecorator(ThemePicker('greyVest'))
  .addWithJSX('With selected prop', () => {
    let selected = React.useState([])
    return (
      <div>
        Selected: {JSON.stringify(F.view(selected))}
        <CheckableResultTable
          tree={TestTree()}
          path={['results']}
          selected={selected}
          getValue="_id"
          fields={{
            _id: true,
            title: true,
            nested: { label: 'Nested Value', display: x => x.value },
          }}
        />
      </div>
    )
  })
  .addWithJSX('With selectedValue/onChange props', () => {
    let [selectedValue, onChange] = React.useState([])
    return (
      <div>
        Selected: {JSON.stringify(selectedValue)}
        <CheckableResultTable
          tree={TestTree()}
          path={['results']}
          {...{ selectedValue, onChange }}
          getValue="_id"
          fields={{
            _id: true,
            title: true,
            nested: { label: 'Nested Value', display: x => x.value },
          }}
        />
      </div>
    )
  })
