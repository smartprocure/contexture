import React from 'react'

let Table = x => (
  <div clasName="gv-table-parent" style={{ overflow: 'auto' }}>
    <table className="gv-table" {...x} />
  </div>
)
export default Table
