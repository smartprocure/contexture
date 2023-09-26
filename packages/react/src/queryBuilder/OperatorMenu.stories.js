import { useTheme } from '../utils/theme.js'
import { parent } from './stories/util.js'
import Component from './OperatorMenu.js'

export default {
  component: (props) => <Component theme={useTheme()} {...props} />,
  args: {
    node: { join: 'and' },
    parent,
    hover: { wrap: [false], join: [''], remove: [false] },
  },
}

export const OperatorMenu = {}
