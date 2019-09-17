import React from 'react'
import { Fonts, Style } from '../../greyVest'
import ThemeStyle from './Style'

let Root = ({ children }) => (
  <>
    <Fonts />
    <Style />
    <ThemeStyle />
    {children}
  </>
)

export default Root
