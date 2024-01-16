---
title: Your First Filter
---

In the previous page, we wrote a simple search user interface where a
single input would retrieve results. Now, we will add a simple filter
that will allow us to get results within a given range.

### Adding the Filter to the Tree

The way we will add the filter is by adding a node to the tree. This
node is going to have a type of `number`, which asks for a `field`, a
`min` and a `max` values.

```javascript
let searchTree = {
  key: 'root',
  type: 'group',
  schema: 'collectionNameSchema',
  children: [
    {
      key: 'namequery',
      type: 'text',
      field: 'name',
      operator: 'containsWord',
      value: 'text we want to match on the field name',
    },
    {
      key: 'numberrange',
      type: 'number',
      field: 'age',
      min: 0,
      max: 100,
    },
    {
      key: 'results',
      type: 'results',
    },
  ],
}
```

With the `numberrange` node added, we can create another component
with two inputs that will allow us to filter results with the range
that the user specifies:

```javascript
let RangeComponent = observer(({ tree }) => (
  <div>
    <b>Minimum:</b>
    <input
      value={tree.getNode(['root', 'numberrange']).min}
      onChange={(e) => {
        tree.getNode(['root', 'numberrange']).min = e.target.min
      }}
    />
    <br />
    <b>Maximum:</b>
    <input
      value={tree.getNode(['root', 'numberrange']).max}
      onChange={(e) => {
        tree.getNode(['root', 'numberrange']).max = e.target.max
      }}
    />
  </div>
))
```

And that's it! Rendering this component will make our search aware of
any change the user might desire on the minimum and maximum ages they
might want to use to filter the available results.

You can read more about our available types here:

- [Types and Type Components](../types/README.md)
