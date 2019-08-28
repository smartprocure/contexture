import React from 'react'
import _ from 'lodash/fp'
import { observer } from 'mobx-react'

let RadioList = ({
  options,
  value,
  onChange,
  className = '',
  native = false,
  ...props
}) => (
  <div className={`gv-radio-list ${className}`} {...props}>
    {_.map(
      option => (
        <label
          className="gv-radio-option"
          key={option.value}
          style={{ cursor: 'pointer', marginRight: 25 }}
        >
          <input
            type="radio"
            style={{
              marginRight: 10,
              display: native ? 'inline-block' : 'none',
              width: 'auto',
              height: 'auto',
            }}
            onChange={e => {
              onChange(e.target.value)
            }}
            value={option.value}
            checked={value === option.value}
          />
          {native ? (
            option.label
          ) : (
            <>
              <div className="gv-radio">
                <div
                  className={`gv-radio-dot ${
                    value === option.value ? 'active' : ''
                  }`}
                />
              </div>
              <div className="gv-radio-label">{option.label}</div>
            </>
          )}
        </label>
      ),
      options
    )}
  </div>
)
export default observer(RadioList)
