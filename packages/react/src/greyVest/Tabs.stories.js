import React from 'react'
import { action } from '@storybook/addon-actions'
import { observable } from '../utils/mobx.js'
import { Observer } from 'mobx-react'
import { Tabs as Component, Tab, TabLabel, TabContent } from './Tabs.js'
import { ButtonRadio, Button } from './index.js'

let state = observable({ tab: 'results' })

export default {
  component: Component,
}

export const BaseUsage = () => (
  <Component>
    <Tab label="Tab One">Tab One Contents</Tab>
    <Tab label="Tab Two">Tab Two Contents</Tab>
  </Component>
)

export const AnonymousValues = () => (
  <Component defaultValue={0}>
    <Tab label="First Tab">First Tab Contents</Tab>
    <Tab label="Second Tab">Second Tab Contents</Tab>
  </Component>
)

export const TabLabelAndTabContent = () => (
  <Component>
    <TabLabel value="results">Results</TabLabel>
    <TabContent value="results">Results Tables</TabContent>
    <Tab value="analytics" label="Analytics">
      Charts and Stuff
    </Tab>
  </Component>
)

export const TabRenderFunction = () => (
  <Component>
    <Tab label="Analytics">Charts and Stuff</Tab>
    <Tab label="Analytics2" value="tab 2">
      {(tab) => `Current tab is ${tab}`}
    </Tab>
  </Component>
)

export const UncontrolledWithDefaultValue = () => (
  <Component defaultValue="analytics">
    <Tab value="results" label="Results">
      Results Tables
    </Tab>
    <Tab value="analytics" label="Analytics">
      Charts and Stuff
    </Tab>
  </Component>
)

export const Controlled = () => (
  <Observer>
    {() => (
      <>
        <Button onClick={() => (state.tab = 'analytics')}>
          Change from {state.tab} to analytics
        </Button>
        <Component
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
        </Component>
      </>
    )}
  </Observer>
)

export const CustomTabListAndTabPanel = () => (
  <Component TabsList={ButtonRadio} TabPanel={React.Fragment}>
    <Tab value="results" label="Results">
      Results Tables
    </Tab>
    <Tab value="analytics" label="Analytics">
      Charts and Stuff
    </Tab>
  </Component>
)
