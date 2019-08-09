import React from 'react'
import F from 'futil-js'
import { storiesOf } from '@storybook/react'
import { ThemeContext, ThemeConsumer, withTheme } from '../src/utils/theme'

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
      <ThemeContext.Provider>
        <ThemedButton>My default is a plain button!</ThemedButton>
        <DefaultVanillaButton>My default is Vanilla!</DefaultVanillaButton>
      </ThemeContext.Provider>
    )
  })
  .addWithJSX('Theme precedence', () => (
    <ThemeContext.Provider
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
    </ThemeContext.Provider>
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
      <ThemeContext.Provider
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
      </ThemeContext.Provider>
    )
  })

storiesOf('Theme API|ThemeConsumer', module)
  .addWithJSX('Without path', () => (
    <ThemeContext.Provider
      value={{
        Button: VanillaButton,
        ButtonGroup,
        'ButtonGroup.Button': PearButton,
      }}
    >
      <ThemeConsumer>
        {theme => <theme.Button>Top-level buttons are Vanilla</theme.Button>}
      </ThemeConsumer>
    </ThemeContext.Provider>
  ))
  .addWithJSX('With path', () => (
    <ThemeContext.Provider
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
      <ThemeConsumer path={['ButtonGroup']}>
        {theme => <theme.Button>ButtonGroup buttons are Grape!</theme.Button>}
      </ThemeConsumer>
    </ThemeContext.Provider>
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
    <ThemeContext.Provider
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
    </ThemeContext.Provider>
  ))
  .addWithJSX('With theme props', () => (
    <ThemeContext.Provider
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
    </ThemeContext.Provider>
  ))
