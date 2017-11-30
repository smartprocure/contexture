import React from 'react'

export let Button = ({ children, onClick }) => (
  <button className="Button" style={{ color: 'red' }} onClick={onClick}>
    {children}
  </button>
)
