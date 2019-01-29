import React from 'react'
import { observer } from 'mobx-react'
import { Flex } from '../layout/Flex'
import { exampleTypes } from 'contexture-client'
import injectTreeNode from '../utils/injectTreeNode'
import DatePicker from 'react-date-picker/dist/entry.nostyle'
import RadioList from '../layout/RadioList'
import F from 'futil-js'
import _ from 'lodash/fp'

let html5DateInput = x => <input type="date" {...x} />

let DatePickerDefaultStyle = () => (
  <style>
    {`
    .react-calendar {
      width: 350px;
      max-width: 100%;
      background: white;
      border: 1px solid #a0a096;
      font-family: Arial, Helvetica, sans-serif;
      line-height: 1.125em;
    }
    .react-calendar,
    .react-calendar *,
    .react-calendar *:before,
    .react-calendar *:after {
      -moz-box-sizing: border-box;
      -webkit-box-sizing: border-box;
      box-sizing: border-box;
    }
    .react-calendar button {
      margin: 0;
      border: 0;
      outline: none;
    }
    .react-calendar button:enabled:hover {
      cursor: pointer;
    }
    .react-calendar__navigation {
      height: 44px;
      margin-bottom: 1em;
    }
    .react-calendar__navigation button {
      min-width: 44px;
      background: none;
    }
    .react-calendar__navigation button:enabled:hover,
    .react-calendar__navigation button:enabled:focus {
      background-color: #e6e6e6;
    }
    .react-calendar__navigation button[disabled] {
      background-color: #f0f0f0;
    }
    .react-calendar__month-view__weekdays {
      text-align: center;
      text-transform: uppercase;
      font-weight: bold;
      font-size: 0.75em;
    }
    .react-calendar__month-view__weekdays__weekday {
      padding: 0.5em;
    }
    .react-calendar__month-view__weekNumbers {
      font-weight: bold;
    }
    .react-calendar__month-view__weekNumbers .react-calendar__tile {
      display: flex;
      align-items: center;
      justify-content: center;
      font-size: 0.75em;
      padding: calc(0.75em / 0.75) calc(0.5em / 0.75);
    }
    .react-calendar__month-view__days__day--weekend {
      color: #0076de;
    }
    .react-calendar__month-view__days__day--neighboringMonth {
      color: #969696;
    }
    .react-calendar__year-view .react-calendar__tile,
    .react-calendar__decade-view .react-calendar__tile,
    .react-calendar__century-view .react-calendar__tile {
      padding: 2em 0.5em;
    }
    .react-calendar__tile {
      max-width: 100%;
      text-align: center;
      padding: 0.75em 0.5em;
      background: none;
    }
    .react-calendar__tile:disabled {
      background-color: #f0f0f0;
    }
    .react-calendar__tile:enabled:hover,
    .react-calendar__tile:enabled:focus {
      background-color: #e6e6e6;
    }
    .react-calendar__tile--hasActive {
      background: #76baff;
    }
    .react-calendar__tile--hasActive:enabled:hover,
    .react-calendar__tile--hasActive:enabled:focus {
      background: #a9d4ff;
    }
    .react-calendar__tile--active {
      background: #006edc;
      color: white;
    }
    .react-calendar__tile--active:enabled:hover,
    .react-calendar__tile--active:enabled:focus {
      background: #1087ff;
    }
    .react-calendar--selectRange .react-calendar__tile--hover {
      background-color: #e6e6e6;
    }
    .react-date-picker {
      display: inline-flex;
      position: relative;
    }
    .react-date-picker,
    .react-date-picker *,
    .react-date-picker *:before,
    .react-date-picker *:after {
      -moz-box-sizing: border-box;
      -webkit-box-sizing: border-box;
      box-sizing: border-box;
      background-color: white;
    }
    .react-date-picker--disabled {
      background-color: #f0f0f0;
      color: #6d6d6d;
    }
    .react-date-picker__wrapper {
      display: flex;
      border: thin solid gray;
    }
    .react-date-picker__inputGroup {
      min-width: calc((4px * 3) +  0.54em * 8  +  0.217em * 2);
      flex-grow: 1;
      display: flex;
      padding: 0 2px;
      align-items: baseline;
      box-sizing: content-box;
    }
    .react-date-picker__inputGroup__divider {
      padding: 1px 0;
    }
    .react-date-picker__inputGroup__input {
      min-width: 0.54em;
      height: 100%;
      position: relative;
      padding: 0 1px;
      border: 0;
      background: none;
      font: inherit;
      box-sizing: content-box;
      -moz-appearance: textfield;
    }
    .react-date-picker__inputGroup__input::-webkit-outer-spin-button,
    .react-date-picker__inputGroup__input::-webkit-inner-spin-button {
      -webkit-appearance: none;
      margin: 0;
    }
    .react-date-picker__inputGroup__input:invalid {
      background: rgba(255, 0, 0, 0.1);
    }
    .react-date-picker__inputGroup__input--hasLeadingZero {
      margin-left: -0.54em;
      padding-left: calc(1px +  0.54em);
    }
    .react-date-picker__button {
      border: 0;
      background: transparent;
      padding: 4px 6px;
    }
    .react-date-picker__button:enabled {
      cursor: pointer;
    }
    .react-date-picker__button:enabled:hover svg g,
    .react-date-picker__button:enabled:focus svg g {
      stroke: #0078d7;
    }
    .react-date-picker__button:disabled svg g {
      stroke: #6d6d6d;
    }
    .react-date-picker__button svg {
      display: inherit;
    }
    .react-date-picker__calendar {
      width: 350px;
      max-width: 100vw;
      position: absolute;
      top: 100%;
      left: 0;
      z-index: 1;
    }
    .react-date-picker__calendar--closed {
      display: none;
    }
    .react-date-picker__calendar--above-label {
      bottom: 100%;
      top: auto;
    }
    .react-date-picker__calendar .react-calendar {
      border-width: thin;
    }`}
  </style>
)

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

let DateComponent = injectTreeNode(
  observer(
    ({
      tree,
      node,
      CustomPicker,
      useJSPicker = true,
      excludeRollingRanges = [],
    }) => {
      let Picker = CustomPicker || (useJSPicker ? DatePicker : html5DateInput)

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
            value={tree.getNode(node.path).useDateMath ? 'rolling' : 'exact'}
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
          {!tree.getNode(node.path).useDateMath && (
            <Flex
              style={{ justifyContent: 'space-between', alignItems: 'center' }}
            >
              <Picker
                value={node.from ? new Date(node.from) : null}
                onChange={date => tree.mutate(node.path, { from: date })}
                calendarType="US"
              />
              <div>-</div>
              <Picker
                value={node.to ? new Date(node.to) : null}
                onChange={date => tree.mutate(node.path, { to: date })}
                calendarType="US"
              />
              {Picker === DatePicker && <DatePickerDefaultStyle />}
            </Flex>
          )}
          {tree.getNode(node.path).useDateMath && (
            <select onChange={e => handleRollingSelection(e.target.value)}>
              {F.mapIndexed(
                (opt, idx) => (
                  <option key={_.kebabCase(opt.label)} value={idx}>
                    {opt.label}
                  </option>
                ),
                rollingOpts
              )}
            </select>
          )}
        </div>
      )
    }
  ),
  exampleTypes.date
)
DateComponent.displayName = 'Date'

export default DateComponent
