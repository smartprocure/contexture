import { configure, setAddon } from '@storybook/react'
import JSXAddon from 'storybook-addon-jsx'
import 'babel-polyfill'

setAddon(JSXAddon)

function loadStories() {
  const stories = require.context('../src', true, /\.stories\.js$/)
  stories.keys().forEach(stories)
}

configure(loadStories, module)
