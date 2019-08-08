import React from 'react'
import F from 'futil-js'
import { storiesOf } from '@storybook/react'
import { ThemeProvider, ThemeConsumer, withTheme } from '../src/utils/theme'

let withStyle = (style, Component) => props => <Component style={style} {...props} />

let VanillaButton = withStyle({
  backgroundColor: 'cornsilk',
  border: '2px solid tan',
  color: 'rosybrown'
}, 'button')

let StrawberryButton = withStyle({
  backgroundColor: 'lightcoral',
  border: '2px solid limegreen',
  color: 'greenyellow'
}, 'button')

let PearButton = withStyle({
  border: '2px solid olive',
  color: 'darkolivegreen',
  backgroundColor: 'yellowgreen'
}, 'button')

let GrapeButton = withStyle({
  border: '2px solid blueviolet',
  color: 'chartreuse',
  backgroundColor: 'mediumorchid'
}, 'button')

let ButtonGroup = ({ theme, buttons = [] }) => F.mapIndexed(
  (button, i) => <theme.Button key={i}>{button}</theme.Button>
)(buttons)

let ThemedButtonGroup = withTheme({ Button: 'button' })(ButtonGroup)

storiesOf('Theme API|withTheme', module)
  .addWithJSX('Setting defaults', () => {
    let VanillaButtonGroup = withTheme({ Button: VanillaButton })(ButtonGroup)
    return (
      <ThemeProvider>
        <VanillaButtonGroup buttons={['Vanilla', 'Buttons!']} />
      </ThemeProvider>
    )
  })
  .addWithJSX('Theme precedence', () => (
      <ThemeProvider
        theme={{
          Button: VanillaButton,
          'ButtonGroup.Button': StrawberryButton
        }}
      >
        <ThemedButtonGroup buttons={['Nested themes override top-level themes']} />
        <ThemedButtonGroup theme={{ Button: PearButton }} buttons={['Theme props override theme context']} />
      </ThemeProvider>
    )
  )
  .addWithJSX('Explicit naming', () => {
    let UnnamedComponent = withTheme()(
      ({ theme }) => 
      <>
        <div>I am an anonymous component</div>
        <theme.Button>Top-level buttons are Vanilla</theme.Button>
      </>
    )
    let ExplicitlyNamedComponent = withTheme({ Button: 'button' }, 'Jerry')(
      ({ theme }) => 
      <>
        <div>I am also an anonymous component, but <code>withTheme</code> knows me as "Jerry"</div>
        <theme.Button>Jerry buttons are Strawberry!</theme.Button>
      </>
    )
    let ButtonGroupGeorge = withTheme({ Button: 'button' }, 'George')(ButtonGroup)
    return (
      <ThemeProvider
        theme={{
          Button: VanillaButton,
          'Jerry.Button': StrawberryButton,
          'George.Button': PearButton,
        }}
      >
        <UnnamedComponent />
        <div style={{ height: 20 }} />
        <ExplicitlyNamedComponent />
        <div style={{ height: 20 }} />
        <div>This component is a ButtonGroup, but <code>withTheme</code> knows it as "George":</div>
        <ButtonGroupGeorge buttons={['George buttons are Pear!']} />
      </ThemeProvider>
    )
  })

storiesOf('Theme API|ThemeConsumer', module)
  .addWithJSX('Without path', () => (
    <ThemeProvider theme={{ Button: VanillaButton, ButtonGroup, 'ButtonGroup.Button': PearButton }}>
      <ThemeConsumer>
        {theme => <theme.Button>Top-level buttons are Vanilla</theme.Button>}
      </ThemeConsumer>
    </ThemeProvider>
  ))
  .addWithJSX('With path', () => (
    <ThemeProvider theme={{ Button: VanillaButton, ButtonGroup, 'ButtonGroup.Button': GrapeButton }}>
      {/* 
        If ThemeConsumer is given a `path` prop containing an array, it will merge
        all of the theme components along that path into the `theme` object that is
        passed to its child function.
      */}
      <ThemeConsumer path={['ButtonGroup']}>
        {theme => <theme.Button>ButtonGroup buttons are Grape!</theme.Button>}
      </ThemeConsumer>
    </ThemeProvider>
  ))

let IconButton = ({ theme, children }) => (
  <theme.Button>
    <theme.Icon />
    {children}
  </theme.Button>
)
let ThemedIconButton = withTheme({ Button: 'button', Icon: () => <span>[icon]</span>})(IconButton)

storiesOf('Theme API|Multi-level nesting', module)
  .addWithJSX('With theme context', () => (
    <ThemeProvider
      theme={{
        Icon: () => <span>🍨</span>,
        Button: VanillaButton,
        'ButtonGroup.Button': ThemedIconButton,
        'ButtonGroup.IconButton.Icon': () => <span>🍓</span>,
        'ButtonGroup.IconButton.Button': StrawberryButton
      }}
    >
      <ThemedIconButton>Top-level Icon & Button theme</ThemedIconButton>
      <ThemedButtonGroup buttons={['ButtonGroup Icon & Button theme']} />
    </ThemeProvider>
  ))
  .addWithJSX('With theme props', () => (
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
          'IconButton.Button': GrapeButton
        }}
        buttons={['ButtonGroup Icon & Button theme']}
      />
    </ThemeProvider>
  ))
