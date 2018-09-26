import React from 'react'
import _ from 'lodash/fp'
import { observer } from 'mobx-react'
import { Flex } from './Flex'

let YAxis = ({ height, borderColor, min, max }) => (
  <div>
    <div
      key="legend"
      style={{
        height,
        margin: '0 5px',
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'space-between',
        borderRight: `solid 1px ${borderColor()}`,
        padding: '5px',
      }}
    >
      <div
        style={{
          borderTop: `solid 1px ${borderColor()}`,
          textAlign: 'right',
        }}
      >
        {max}
      </div>
      <div
        style={{
          borderBottom: `solid 1px ${borderColor()}`,
          textAlign: 'right',
        }}
      >
        {min}
      </div>
    </div>
    <div style={{ padding: '5px' }}>&nbsp;</div>
  </div>
)
YAxis.displayName = 'YAxis'

let BarChart = observer(
  ({
    data,
    valueField,
    categoryField,
    background = () => '#ccc',
    height = 100,
    format = _.identity,
    gutter = 5,
    yAxis = false,
  }) => {
    let values = _.map(valueField, data)
    let max = _.max(values)
    let min = _.min(values)
    return (
      <Flex style={{ alignItems: 'flex-end', justifyContent: 'center' }}>
        {yAxis &&
          !!data.length && (
            <YAxis {...{ min, max, height, borderColor: background }} />
          )}
        {_.map(
          x => (
            <div key={x.key}>
              <div
                style={{
                  height: (x[valueField] / max) * height,
                  background: background(x, max),
                  margin: `0 ${gutter}px`,
                }}
                title={x[valueField]}
              >
                &nbsp;
              </div>
              <div style={{ padding: '5px' }}>{format(x[categoryField])}</div>
            </div>
          ),
          data
        )}
      </Flex>
    )
  }
)
BarChart.displayName = 'BarChart'

export default BarChart
