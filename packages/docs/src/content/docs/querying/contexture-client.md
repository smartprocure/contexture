---
title: Contexture Client
---

Having a Contexture DSL by itself won't work since it's only a
language and not an interactive or working program in any sense. We
need something to automatically send this query to our DSL processor
(the main `contexture` repository). For this purpose, we provide the
`contexture-client`.

The Contexture Client is responsible for keeping track of the changes
that happen on the Contexture DSL, either by the user or by the
Contexture core. The nodes in the Contexture DSL host values used for
filtering the results, but also hold other properties, such as the
search results, and a `_meta` object that you can use for debugging
purposes. In this page, we will sumarize how the Contexture Client
works with the Contexture DSL to provide real-time interactive
searches.

### Initializing the Contexture Client

The Contexture Client has a default export that needs to be called
first with some configuration properties before being able to process
any search. This is how you would normally initialize it:

```javascript
let ContextureClient = require('contexture-client')
let Contexture = ContextureClient({
  service,
  types,
})
```

When Contexture Client determines the search query is ready to be
executed, it will call the `service` function provided with the whole
Contexture DSL. It expects to receive another full DSL that it parses
to then change the nodes again. As previously mentioned, an example
`service` would be:

```javascript
let service = async (search) => ({
  data: await postData('/sarch', { search }),
})
```

The `types` property is an object where each key is a type's name.
These type definitions are different than the ones from the servers
and allow our Contexture Client to do three things:

- To know how to validate a node.
- To know what happens to a specific node (and it's suroundings) when
  it changes.
- To know how to complemente any missing value on a specific node
  (default values, so you can omit properties when you write each of
  the nodes).

Each one of the types will have the following properties:

| Property Name | Type     | Description                                                                                                                                                           |
| ------------- | -------- | --------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `validate`    | Function | Just as the Provider Type's `hasValue`, this function will let `contexture-client` know wether this node is valid for processing or not.                              |
| `reactors`    | Object   | The Reactors is how each of the node properties might affect this node or other nodes. See our [Introduction to Reactors]()                                           |
| `defaults`    | Object   | This object will help in the initialization of the nodes of the tree of this specific type through the definition of some default values on the specified properties. |

For more information, check the following links:

- [How to make your own types (client and provider)](../../types/diy-types.md).
- [Specifically on how to make client types](../../types/diy-types.md#how-to-wite-a-client-type).

### Context Tree

Once you have Contexture Client initialized, we will be able to pass
the Contexture DSL into it. This will generate something we call the
`Context Tree`, which is an object with the following properties:

| Name    | Signature                                        | Description                                                                                                                               |
| ------- | ------------------------------------------------ | ----------------------------------------------------------------------------------------------------------------------------------------- |
| add     | `async (path, newNode) -> await searchCompleted` | Adds a node to the tree as a child of the specified path. You can await this for when updates settle and relevant searches are completed. |
| remove  | `async path -> await searchCompleted`            | Removes a node at the specified path. You can await this for when updates settle and relevant searches are completed.                     |
| mutate  | `async (path, deltas) -> await searchCompleted`  | Mutates the node at the given path with the new values. You can await this for when updates settle and relevant searches are completed.   |
| getNode | `[path] -> node`                                 | Lookup a node by a path (array of keys).                                                                                                  |
| tree    | tree                                             | A reference to the internal tree. If you mutate this, you should dispatch an appropriate event.                                           |

You can read more about the instantiated client here: [contexture-client Run Time](https://github.com/smartprocure/contexture-client#run-time).

You can also read more about the Contexture Client in our detailed
documentation: [Under the Hood: Contexture Client](../../under-the-hood/contexture-client.md).

### Tree and getNode

Context Trees have two properties for nagivating through the
Contexture DSL: `tree` and `getNode`. The `tree` property will have
the DSL as it was received, plus the default properties set by each
one of the client types, and some state properties. On the other hand,
`getNode` is a quick way to access the tree by sending only the keys
of each node. For example, let's say we have the following DSL:

```javascript
let searchTree = ContextureClient({
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
  ],
})
```

We are able to access the `namequery` node by simply calling:

```javascript
let nameQueryNode = searchTree.getNode(['root', 'namequery'])
```

### Mutate, Add and Remove

Once you have a Context Tree ready, you will trigger searches
automatically by invoking one of the following functions: `add`,
`remove`, `mutate`. More specifically:

- If you want to run a search after changing some of the properties of
  a specific node, you would call `mutate`.
- If you want to add a children to any given `group`, even the root
  group, you would call `add`.
- If you want to remove a children to any given `group`, even the root
  group, you would call `remove`.

Let's see some examples:

1. Mutate

Mutate allows us to change properties on nodes and trigger search
afterwards. Here is an example:

```javascript
await searchTree.mutate(['root', 'namequery'], {
  value: 'new value',
})
```

This will change the tree and produce a new set of results. If you're
wondering how to keep track of these changes, the simplest way to do
it is by using our MobX adapter, as shown in our [simple search
box](../../getting-started/simple-search-box.md) tutorial, or in
greater detail in our [Managing State](managing-state/README.md) docs.

2. Add

Having the previous search tree, we can add a children by doing:

```javascript
await searchTree.add(['root'], {
  key: 'results',
  type: 'results',
})
```

3. Remove

We can remove the `results` node we just added by doing:

```javascript
await searchTree.add(['root', 'results'])
```

Calling `mutate`, `add` or `remove` will trigger events not only for
the node that these functions are targetting, but also for nearby
nodes, depending on the types.

Up next, we'll dig a bit into what are the client side reactors (the
rules that Contexture Client follows to know what other nodes are
relevant for each update).
