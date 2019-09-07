import { Radio } from '@material-ui/core'
import React from 'react'
import { observer } from 'mobx-react'
import _ from 'lodash/fp'

let RadioList = ({ options, value, onChange, ...props }) => (
  <div {...props}>
    {_.map(
      option => (
        <label
          key={option.value}
          style={{ cursor: 'pointer', marginRight: 25 }}
        >
          <Radio
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
