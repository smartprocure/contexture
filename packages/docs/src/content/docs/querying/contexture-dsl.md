---
title: Contexture DSL
---

The Contexture DSL is a JavaScript object structure, or JSON
structure, that is composed of nested nodes that are equal at all
levels. Each node has a `key`, a `type` and many other optional
properties. The first node is called the root and is a node of type
`group`. Any node of type `group` can have many children. Each
children can be a node of any type. If any children is another group,
this children will probably have one or more other children nodes of
any type, and so on.

Let's begin talking about the root.

### The Root

The root of a Contexture Tree is a node of type `group`. Group types
are required to have a `key`, the `type: "group"` property, and an
array of children `children: [/* nodes */]`. Root groups also need an
extra property: then ame of the schema. In summary, this is how a root
node should look:

```javascript
let searchTree = {
  key: 'myRootNode',
  type: 'group',
  schema: 'mySchemaName',
  children: [
    // Other nodes
  ],
}
```

### The Children

Each children will be an individual node. Each node will have at least
a unique `key` (unique per tree, but they can appear again in other
trees), and a `type`. Some types might require more properties. You
can learn more about our types at:

- [Types and Type Components](types/README.md)

That's really all that it is for our DSL. The magic happens in the
types and the providers. As long as your types are defined properly,
and your providers build the correct queries and write them back in
the tree, Contexture will work and you'll be able to use the
Contexture DSL to build search interfaces of any complexity.

**Note:** Many of the types have some common properties, like `field`
or `values`. The only reason these properties are common is because
they've made sense to be common for each one of our specific types,
not because they have something to share between types. Each type has
it's own properties and rules, so you should treat them as independent
structures.
