import React from 'react'
import { configure } from 'mobx'
import { base, greyVest } from '../src/themes/index.js'
import Fonts from '../src/greyVest/Fonts.js'
import Style from '../src/greyVest/Style.js'
import { ThemeProvider } from '../src/utils/theme.js'
import { ChakraProvider } from '@chakra-ui/react'

configure({ enforceActions: 'never', useProxies: 'never' })

export const parameters = {
  options: {
    storySort: {
      order: ['Theming', 'Example Types', 'Search Components'],
    },
  },
  chromatic: { disableSnapshot: true },
}

export const decorators = [
  (Story) => (
    <ThemeProvider theme={{ ...base, ...greyVest }}>
      <ChakraProvider>
        <Fonts />
        <Style />
        <Story />
      </ChakraProvider>
    </ThemeProvider>
  ),
]
