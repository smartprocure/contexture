import React from 'react'
import { Flex } from '../layout/Flex'
import { contexturify } from '../utils/hoc'
import F from 'futil-js'
import _ from 'lodash/fp'

let allRollingOpts = [
  { type: 'all', label: 'All Dates', range: { from: '', to: '' } },
  { type: 'past', label: 'Last 3 Days', range: { from: 'now-3d', to: 'now' } },
  { type: 'past', label: 'Last 7 Days', range: { from: 'now-7d', to: 'now' } },
  {
    type: 'past',
    label: 'Last 30 Days',
    range: { from: 'now-30d', to: 'now' },
  },
  {
    type: 'past',
    label: 'Last 90 Days',
    range: { from: 'now-90d', to: 'now' },
  },
  {
    type: 'past',
    label: 'Last 180 Days',
    range: { from: 'now-180d', to: 'now' },
  },
  {
    type: 'past',
    label: 'Last 12 Months',
    range: { from: 'now/d-12M', to: 'now' },
  },
  {
    type: 'past',
    label: 'Last 24 Months',
    range: { from: 'now/d-24M', to: 'now' },
  },
  {
    type: 'past',
    label: 'Last 36 Months',
    range: { from: 'now/d-36M', to: 'now' },
  },
  {
    type: 'past',
    label: 'Last 48 Months',
    range: { from: 'now/d-48M', to: 'now' },
  },
  {
    type: 'past',
    label: 'Last 60 Months',
    range: { from: 'now/d-60M', to: 'now' },
  },
  {
    type: 'past',
    label: 'Last Calendar Month',
    range: { from: 'now-1M/M', to: 'now/M-1d' },
  },
  {
    type: 'past',
    label: 'Last Calendar Quarter',
    range: { from: 'lastQuarter', to: 'lastQuarter' },
  },
  {
    type: 'past',
    label: 'Last Calendar Year',
    range: { from: 'now-1y/y', to: 'now/y-1d' },
  },
  {
    type: 'present',
    label: 'This Calendar Month',
    range: { from: 'now/M', to: 'now' },
  },
  {
    type: 'present',
    label: 'This Calendar Quarter',
    range: { from: 'thisQuarter', to: 'thisQuarter' },
  },
  {
    type: 'present',
    label: 'This Calendar Year',
    range: { from: 'now/y', to: 'now' },
  },
  {
    type: 'future',
    label: 'Next Calendar Month',
    range: { from: 'now+1M/M', to: 'now+2M/M' },
  },
  {
    type: 'future',
    label: 'Next Calendar Quarter',
    range: { from: 'nextQuarter', to: 'nextQuarter' },
  },
  {
    type: 'future',
    label: 'Next Calendar Year',
    range: { from: 'now+1y/y', to: 'now+2y/y' },
  },
  {
    type: 'future',
    label: 'Next 30 Days',
    range: { from: 'now/d', to: 'now/d+30d' },
  },
  {
    type: 'future',
    label: 'Next 12 Months',
    range: { from: 'now/d', to: 'now/d+12M' },
  },
  {
    type: 'future',
    label: 'Next 24 Months',
    range: { from: 'now/d', to: 'now/d+24M' },
  },
  {
    type: 'future',
    label: 'Next 36 Months',
    range: { from: 'now/d', to: 'now/d+36M' },
  },
]

let rollingOptIsSelected = (node, opt) =>
  node.from === opt.range.from && node.to === opt.range.to

let rollingRangeToString = ({ from, to }) => `${from}::${to}`

let rollingRangeFromString = _.flow(
  _.split('::'),
  ([from, to]) => ({
    from,
    to,
  })
)

let DateComponent = contexturify(
  ({ tree, node, DateInput, RadioList, Select, excludeRollingRanges = [] }) => {
    let rollingOpts = _.reject(
      opt => _.includes(opt.type, excludeRollingRanges),
      allRollingOpts
    )

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
            value={rollingRangeToString(node)}
            onChange={e =>
              tree.mutate(node.path, rollingRangeFromString(e.target.value))
            }
            options={F.map(
              opt => ({
                label: opt.label,
                value: rollingRangeToString(opt.range),
                selected: rollingOptIsSelected(node, opt),
              }),
              rollingOpts
            )}
          />
        )}
      </div>
    )
  }
)
DateComponent.displayName = 'Date'

export default DateComponent
