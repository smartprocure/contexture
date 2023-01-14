import React from 'react'
import F from 'futil'
import _ from 'lodash/fp.js'
import greyVest from '../themes/greyVest/index.js'
import blueberry from '../themes/blueberry/index.js'
import base from '../themes/base/index.js'
import material from '../themes/material/index.js'
import { ThemeProvider, ThemeConsumer } from '../utils/theme.js'
import { Flex } from '../greyVest/index.js'

let themes = { base, blueberry, greyVest, material }

export let ThemeSwitcher = ({ defaultTheme = 'base', children }) => {
  let theme = React.useState(defaultTheme)
  return (
    <ThemeProvider theme={themes[F.view(theme)]}>
      <ThemeConsumer>
        {({ Box, Select }) => (
          <Box>
            <Flex alignItems="center">
              <p
                className="filter-field-label"
                style={{ margin: 0, marginRight: 8 }}
              >
                Current theme:
              </p>
              <Select
                options={F.autoLabelOptions(_.keys(themes))}
                {...F.domLens.value(theme)}
                placeholder={false}
                style={{ width: 'auto', minWidth: 200 }}
              />
            </Flex>
          </Box>
        )}
      </ThemeConsumer>
      {children}
    </ThemeProvider>
  )
}

export default (defaultTheme) => (Story) =>
  (
    <ThemeSwitcher defaultTheme={defaultTheme}>
      <Story />
    </ThemeSwitcher>
  )
