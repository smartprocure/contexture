import Component from './CheckButton.js'

export default {
  component: Component,
  args: { children: 'Your refrigerator is running' },
}

export const Unchecked = {}

export const Checked = { args: { checked: true } }
