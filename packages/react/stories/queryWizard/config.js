import _ from 'lodash/fp'
import { exampleTypes, mockService } from 'contexture-client'
import ContextureMobx from '../../src/utils/contexture-mobx'

let typeDescriptions = {
  tagsQuery: {
    description: "enter some tags"
  },
  query: {
    description: "Enter A Search Term In The Field"
  },
  facet: {
    description: "Use the checkboxes to select all the results you wish to include. You can find and add multiple results by repeating this process."
  }
}

export let types = _.merge(exampleTypes, typeDescriptions)

export let fields = {
  foo: { label: 'Foo', description: "enter a foo" },
  bar: { label: 'Bar', description: "Type in the bar's name" }
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
      label: 'Friendly Group',
      type: 'group',
      join: 'and',
      children: [
        {
          type: 'tagsQuery',
          key: 'friendly node',
          label: 'Friendly Node',
          typeDescription: 'Enter some tags',
          fieldDescription: 'Search for stuff',
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
      friendlyName: 'Step 2',
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
    label: "This is a really long name"
  },
  'friendly facet': {
    label: 'This is another really long name',
    description: 'FRIENDLY FACET OVERRIDE DESCRIPTION'
  }
}
