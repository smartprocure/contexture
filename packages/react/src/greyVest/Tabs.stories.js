import React from 'react'
import { storiesOf } from '@storybook/react'
import { withInfo } from '@storybook/addon-info'
import { action } from '@storybook/addon-actions'
import { observable } from 'mobx'
import { Observer } from 'mobx-react'
import { Tabs, Tab, TabLabel, TabContent, ButtonRadio, Button } from '.'
import decorator from './stories/decorator'
import tabDocs from './docs/tabs.md'

let state = observable({ tab: 'results' })

storiesOf('Components|GreyVest Library/Tabs', module)
  .add(
    'Docs',
    withInfo({ text: tabDocs, inline: true, source: false, header: false })(
      () => null
    )
  )
  .addDecorator(decorator)
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
