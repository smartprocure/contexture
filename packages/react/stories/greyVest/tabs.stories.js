import React from 'react'
import { storiesOf } from '@storybook/react'
import { withInfo } from '@storybook/addon-info'
import { action } from '@storybook/addon-actions'
import { observable } from 'mobx'
import { Observer } from 'mobx-react'
import decorator from './decorator'
import {
  Tabs,
  Tab,
  TabLabel,
  TabContent,
  ButtonRadio,
  Button,
} from './../../src/themes/greyVest'

let tabDocs = `
# Overview

A tab control which switches out content dynamically. \`Tabs\` is used with one or more \`Tab\` components (or \`TabLabel\`/\`TabContent\` pairs) as children.

~~~js
<Tabs>
  <Tab label="Tab One">
    Tab One Contents
  </Tab>
  <Tab label="Tab Two">
    Tab Two Contents
  </Tab>
</Tabs>
~~~

# Component API

## \`Tabs\`

| Prop Name | Type | Description |
| --------- | ---- | ----------- |
| \`value\` | string/number | Sets tab value. Makes it controlled. |
| \`defaultValue\` | string/number | Default value if uncontrolled. |
| \`TabsList\` | Component | Component to use to render the list of tab options |
| \`TabPanel\` | Component | Component to use for the tab panel which wraps active tab content |
| \`onChange\` | (to, from) => {} | Function to handle tab change. Takes (to, from) and works on both controlled and uncontrolled Tab |

## \`Tab\`

| Prop Name | Type | Description |
| --------- | ---- | ----------- |
| \`value\` | string/number | Tab value, used to represent the underlying value. Defaults to the index in the list of children |
| \`label\` | Fragment | Label used for the tab option |
| \`children\` | Fragment | Tab contents shown if the tab is active |

## \`TabLabel\`
Used in conjunction with TabContent as an alternative to a combined Tab.

| Prop Name | Type | Description |
| --------- | ---- | ----------- |
| \`value\` | string/number | Tab value, used to represent the underlying value. Defaults to the index in the list of children |
| \`children\` | Fragment | Label used for the tab option |

## \`TabContent\`
Used in conjunction with TabLabel as an alternative to a combined Tab.

| Prop Name | Type | Description |
| --------- | ---- | ----------- |
| \`value\` | string/number | Tab value, used to represent the underlying value. Defaults to the index in the list of children |
| \`children\` | Fragment | Tab contents shown if the tab is active |
`

let state = observable({ tab: 'results' })

storiesOf('Components (Grey Vest)|Tabs', module)
  .addDecorator(decorator)
  .add(
    'Docs',
    withInfo({ text: tabDocs, inline: true, source: false, header: false })(
      () => null
    )
  )
  .addWithJSX('Base Usage', () => (
    <Tabs>
      <Tab label="Tab One">Tab One Contents</Tab>
      <Tab label="Tab Two">Tab Two Contents</Tab>
    </Tabs>
  ))
  .addWithJSX('Anonymous Values', () => (
    <Tabs defaultValue={0}>
      <Tab label="First Tab">First Tab Contents</Tab>
      <Tab label="Second Tab">Second Tab Contents</Tab>
    </Tabs>
  ))
  .addWithJSX('TabLabel and TabContent', () => (
    <Tabs>
      <TabLabel value="results">Results</TabLabel>
      <TabContent value="results">Results Tables</TabContent>
      <Tab value="analytics" label="Analytics">
        Charts and Stuff
      </Tab>
    </Tabs>
  ))
  .addWithJSX('Tab Render Function', () => (
    <Tabs>
      <Tab label="Analytics">Charts and Stuff</Tab>
      <Tab label="Analytics2" value="tab 2">
        {tab => `Current tab is ${tab}`}
      </Tab>
    </Tabs>
  ))
  .addWithJSX('Uncontrolled with defaultValue', () => (
    <Tabs defaultValue="analytics">
      <Tab value="results" label="Results">
        Results Tables
      </Tab>
      <Tab value="analytics" label="Analytics">
        Charts and Stuff
      </Tab>
    </Tabs>
  ))
  .addWithJSX('Controlled', () => (
    <Observer>
      {() => (
        <>
          <Button onClick={() => (state.tab = 'analytics')}>
            Change from {state.tab} to analytics
          </Button>
          <Tabs
            onChange={(x, y) => {
              state.tab = x
              action('change tab')(x, y)
            }}
            value={state.tab}
          >
            <Tab value="results" label="Results">
              Results Tables
            </Tab>
            <Tab value="analytics" label="Analytics">
              Charts and Stuff
            </Tab>
          </Tabs>
        </>
      )}
    </Observer>
  ))
  .addWithJSX('Custom TabList and TabPanel', () => (
    <Tabs TabsList={ButtonRadio} TabPanel={React.Fragment}>
      <Tab value="results" label="Results">
        Results Tables
      </Tab>
      <Tab value="analytics" label="Analytics">
        Charts and Stuff
      </Tab>
    </Tabs>
  ))
