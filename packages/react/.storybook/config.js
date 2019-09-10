import { configure, setAddon } from '@storybook/react'
import JSXAddon from 'storybook-addon-jsx'
import 'babel-polyfill'

setAddon(JSXAddon)

function loadStories() {
  const stories = require.context('../stories', true, /\.stories\.js$/)
  stories.keys().forEach(stories)
  const src = require.context('../src', true, /\.stories\.js$/)
  src.keys().forEach(src)
}

configure(loadStories, module)
