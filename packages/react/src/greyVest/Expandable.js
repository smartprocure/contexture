import React from 'react'
import Flex from './Flex'
import { withTheme } from '../utils/theme'

let Expandable = ({ isOpen, className, style, Label, children, onClick, theme: { Icon } }) => (
  <div
    className={`gv-expandable ${isOpen ? 'expanded' : ''} ${className}`}
    style={style}
  >
    <Flex
      className="gv-expandable-header"
      alignItems="center"
      onClick={onClick}
    >
      <div style={{ flexGrow: 1 }}>{Label}</div>
      <div className={`gv-expandable-icon ${isOpen ? 'expanded' : ''}`}>
        <Icon icon="FilterListExpand" />
      </div>
    </Flex>
    <div className={`gv-expandable-body ${isOpen ? 'expanded' : ''}`}>
      {children}
    </div>
  </div>
)

export default withTheme(Expandable)
