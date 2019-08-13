import React from 'react'
import F from 'futil-js'
import { storiesOf } from '@storybook/react'
import { ThemeProvider, ThemeConsumer, withTheme } from '../src/utils/theme'
import { getDisplayName } from '../src/utils/hoc'

let withStyle = (style, Component) => {
  let styled = props => <Component style={style} {...props} />
  styled.displayName = `WithStyle(${getDisplayName(Component)})`
  return styled
}

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

let ThemedButton = withTheme('Button')(
  ({ theme: { Button = 'button' }, children }) => <Button>{children}</Button>
)

let ButtonGroup = ({ theme: { Button = 'button' }, buttons = [] }) =>
  F.mapIndexed((button, i) => <Button key={i}>{button}</Button>)(buttons)

let ThemedButtonGroup = withTheme('ButtonGroup')(ButtonGroup)

storiesOf('Theme API|withTheme', module)
  .addWithJSX('Setting defaults', () => {
    let DefaultVanillaButton = withTheme('ButtonGroup')(
      ({ theme: { Button = VanillaButton }, children }) => (
        <Button>{children}</Button>
      )
    )
    return (
      <ThemeProvider>
        <ThemedButton>My default is a plain button!</ThemedButton>
        <DefaultVanillaButton>My default is Vanilla!</DefaultVanillaButton>
      </ThemeProvider>
    )
  })
  .addWithJSX('Theme precedence', () => (
    <ThemeProvider
      value={{
        Button: VanillaButton,
        'ButtonGroup.Button': StrawberryButton,
      }}
    >
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
    let UnnamedComponent = withTheme()(({ theme: { Button = 'button' } }) => (
      <>
        <div>I am an anonymous component</div>
        <Button>Top-level buttons are Vanilla</Button>
      </>
    ))
    let ExplicitlyNamedComponent = withTheme('Jerry')(
      ({ theme: { Button = 'button' } }) => (
        <>
          <div>
            I am also an anonymous component, but <code>withTheme</code> knows
            me as "Jerry"
          </div>
          <Button>Jerry buttons are Strawberry!</Button>
        </>
      )
    )
    let ButtonGroupGeorge = withTheme('George')(ButtonGroup)
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
  .addWithJSX('Without path', () => (
    <ThemeProvider
      value={{
        Button: VanillaButton,
        ButtonGroup,
        'ButtonGroup.Button': PearButton,
      }}
    >
      <ThemeConsumer name="Button">
        {({ Button = 'button' }) => (
          <Button>Top-level buttons are Vanilla</Button>
        )}
      </ThemeConsumer>
    </ThemeProvider>
  ))
  .addWithJSX('With path', () => (
    <ThemeProvider
      value={{
        Button: VanillaButton,
        ButtonGroup,
        'ButtonGroup.Button': GrapeButton,
      }}
    >
      {/* 
        If ThemeConsumer is given a `path` prop containing an array, it will merge
        all of the theme components along that path into the `theme` object that is
        passed to its child function.
      */}
      <ThemeConsumer name="ButtonGroup">
        {({ Button = 'button' }) => (
          <Button>ButtonGroup buttons are Grape!</Button>
        )}
      </ThemeConsumer>
    </ThemeProvider>
  ))

let IconButton = ({
  theme: { Button = 'button', Icon = () => <span>[icon]</span> },
  children,
}) => (
  <Button>
    <Icon />
    {children}
  </Button>
)
let ThemedIconButton = withTheme('IconButton')(IconButton)

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
