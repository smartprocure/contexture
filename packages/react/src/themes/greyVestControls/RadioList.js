import React from 'react'
import { observer } from 'mobx-react'

let RadioList =  ({ options, value, onChange, className = '', ...props }) => (
  <div className={`gv-radio-list ${className}`} {...props}>
    {_.map(
      option => (
        <label className="gv-radio-option" key={option.value}>
          <input
            type="radio"
            style={{ display: 'none' }}
            onChange={e => {
              onChange(e.target.value)
            }}
            value={option.value}
            checked={value === option.value}
          />
          <div className="gv-radio">
            <div
              className={`gv-radio-dot ${
                value === option.value ? 'active' : ''
              }`}
            />
          </div>
          <div className="gv-radio-label">{option.label}</div>
        </label>
      ),
      options
    )}
  </div>
)
export default observer(RadioList)