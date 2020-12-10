import React from 'react'

let Table = x => (
  <div className="gv-table-parent">
    <table
      {...{
        ...x,
        className: x.className ? `gv-table ${x.className}` : 'gv-table',
      }}
    />
  </div>
)
export default Table
