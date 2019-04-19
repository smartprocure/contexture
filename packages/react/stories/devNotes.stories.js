import { storiesOf } from '@storybook/react'
import { withInfo } from '@storybook/addon-info'

storiesOf('Developer Notes|Docs', module)
  .add(
    'README.md',
    withInfo({ text: require('../README.md'), inline: true, source: false })(
      () => null
    )
  )
  .add(
    'CHANGELOG.md',
    withInfo({ text: require('../CHANGELOG.md'), inline: true, source: false })(
      () => null
    )
  )
