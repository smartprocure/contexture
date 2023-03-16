import React from 'react'
import { action } from '@storybook/addon-actions'
import { observable } from '../utils/mobx.js'
import { Observer } from 'mobx-react'
import { Tabs, Tab, TabLabel, TabContent } from './Tabs.js'
import { ButtonRadio, Button } from './index.js'

let state = observable({ tab: 'results' })

export default {
  component: Tabs,
}

export const BaseUsage = () => (
  <Tabs>
    <Tab label="Tab One">Tab One Contents</Tab>
    <Tab label="Tab Two">Tab Two Contents</Tab>
  </Tabs>
)

export const AnonymousValues = () => (
  <Tabs defaultValue={0}>
    <Tab label="First Tab">First Tab Contents</Tab>
    <Tab label="Second Tab">Second Tab Contents</Tab>
  </Tabs>
)

export const TabLabelAndTabContent = () => (
  <Tabs>
    <TabLabel value="results">Results</TabLabel>
    <TabContent value="results">Results Tables</TabContent>
    <Tab value="analytics" label="Analytics">
      Charts and Stuff
    </Tab>
  </Tabs>
)

export const TabRenderFunction = () => (
  <Tabs>
    <Tab label="Analytics">Charts and Stuff</Tab>
    <Tab label="Analytics2" value="tab 2">
      {(tab) => `Current tab is ${tab}`}
    </Tab>
  </Tabs>
)

export const UncontrolledWithDefaultValue = () => (
  <Tabs defaultValue="analytics">
    <Tab value="results" label="Results">
      Results Tables
    </Tab>
    <Tab value="analytics" label="Analytics">
      Charts and Stuff
    </Tab>
  </Tabs>
)

export const Controlled = () => (
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

export const CustomTabListAndTabPanel = () => (
  <Tabs TabsList={ButtonRadio} TabPanel={React.Fragment}>
    <Tab value="results" label="Results">
      Results Tables
    </Tab>
    <Tab value="analytics" label="Analytics">
      Charts and Stuff
    </Tab>
  </Tabs>
)
