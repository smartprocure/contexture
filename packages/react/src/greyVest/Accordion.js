import React from 'react'
import Flex from './Flex'
import Icon from './Icon'


let Accordion = ({ isOpen, className, style, Label, children, onClick }) =>
  <div
    className={`gv-accordion ${isOpen ? 'expanded' : ''} ${className}`}
    style={style}
  >
    <Flex className="gv-accordion-header" alignItems="center" onClick={onClick}>
      <div style={{ flexGrow: 1 }}>
        {Label}
      </div>
      <div
        className={`gv-accordion-icon ${isOpen ? 'expanded' : ''}`}
      >
        <Icon icon="FilterListExpand" />
      </div>
    </Flex>
    <div className={`gv-accordion-body ${isOpen ? 'expanded' : ''}`}>
      {children}
    </div>
  </div>


export default Accordion