import React from 'react'

let Table = x => (
  <div style={{ overflow: 'auto' }}>
    <table className="gv-table" {...x} />
  </div>
)
export default Table