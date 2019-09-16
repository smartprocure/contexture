import { configure, addParameters } from '@storybook/react'
import { DocsPage } from '@storybook/addon-docs/blocks'
import { PropsTable } from '@storybook/components'

addParameters({
  docs: ({ context }) => (
    <DocsPage
      context={context}
      descriptionSlot={({ parameters }) => parameters.notes}
      propsSlot={({ parameters }) => ({
        rows: F.unkeyBy('name', parameters.props),
      })}
    />
  ),
})

configure(
  require.context(
    '../src',
    true,
    /^((?![\\/]node_modules[\\/]).)*\.stories\.(js|mdx)$/
  ),
  module
)
