import { useTheme } from '../../utils/theme.js'
import React from 'react'
import Component from './Indentable.js'

export default {
  component: (props) => <Component theme={useTheme()} {...props} />,
  args: {
    indent: () => true,
    children: <div style={{ height: '100px' }}>Contents</div>,
  },
}

export const And = { args: { node: { join: 'and' } } }

export const Or = { args: { node: { join: 'or' } } }

export const Not = { args: { node: { join: 'not' } } }
