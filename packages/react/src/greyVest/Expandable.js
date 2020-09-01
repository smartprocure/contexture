import React from 'react'
import Flex from './Flex'
import Icon from './Icon'

let Expandable = ({ isOpen, className, style, Label, children, onClick }) => (
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

export default Expandable
