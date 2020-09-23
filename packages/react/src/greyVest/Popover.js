import React from 'react'
import _ from 'lodash/fp'
import F from 'futil'
import Popup from 'reactjs-popup'
import { openBinding } from './utils'
import { expandProp } from '../utils/react'


let Popover = ({
  // eslint-disable-next-line no-unused-vars
  open, // lens
  isOpen,
  style,
  trigger,
  arrow,
  position,
  children,
  closeOnPopoverClick = true,
  ...props
}) => (
  <Popup
    open={open && isOpen} // external state if lens is passed
    trigger={open => <span>{F.callOrReturn(trigger, open)}</span>}
    closeOnDocumentClick
    arrow={arrow}
    position={position || "bottom left"}
    contentStyle={{
      borderRadius: 3,
      boxShadow: '0 2px 10px 0 rgba(39, 44, 65, 0.1)',
      border: '1px solid rgb(235, 235, 235)',
      ...style,
    }}
    {...props}
  >
    {close =>
      _.isFunction(children) ? (
        children(close)
      ) : (
        <div onClick={closeOnPopoverClick ? close : null}>
          {children}
        </div>
      )
    }
  </Popup>
)

export default expandProp('open', openBinding)(Popover)
