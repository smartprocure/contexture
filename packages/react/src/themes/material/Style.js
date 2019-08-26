import React from 'react'
import { CssBaseline } from '@material-ui/core'

let Style = () => (
  <>
    <style>{`
      th span {
        display: flex;
        flex-wrap: nowrap;
        align-items: center;
        justify-content: center;
      }
    `}</style>
    <CssBaseline />
  </>
)

export default Style
