import React, {useState} from 'react'
import _ from 'lodash/fp'
import F from 'futil-js'
import TabList from './TabList'
import Box from './Box'

/* Usage */
/*
<Tabs tabControl={ButtonRadio} value="autoLabeled">
  <Tab value="references" label="References">
    <PO Table />
  </Tab>
  <Tab label="Fancy Label">
  </Tab>
  <TabOption value="option2">
    Option 2's Label
  </TabOption>
  <TabContent value="option2">
    Option 2's Content
  </TabContent>
  <Tab value="functionTab" label="functionTab">
    {currentTab => <div>Function Tab Content</div>}
  </Tab>
</Tabs>
*/

export let TabContent = () => {}
export let TabOption = () => {}
export let Tab = () => {}
export let Tabs = ({
  children,
  onChange = _.noop,
  TabsList = TabList,
  TabPanel = Box,
  defaultValue,
  ...props
}) => {
  let childrenArray = React.Children.toArray(children)
  let options = _.flow(
    _.filter(child => child.type == Tab || child.type == TabOption),
    F.mapIndexed(({ type, props }, i) => ({
      value: props.value || i,
      label: type == Tab ? props.label : props.children
    }))
  )(childrenArray)
  
  let [value, setValue] = useState(defaultValue || options[0].value)
  // Allow controlled state
  if (!_.isNil(props.value) && props.value !== value)
    setValue(props.value)
  let handleChange = (to, from) => {
    onChange(to, from)
    setValue(to)
  }

  let content = _.flow(
    _.filter.convert({ cap: false })(
      ({ type, props }, i) =>
        (type == Tab || type == TabContent) &&
        (value === props.value || value === i)
    ),
    F.mapIndexed(({ props }, i) => (
      <React.Fragment key={i}>
        {F.callOrReturn(props.children, value)}
      </React.Fragment>
    ))
  )(childrenArray)

  return (
    <>
      <TabsList value={value} onChange={handleChange} options={options} />
      <TabPanel>{content}</TabPanel>
    </>
  )
}
