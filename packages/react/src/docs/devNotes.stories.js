import { storiesOf } from '@storybook/react'
import { withInfo } from '@storybook/addon-info'
import README from '../../README.mdx'

export default {
    title: 'Developer Notes'
}

export let readme = () => null
readme.story = { parameters: { docs: { page: README }} }
