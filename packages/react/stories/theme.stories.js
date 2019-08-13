import React from 'react'
import F from 'futil-js'
import { storiesOf } from '@storybook/react'
import { ThemeProvider, ThemeConsumer, withTheme, withNamedTheme } from '../src/utils/theme'

let withStyle = (style, Component) => props => (
  <Component style={style} {...props} />
)

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
  F.mapIndexed((button, i) => <theme.Button key={i}>{button}</theme.Button>)(buttons)

let ThemedButtonGroup = withNamedTheme('ButtonGroup')(ButtonGroup)

storiesOf('Theme API|defaults', module)
  .addWithJSX('Global defaults', () => (
    <>
      <ThemedButton>
        Default button from <code>withTheme</code>
      </ThemedButton>
      <ThemeConsumer>
        {theme => (
          <theme.Button>
            Default button from <code>ThemeConsumer</code>
          </theme.Button>
        )}
      </ThemeConsumer>
      <ThemeProvider theme={{ UnusedComponent: 'div' }}>
        <ThemedButton>Global defaults should work...</ThemedButton>
        <ThemeConsumer>
          {theme => (
            <theme.Button>...with or without ThemeProvider</theme.Button>
          )}
        </ThemeConsumer>
      </ThemeProvider>
    </>
  ))
  .addWithJSX('Component-level defaults', () => {
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
          The global default for "Button" supercedes the component-level default
        </DefaultVanillaButton>
        <DefaultVanillaFoo>
          "Foo" has no global default, so it uses the component-level default
        </DefaultVanillaFoo>
      </ThemeProvider>
    )
  })

storiesOf('Theme API|withTheme', module)
  .addWithJSX('Theme precedence', () => (
    <ThemeProvider
      value={{
        Button: VanillaButton,
        'ButtonGroup.Button': StrawberryButton,
      }}
    >
      <ThemedButton>Top-level buttons are Vanilla</ThemedButton>
      <ThemedButtonGroup
        buttons={['Nested themes override top-level themes']}
      />
      <ThemedButtonGroup
        theme={{ Button: PearButton }}
        buttons={['Theme props override theme context']}
      />
    </ThemeProvider>
  ))
  .addWithJSX('Explicit naming', () => {
    let UnnamedComponent = withTheme(({ theme }) => (
      <>
        <div>I am an anonymous component</div>
        <theme.Button>Top-level buttons are Vanilla</theme.Button>
      </>
    ))
    let ExplicitlyNamedComponent = withNamedTheme('Jerry')(({ theme }) => (
      <>
        <div>
          I am also an anonymous component, but <code>withTheme</code> knows me
          as "Jerry"
        </div>
        <theme.Button>Jerry buttons are Strawberry!</theme.Button>
      </>
    ))
    let ButtonGroupGeorge = withNamedTheme('George')(ButtonGroup)
    return (
      <ThemeProvider
        value={{
          Button: VanillaButton,
          'Jerry.Button': StrawberryButton,
          'George.Button': PearButton,
        }}
      >
        <UnnamedComponent />
        <div style={{ height: 20 }} />
        <ExplicitlyNamedComponent />
        <div style={{ height: 20 }} />
        <div>
          This component is a ButtonGroup, but <code>withTheme</code> knows it
          as "George":
        </div>
        <ButtonGroupGeorge buttons={['George buttons are Pear!']} />
      </ThemeProvider>
    )
  })

storiesOf('Theme API|ThemeConsumer', module)
  .addWithJSX('Without name', () => (
    <ThemeProvider
      value={{
        Button: VanillaButton,
        ButtonGroup,
        'ButtonGroup.Button': PearButton,
      }}
    >
      <ThemeConsumer>
        {({ Button }) => <Button>Top-level buttons are Vanilla</Button>}
      </ThemeConsumer>
    </ThemeProvider>
  ))
  .addWithJSX('With name', () => (
    <ThemeProvider
      value={{
        Button: VanillaButton,
        ButtonGroup,
        'ButtonGroup.Button': GrapeButton,
      }}
    >
      <ThemeConsumer name="ButtonGroup">
        {({ Button }) => <Button>ButtonGroup buttons are Grape!</Button>}
      </ThemeConsumer>
    </ThemeProvider>
  ))

let IconButton = ({ theme: { Button, Icon }, children }) => (
  <Button>
    <Icon />
    {children}
  </Button>
)
let ThemedIconButton = withNamedTheme('IconButton')(IconButton)

storiesOf('Theme API|Multi-level nesting', module)
  .addWithJSX('With theme context', () => (
    <ThemeProvider
      value={{
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
  ))
  .addWithJSX('With theme props', () => (
    <ThemeProvider
      value={{
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
  ))
