import { configure, setAddon } from '@storybook/react'
import JSXAddon from 'storybook-addon-jsx'
import 'babel-polyfill'

setAddon(JSXAddon)

function loadStories() {
  const req = require.context('../stories', true, /\.stories\.js$/)
  req.keys().forEach(filename => req(filename))
  const greyVest = require.context('../src/greyVest/', true, /\.stories\.js$/)
  greyVest.keys().forEach(filename => greyVest(filename))
}

configure(loadStories, module)
