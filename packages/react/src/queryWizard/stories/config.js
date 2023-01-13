import _ from 'lodash/fp.js'
import { exampleTypes, mockService } from 'contexture-client'
import ContextureMobx from '../../utils/contexture-mobx.js'

let typeDescriptions = {
  tagsQuery: {
    description: 'Enter some tags.',
  },
  query: {
    description: 'Enter a search term in the field.',
  },
  facet: {
    description:
      'Use the checkboxes to select all the results you wish to include. You can find and add multiple results by repeating this process.',
  },
}

export let types = _.merge(exampleTypes, typeDescriptions)

export let fields = {
  foo: {
    label: 'Foo',
    description: 'Enter the number of foo.',
    typeDefault: 'number',
  },
  bar: {
    label: 'Bar',
    description: "Type in the bar's name.",
    typeDefault: 'facet',
  },
  query: {
    label: 'Query',
    description: 'Enter a query.',
    typeDefault: 'query',
  },
  tags: { label: 'Tags', description: 'Enter the tags.', typeDefault: 'facet' },
}

let Client = ContextureMobx({
  debug: true,
  types,
  service: mockService(),
})

export let tree = Client({
  key: 'root',
  join: 'and',
  children: [
    {
      key: 'step 1',
      type: 'group',
      join: 'and',
      children: [
        {
          type: 'tagsQuery',
          key: 'friendly node',
        },
        {
          key: 'foop',
          type: 'group',
          join: 'and',
          children: [
            {
              type: 'query',
              key: 'longName',
            },
            {
              type: 'group',
              key: 'foo',
              join: 'or',
              children: [
                {
                  key: 'foo',
                  field: 'foo',
                  type: 'query',
                },
                {
                  key: 'bar',
                  field: 'bar',
                  type: 'tagsQuery',
                },
              ],
            },
          ],
        },
        {
          type: 'facet',
          key: 'friendly facet',
        },
      ],
    },
    {
      key: 'step 2',
      type: 'group',
      join: 'and',
      children: [
        {
          type: 'tagsQuery',
          key: 'friendly node',
          field: 'foo',
        },
        {
          type: 'facet',
          key: 'friendly facet',
          field: 'bar',
        },
      ],
    },
  ],
})

export let nodeOverrides = {
  longName: {
    label: 'This is a really long name',
  },
  'friendly facet': {
    label: 'This is another really long name',
    description: 'FRIENDLY FACET OVERRIDE DESCRIPTION!',
  },
}
