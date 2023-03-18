import React from 'react'
import ThemeContext from './context.js'

export let useTheme = () => React.useContext(ThemeContext)

export let ThemeConsumer = ({ children, theme }) =>
  children({ ...useTheme(), ...theme })

export let withTheme =
  (Component) =>
  ({ theme, ...props }) =>
    <Component theme={{ ...useTheme(), ...theme }} {...props} />
