---
title: Useful Components
---

### ContextureProvider

This component is a magic tool to make Contexture search interfaces without
having to write the tree separated. With this component, you can pass the tree
directly as a plain object, and any children you pass will receive the `tree`
property directly.

This component receives:

| Property Name | Type                                   | Required | Description                                                                                    |
| ------------- | -------------------------------------- | -------- | ---------------------------------------------------------------------------------------------- |
| `types`       | Object                                 | Yes      | Your client-side types, such as the default types of the Contexture Client.                    |
| `service`     | Object                                 | Yes      | The search function that sends the DSL to the initialized Contexture Core.                     |
| `nodeKey`     | Object                                 | Yes      | Key for the root node. Defaults with `root`.                                                   |
| `...props`    | Any other property (children excluded) | Yes      | Any other property that you might want to send to the initialization of the Contexture Client. |

**Note:** Any of the Contexture React Example Types components automatically
add the nodes to the tree if the referenced node is not present. _This is
an experimental feature_.

Here's how you write your component:

```javascript
let ContextureProvider = require('contexture-react/dist/ContextureProvider')
let ContextureClient = require('contexture-client')
let types = ContextureClient.exampleTypes
let service = async search => ({
  data: await postData('/sarch', { search })
})
// ...
// Later, on your render function, or where you put your components:
<ContextureProvider {...{
  types,
  service,
}}>
  <Query path={['query']} />
</ContextureProvider>
```

- [Source code of the ContextureProvider component](https://github.com/smartprocure/contexture-react/blob/master/src/ContextureProvider.js).

### FilterList

A component that tries to automatically render the specific type components of
the children of a node.

| Property Name  | Type   | Required | Description                                                                                                                      |
| -------------- | ------ | -------- | -------------------------------------------------------------------------------------------------------------------------------- |
| `node`         | Object | Yes      | Node of the Contexture Tree where the children that want to be rendered are.                                                     |
| `exampleTypes` | Object | No       | Object which a key and a component per type. Defaults in the available example types components in contexture-elasticsearch.     |
| `fields`       | Object | Yes      | Object which a key and an object with at least a `label` string property, used to indicate the label of each one of the filters. |

Here's how you write your component:

```javascript
let FilterList = require('contexture-react/dist/FilterList')
let ContextureClient = require('contexture-client')
let tree = ContextureClient({
  key: 'root',
  type: 'group',
  schema: 'mySchema',
  children: [{
    key: 'query',
    type: 'query',
    field: 'myFieldName',
    query: 'Something'
  }]
})
// ...
// Later, on your render function, or where you put your components:
<FilterList node={tree.getNode(['root'])} fields={{
  myFieldName: {
    label: 'My Super Field Name'
  }
}}/>
```

- [Source code of the FilterList component](https://github.com/smartprocure/contexture-react/blob/master/src/FilterList.js).

Up next, components only useful for helping on building the layout.
