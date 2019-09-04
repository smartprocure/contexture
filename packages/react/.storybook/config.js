import { configure, setAddon, addDecorator } from '@storybook/react'
import JSXAddon from 'storybook-addon-jsx'
import 'babel-polyfill'
import ThemePicker from '../stories/greyVest/decorator'

setAddon(JSXAddon)
addDecorator(ThemePicker)

function loadStories() {
  const req = require.context('../stories', true, /\.stories\.js$/)
  req.keys().forEach(filename => req(filename))
}

configure(loadStories, module)
