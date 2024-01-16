---
title: Reactors
---

When any node changes, depending on the type, it might be reasonable
to re-trigger a search call for other nodes. We call this process the
selection of `reactors`, where the possible reactors are only three:
`self`, `others` and `all`.

Reactors should be specified in the Client Types, where each type will
have a specific reactor for each one of it's properties. For example
(taken from our client side [example
types](https://github.com/smartprocure/contexture-client/blob/master/src/exampleTypes.js)):

```javascript
facet: {
  reactors: {
    values: 'others',
    mode: 'others',
    size: 'self',
    optionsFilter: 'self',
    sort: 'self',
  }
}
```

The client side type defined above will be effective for any node with
type `facet`, where the properties `values` and `mode` will affect
only all the other nodes (and not itself), and the properties `size`,
`optionsFilter` and `sort` will affect only the specific `facet` node
and no other node.

The one remaining reactor that isn't covered by that example is the
`all` reactor. The difference between `others` and `all` is that
`others` excludes the node where the change is happening, and `all`
includes all other nodes and the node where the change is happening
(effectively combining `self` and `others`).

You can also read more about reactors in the Contexture Client in our
detailed documentation: [Under the Hood: Contexture
Client - Reactors in Detail](../../under-the-hood/contexture-client.md#reactors-in-detail).
