import { useTheme } from '../utils/theme.js'
import { DnDDecorator } from './stories/util.js'
import Component from './Rule.js'

export default {
  component: (props) => <Component theme={useTheme()} {...props} />,
  decorators: [DnDDecorator],
  args: {
    node: { type: 'test', key: 'testKey' },
    tree: { join: 'and' },
    fields: {
      test: {
        field: 'test',
        label: 'Test',
        typeOptions: ['test'],
      },
    },
  },
}

export const Rule = {}
