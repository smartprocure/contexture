import React from 'react'
import { CssBaseline } from '@material-ui/core'
import MomentUtils from '@date-io/moment'
import { MuiPickersUtilsProvider } from '@material-ui/pickers'

let Root = ({ children }) => (
  <>
    {/* fonts */}
    <link
      rel="stylesheet"
      href="https://fonts.googleapis.com/css?family=Roboto:300,400,500,700&display=swap"
    />
    <link
      rel="stylesheet"
      href="https://fonts.googleapis.com/icon?family=Material+Icons"
    />

    {/* styles */}
    <style>{`
      .material-table th span {
        display: flex;
        flex-wrap: nowrap;
        align-items: center;
        justify-content: center;
      }
    `}</style>
    <CssBaseline />

    {/* all this just for a silly date picker */}
    <MuiPickersUtilsProvider utils={MomentUtils}>
      {children}
    </MuiPickersUtilsProvider>
  </>
)

export default Root
