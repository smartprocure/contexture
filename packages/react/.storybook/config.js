import { configure, setAddon } from '@storybook/react'
import { setOptions } from '@storybook/addon-options'
import JSXAddon from 'storybook-addon-jsx'

setAddon(JSXAddon)

function loadStories() {
  require('../stories')
}

setOptions({
  name: 'Contexture React',
  url: 'https://github.com/smartprocure/contexture-react',
  addonPanelInRight: true,
})

configure(loadStories, module)
