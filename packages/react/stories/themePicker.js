import React from 'react'
import F from 'futil-js'
import greyVest from '../src/themes/greyVest'
import blueberry from '../src/themes/blueberry'
import base from '../src/themes/base'
import material from '../src/themes/material'
import { ThemeProvider, ThemeConsumer } from '../src/utils/theme'
import { Flex } from '../src/greyVest'
import { useLens } from '../src/utils/react'

let options = [
  { label: 'Unthemed', value: 'base' },
  { label: 'Grey Vest', value: 'greyVest' },
  { label: 'Blueberry', value: 'blueberry' },
  { label: 'Material', value: 'material' },
]
let themes = { greyVest, blueberry, base, material }

let ThemeSwitcher = ({ defaultTheme = 'base', children }) => {
  let theme = useLens(defaultTheme)
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
                options={options}
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

export default defaultTheme => Story => (
  <ThemeSwitcher defaultTheme={defaultTheme}>
    <Story />
  </ThemeSwitcher>
)
