import React from 'react'
import { Flex } from '../greyVest'
import { contexturifyWithoutLoader } from '../utils/hoc'
import F from 'futil'
import _ from 'lodash/fp'
import moment from 'moment'

let allRollingOpts = [
  { type: 'all', range: 'allDates' },
  { type: 'past', range: 'last3Days' },
  { type: 'past', range: 'last7Days' },
  { type: 'past', range: 'last30Days' },
  { type: 'past', range: 'last90Days' },
  { type: 'past', range: 'last180Days' },
  { type: 'past', range: 'last12Months' },
  { type: 'past', range: 'last15Months' },
  { type: 'past', range: 'last18Months' },
  { type: 'past', range: 'last24Months' },
  { type: 'past', range: 'last36Months' },
  { type: 'past', range: 'last48Months' },
  { type: 'past', range: 'last60Months' },
  { type: 'past', range: 'lastCalendarMonth' },
  { type: 'past', range: 'lastCalendarQuarter' },
  { type: 'past', range: 'lastCalendarYear' },
  { type: 'present', range: 'thisCalendarMonth' },
  { type: 'present', range: 'thisCalendarQuarter' },
  { type: 'present', range: 'thisCalendarYear' },
  { type: 'future', range: 'nextCalendarMonth' },
  { type: 'future', range: 'nextCalendarQuarter' },
  { type: 'future', range: 'nextCalendarYear' },
  { type: 'future', range: 'next30Days' },
  { type: 'future', range: 'next60Days' },
  { type: 'future', range: 'next90Days' },
  { type: 'future', range: 'next6Months' },
  { type: 'future', range: 'next12Months' },
  { type: 'future', range: 'next24Months' },
  { type: 'future', range: 'next36Months' },
]

let endOfDay = date =>
  moment(date)
    .endOf('day')
    .toDate()

let DateComponent = ({
  tree,
  node,
  excludeRollingRanges = [],
  theme: { DateInput, RadioList, Select },
}) => {
  let [dateType, setDateType] = React.useState(
    node.range === 'exact' || !node.range ? 'exact' : 'rolling'
  )

  let rollingOpts = _.reject(
    opt => _.includes(opt.type, excludeRollingRanges),
    allRollingOpts
  )

  return (
    <div>
      <RadioList
        options={F.autoLabelOptions(['exact', 'rolling'])}
        value={dateType}
        style={{ marginBottom: 10 }}
        onChange={value => {
          tree.mutate(
            node.path,
            value === 'exact'
              ? { range: 'exact', from: null, to: null }
              : { range: '', from: null, to: null }
          )
          setDateType(value)
        }}
      />
      {dateType === 'exact' && (
        <Flex style={{ justifyContent: 'space-between', alignItems: 'center' }}>
          <DateInput
            value={node.from}
            onChange={date =>
              tree.mutate(node.path, { range: 'exact', from: date })
            }
          />
          <div>-</div>
          <DateInput
            value={node.to}
            onChange={date =>
              tree.mutate(node.path, { range: 'exact', to: endOfDay(date) })
            }
          />
        </Flex>
      )}
      {dateType === 'rolling' && (
        <Select
          value={node.range}
          onChange={e => tree.mutate(node.path, { range: e.target.value })}
          options={F.map(
            ({ range }) => ({
              label: _.startCase(range),
              value: range,
              selected: node.range === range,
            }),
            rollingOpts
          )}
        />
      )}
    </div>
  )
}

export default contexturifyWithoutLoader(DateComponent)
