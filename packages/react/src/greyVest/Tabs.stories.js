import React from 'react'
import { action } from '@storybook/addon-actions'
import { observable } from 'mobx'
import { Observer } from 'mobx-react'
import { Tabs, Tab, TabLabel, TabContent, ButtonRadio, Button } from '.'
import decorator from './stories/decorator'
import tabDocs from './docs/tabs.mdx'

let state = observable({ tab: 'results' })

export default {
  title: 'GreyVest Library|Tabs',
  component: Tabs,
  parameters: { docs: { page: tabDocs } },
  decorators: [decorator],
}

export let baseUsage = () => (
  <Tabs>
    <Tab label="Tab One">Tab One Contents</Tab>
    <Tab label="Tab Two">Tab Two Contents</Tab>
  </Tabs>
)

export let anonymousValues = () => (
  <Tabs defaultValue={0}>
    <Tab label="First Tab">First Tab Contents</Tab>
    <Tab label="Second Tab">Second Tab Contents</Tab>
  </Tabs>
)

export let tabLabelAndTabContent = () => (
  <Tabs>
    <TabLabel value="results">Results</TabLabel>
    <TabContent value="results">Results Tables</TabContent>
    <Tab value="analytics" label="Analytics">
      Charts and Stuff
    </Tab>
  </Tabs>
)
tabLabelAndTabContent.story = { name: 'TabLabel and TabContent' }

export let tabRenderFunction = () => (
  <Tabs>
    <Tab label="Analytics">Charts and Stuff</Tab>
    <Tab label="Analytics2" value="tab 2">
      {tab => `Current tab is ${tab}`}
    </Tab>
  </Tabs>
)

export let uncontrolledWithDefaultValue = () => (
  <Tabs defaultValue="analytics">
    <Tab value="results" label="Results">
      Results Tables
    </Tab>
    <Tab value="analytics" label="Analytics">
      Charts and Stuff
    </Tab>
  </Tabs>
)
uncontrolledWithDefaultValue.story = { name: 'Uncontrolled with defaultValue' }

export let controlled = () => (
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
)

export let customTabListAndTabPanel = () => (
  <Tabs TabsList={ButtonRadio} TabPanel={React.Fragment}>
    <Tab value="results" label="Results">
      Results Tables
    </Tab>
    <Tab value="analytics" label="Analytics">
      Charts and Stuff
    </Tab>
  </Tabs>
)
customTabListAndTabPanel.story = { name: 'Custom TabList and TabPanel' }
