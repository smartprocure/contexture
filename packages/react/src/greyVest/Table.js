import React from 'react'

let Table = ({ className = '', ...props }) => (
  <div className="gv-table-parent">
    <table className={`gv-table ${className}`} {...props} />
  </div>
)
export default Table
