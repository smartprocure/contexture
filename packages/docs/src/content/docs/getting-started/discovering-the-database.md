---
title: Discovering The Database
---

One of the great things about Contexture is that it can be used to
discover the database. In this page, we'll see how to write a filter
that not only allows the user to refine their search, but that also
shows information about our data that might not be obvious by looking
at the results directly.

### The Facet Filter

The `facet` type is just like any other type in the tree. It requires
a unique key and some other properties. In contrast to previously seen
types, such as `text` and `number`, facet doesn't require specific
values, but instead it asks for two properties: `field`, and
optionally `size`. This type is incredibly useful because besides
filtering the results based on the `value` (or `values`) the user
might have chosen, it retrieves from the database a list of available
values! The `facet` type can be very well represented as a list of
checkboxes, ready for users to pick for one or more values. Let's see
how we can use it.

### Adding the Facet Filter to the Tree

To add the `facet` filter to the tree, we simply add it to the
structure we already had. For example:

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
      key: 'cityfacet',
      type: 'facet',
      field: 'city',
      value: 'Orlando', // Optional
      // We could have instead `values` with ['Orlando', 'Miami']
    },
    {
      key: 'results',
      type: 'results',
    },
  ],
}
```

Once we have it in the tree, we can simply create another component to
allow users to set a value to this type. In this case, however, we
will be retrieving the available values from a field that is
automatically inserted to this part of the tree. Let's make sure we
have the data before we render the components.

### Fetching the Available Options

Having the facet node already added to the tree, it's only matter of
running a first search before we render the components to actually get
the possible results from the `facet` type. We can achieve this by
calling to `contexture-client`'s `refresh` function:

```javascript
// This would go after:
// let contextureSearchTree = Contexture(searchTree)
contextureSearchTree.refresh(['root'])
```

Now, the available options will be ready to be used at:
`contextureSearchTree.getNode(['root', 'cityfacet']).context.options`.
So we can write our facet component this way:

```javascript
let toggleValue = (array, value) => {
  if (array.indexOf(value) > -1) {
    let copy = array.slice() // Making sure it's not a MobX Array
    copy.splice(array.indexOf(value), 1) // removing value from the array
    array.replace(copy) // MobX Arrays have this method to replace the array's inner values
  } else {
    array.push(value)
  }
}
let RangeComponent = observer(({ tree }) => (
  <div>
    <b>Select One or More:</b>
    {tree.getNode(['root', 'cityfacet']).context.options.map((option) => (
      <div key={option.value}>
        <input
          type="checkbox"
          name={option.value}
          value={option.value}
          checked={
            tree.getNode(['root', 'cityfacet']).values.indexOf(option.value) >
            -1
          }
          onChange={() =>
            toggleValue(
              tree.getNode(['root', 'cityfacet']).values,
              option.value
            )
          }
        />
        <label for={option.value}>{option.value}</label>
      </div>
    ))}
  </div>
))
```

Including this component in our search interface will show the current
available cities for the search results we have so far, and will allow
users to filter the search even more by letting them pick any (or many)
of the available cities.
