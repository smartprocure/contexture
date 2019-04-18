import { configure, setAddon } from '@storybook/react'
import JSXAddon from 'storybook-addon-jsx'
import 'babel-polyfill'

setAddon(JSXAddon)

function loadStories() {
  require('../stories')
}

configure(loadStories, module)
