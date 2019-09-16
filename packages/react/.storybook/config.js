import { configure, addParameters } from '@storybook/react'
import { DocsPage } from '@storybook/addon-docs/blocks'
import { PropsTable } from '@storybook/components'
import F from 'futil-js'

let propDefGetter = type => F.unkeyBy('name', type.info.props)

addParameters({
  docs: { getPropDefs: propDefGetter },
})

configure(
  require.context(
    '../src',
    true,
    /^((?![\\/]node_modules[\\/]).)*\.stories\.(js|mdx)$/
  ),
  module
)
