import React from 'react'
import _ from 'lodash/fp'
import { observer } from 'mobx-react'

let RadioList = ({ options, value, onChange, ...props }) => (
  <div {...props}>
    {_.map(
      option => (
        <label key={option.value} style={{ cursor: 'pointer', marginRight: 25 }}>
          <input
            type="radio"
            style={{
              marginRight: 10,
              display: 'inline-block',
              width: 'auto',
              height: 'auto',
            }}
            onChange={e => {
              onChange(e.target.value)
            }}
            value={option.value}
            checked={value === option.value}
          />
          {option.label}
        </label>
      ),
      options
    )}
  </div>
)
export default observer(RadioList)