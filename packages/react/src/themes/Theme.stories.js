import React from 'react'
import F from 'futil'
import { ThemeProvider, ThemeConsumer, withTheme } from '../utils/theme.js'
import { wrapDisplayName } from '../utils/react.js'

export default {
  title: 'Examples',
}

let withStyle = (style, Component) =>
  wrapDisplayName(
    'withStyle',
    Component
  )((props) => <Component style={style} {...props} />)

let VanillaButton = withStyle(
  {
    backgroundColor: 'cornsilk',
    border: '2px solid tan',
    color: 'rosybrown',
  },
  'button'
)

let StrawberryButton = withStyle(
  {
    backgroundColor: 'lightcoral',
    border: '2px solid limegreen',
    color: 'greenyellow',
  },
  'button'
)

let PearButton = withStyle(
  {
    border: '2px solid olive',
    color: 'darkolivegreen',
    backgroundColor: 'yellowgreen',
  },
  'button'
)

let GrapeButton = withStyle(
  {
    border: '2px solid blueviolet',
    color: 'chartreuse',
    backgroundColor: 'mediumorchid',
  },
  'button'
)

let ThemedButton = withTheme(({ theme, children }) => (
  <theme.Button>{children}</theme.Button>
))

let ButtonGroup = ({ theme, buttons = [] }) =>
  F.mapIndexed((button, i) => <theme.Button key={i}>{button}</theme.Button>)(
    buttons
  )

let ThemedButtonGroup = withTheme(ButtonGroup)

export const GlobalDefaults = () => (
  <>
    <ThemedButton>
      Default button from <code>withTheme</code>
    </ThemedButton>
    <ThemeConsumer>
      {(theme) => (
        <theme.Button>
          Default button from <code>ThemeConsumer</code>
        </theme.Button>
      )}
    </ThemeConsumer>
    <ThemeProvider theme={{ UnusedComponent: 'div' }}>
      <ThemedButton>Global defaults should work...</ThemedButton>
      <ThemeConsumer>
        {(theme) => (
          <theme.Button>...with or without ThemeProvider</theme.Button>
        )}
      </ThemeConsumer>
    </ThemeProvider>
  </>
)

export const ComponentLevelDefaults = () => {
  let DefaultVanillaButton = withTheme(
    ({ theme: { Button = VanillaButton }, children }) => (
      <Button>{children}</Button>
    )
  )
  let DefaultVanillaFoo = withTheme(
    ({ theme: { Foo = VanillaButton }, children }) => <Foo>{children}</Foo>
  )
  return (
    <ThemeProvider>
      <DefaultVanillaButton>
        The global default for Button supercedes the component-level default
      </DefaultVanillaButton>
      <DefaultVanillaFoo>
        Foo has no global default, so it uses the component-level default
      </DefaultVanillaFoo>
    </ThemeProvider>
  )
}

export const ThemeConsumerWithoutName = () => (
  <ThemeProvider
    theme={{
      Button: VanillaButton,
      ButtonGroup,
      'ButtonGroup.Button': PearButton,
    }}
  >
    <ThemeConsumer>
      {({ Button }) => <Button>Top-level buttons are Vanilla</Button>}
    </ThemeConsumer>
  </ThemeProvider>
)

export const ThemeConsumerWithName = () => (
  <ThemeProvider
    theme={{
      Button: VanillaButton,
      ButtonGroup,
      'ButtonGroup.Button': GrapeButton,
    }}
  >
    <ThemeConsumer name="ButtonGroup">
      {({ Button }) => <Button>ButtonGroup buttons are Grape!</Button>}
    </ThemeConsumer>
  </ThemeProvider>
)

let IconButton = ({ theme: { Button, Icon }, children }) => (
  <Button>
    <Icon />
    {children}
  </Button>
)

let ThemedIconButton = withTheme(IconButton)

export const MultiLevelNestingWithThemeContext = () => (
  <ThemeProvider
    theme={{
      Icon: () => <span>🍨</span>,
      Button: VanillaButton,
      'ButtonGroup.Button': ThemedIconButton,
      'ButtonGroup.IconButton.Icon': () => <span>🍓</span>,
      'ButtonGroup.IconButton.Button': StrawberryButton,
    }}
  >
    <ThemedIconButton>Top-level Icon & Button theme</ThemedIconButton>
    <ThemedButtonGroup buttons={['ButtonGroup Icon & Button theme']} />
  </ThemeProvider>
)

export const MultiLevelNestingWithThemeProps = () => (
  <ThemeProvider
    theme={{
      Icon: () => <span>🍨</span>,
      Button: VanillaButton,
    }}
  >
    <ThemedIconButton>Top-level Icon & Button theme</ThemedIconButton>
    <ThemedButtonGroup
      theme={{
        Button: ThemedIconButton,
        'IconButton.Icon': () => <span>🍇</span>,
        'IconButton.Button': GrapeButton,
      }}
      buttons={['ButtonGroup Icon & Button theme']}
    />
  </ThemeProvider>
)
