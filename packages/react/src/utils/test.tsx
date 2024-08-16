import React from 'react'

import { ChakraProvider } from '@chakra-ui/react'
import Fonts from '../greyVest/Fonts.js'
import Style from '../greyVest/Style.js'
import { base, greyVest } from '../themes/index.js'
import { ThemeProvider } from '../utils/theme.js'

import { render, RenderOptions } from '@testing-library/react'

const Providers = ({ children }: { children: React.ReactNode }) => {
  return (
    <ChakraProvider>
      <ThemeProvider theme={{ ...base, ...greyVest }}>
        <Fonts />
        <Style />
        {children}
      </ThemeProvider>
    </ChakraProvider>
  )
}

interface RenderWithProviders {
  children: React.ReactElement
  options: RenderOptions
}

export const renderWithProviders = (
  children: React.ReactElement,
  options?: RenderOptions
) => render(children, { wrapper: Providers, ...options })
