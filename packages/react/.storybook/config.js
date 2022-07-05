import { configure } from '@storybook/react'
import { configure as mobxConfigure } from 'mobx'

mobxConfigure({ enforceActions: 'never', useProxies: 'never' })

configure(
  require.context(
    '../src',
    true,
    /^((?![\\/]node_modules[\\/]).)*\.stories\.(js|mdx)$/
  ),
  module
)
