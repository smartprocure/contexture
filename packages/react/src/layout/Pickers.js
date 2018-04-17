import _ from 'lodash/fp'
import * as F from 'futil-js'
import React from 'react'
import {observer} from 'mobx-react'
import {withStateLens} from '../utils/mobx-react-utils'
import {value} from '../utils/actout'
import TextHighlight from './TextHighlight'

export let FilteredPicker = withStateLens({filter: ''})(
  observer(({options, onChange, filter, Input='input', Item='div', Highlight=TextHighlight}) => (
    <div>
      <Input {...value(filter)} />
      {_.map(
        ({value, label}) => (
          <Item key={value} onClick={() => onChange(value)}>
            <Highlight text={label} pattern={F.view(filter)} />
          </Item>
        ),
        _.filter(x => F.matchAllWords(F.view(filter))(x.label), options)
      )}
    </div>
  ))
)

export let ModalPicker = withStateLens({isOpen: false})(
  observer(({options, isOpen, Button = 'button', onChange, label, Picker, Modal}) => (
    <div>
      <Modal isOpen={isOpen}>
        <Picker
          options={options}
          onChange={x => {
            onChange(x)
            F.off(isOpen)()
          }}
        />
      </Modal>
      <Button onClick={F.on(isOpen)}>{label}</Button>
    </div>
  ))
)
