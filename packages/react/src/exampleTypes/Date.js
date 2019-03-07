import React from 'react'
import { observer } from 'mobx-react'
import { Flex } from '../layout/Flex'
import { exampleTypes } from 'contexture-client'
import injectTreeNode from '../utils/injectTreeNode'
import F from 'futil-js'
import _ from 'lodash/fp'

let allRollingOpts = [
  { type: 'all', label: 'All Dates', value: { from: '', to: '' } },
  { type: 'past', label: 'Last 3 Days', value: { from: 'now-3d', to: 'now' } },
  { type: 'past', label: 'Last 7 Days', value: { from: 'now-7d', to: 'now' } },
  {
    type: 'past',
    label: 'Last 30 Days',
    value: { from: 'now-30d', to: 'now' },
  },
  {
    type: 'past',
    label: 'Last 90 Days',
    value: { from: 'now-90d', to: 'now' },
  },
  {
    type: 'past',
    label: 'Last 180 Days',
    value: { from: 'now-180d', to: 'now' },
  },
  {
    type: 'past',
    label: 'Last 12 Months',
    value: { from: 'now/d-12M', to: 'now' },
  },
  {
    type: 'past',
    label: 'Last 24 Months',
    value: { from: 'now/d-24M', to: 'now' },
  },
  {
    type: 'past',
    label: 'Last 36 Months',
    value: { from: 'now/d-36M', to: 'now' },
  },
  {
    type: 'past',
    label: 'Last 48 Months',
    value: { from: 'now/d-48M', to: 'now' },
  },
  {
    type: 'past',
    label: 'Last 60 Months',
    value: { from: 'now/d-60M', to: 'now' },
  },
  {
    type: 'past',
    label: 'Last Calendar Month',
    value: { from: 'now-1M/M', to: 'now/M-1d' },
  },
  {
    type: 'past',
    label: 'Last Calendar Quarter',
    value: { from: 'lastQuarter', to: 'lastQuarter' },
  },
  {
    type: 'past',
    label: 'Last Calendar Year',
    value: { from: 'now-1y/y', to: 'now/y-1d' },
  },
  {
    type: 'present',
    label: 'This Calendar Month',
    value: { from: 'now/M', to: 'now' },
  },
  {
    type: 'present',
    label: 'This Calendar Quarter',
    value: { from: 'thisQuarter', to: 'thisQuarter' },
  },
  {
    type: 'present',
    label: 'This Calendar Year',
    value: { from: 'now/y', to: 'now' },
  },
  {
    type: 'future',
    label: 'Next Calendar Month',
    value: { from: 'now+1M/M', to: 'now+2M/M' },
  },
  {
    type: 'future',
    label: 'Next Calendar Quarter',
    value: { from: 'nextQuarter', to: 'nextQuarter' },
  },
  {
    type: 'future',
    label: 'Next Calendar Year',
    value: { from: 'now+1y/y', to: 'now+2y/y' },
  },
  {
    type: 'future',
    label: 'Next 30 Days',
    value: { from: 'now/d', to: 'now/d+30d' },
  },
  {
    type: 'future',
    label: 'Next 12 Months',
    value: { from: 'now/d', to: 'now/d+12M' },
  },
  {
    type: 'future',
    label: 'Next 24 Months',
    value: { from: 'now/d', to: 'now/d+24M' },
  },
  {
    type: 'future',
    label: 'Next 36 Months',
    value: { from: 'now/d', to: 'now/d+36M' },
  },
]

let rollingOptIsSelected = (node, opt) =>
  node.from === opt.value.from && node.to === opt.value.to

let DateComponent = injectTreeNode(
  observer(
    ({
      tree,
      node,
      DateInput,
      RadioList,
      Select,
      excludeRollingRanges = [],
    }) => {
      let rollingOpts = _.reject(
        opt => _.includes(opt.type, excludeRollingRanges),
        allRollingOpts
      )

      let handleRollingSelection = idx => {
        let range = rollingOpts[idx].value
        tree.mutate(node.path, range)
      }

      return (
        <div>
          <RadioList
            options={F.autoLabelOptions(['exact', 'rolling'])}
            value={node.useDateMath ? 'rolling' : 'exact'}
            style={{ marginBottom: 10 }}
            onChange={mode => {
              tree.mutate(
                node.path,
                mode === 'rolling'
                  ? {
                      useDateMath: true,
                      from: '',
                      to: '',
                    }
                  : {
                      useDateMath: false,
                      from: null,
                      to: null,
                    }
              )
            }}
          />
          {!node.useDateMath && (
            <Flex
              style={{ justifyContent: 'space-between', alignItems: 'center' }}
            >
              <DateInput
                value={node.from}
                onChange={date => tree.mutate(node.path, { from: date })}
              />
              <div>-</div>
              <DateInput
                value={node.to}
                onChange={date => tree.mutate(node.path, { to: date })}
              />
            </Flex>
          )}
          {node.useDateMath && (
            <Select
              value={`${node.from}-${node.to}`}
              onChange={e => handleRollingSelection(e.target.value)}
              options={F.map(
                opt => ({
                  label: opt.label,
                  value: `${opt.value.from}-${opt.value.to}`,
                  selected: rollingOptIsSelected(node, opt),
                }),
                rollingOpts
              )}
            />
          )}
        </div>
      )
    }
  ),
  exampleTypes.date
)
DateComponent.displayName = 'Date'

export default DateComponent
