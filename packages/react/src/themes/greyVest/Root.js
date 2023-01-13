import React from 'react'
import { Fonts, Style } from '../../greyVest/index.js'
import ThemeStyle from './Style.js'

let Root = ({ children }) => (
  <>
    <Fonts />
    <Style />
    <ThemeStyle />
    {children}
  </>
)

export default Root
