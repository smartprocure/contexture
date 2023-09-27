import { useTheme } from '../../utils/theme.js'
import { action } from '@storybook/addon-actions'
import Component from './AddPreview.js'

export default {
  component: (props) => <Component theme={useTheme()} {...props} />,
  args: {
    onClick: action('join'),
  },
}

export const And = { args: { join: 'and' } }

export const Or = { args: { join: 'or' } }

export const Not = { args: { join: 'not' } }
