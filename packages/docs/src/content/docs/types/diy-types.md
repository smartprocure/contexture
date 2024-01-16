---
title: DIY Types
---

The Contexture ecosystem provides a defined list of types that can be
used to perform a wide variety of different searches. Each type we
offer also has a respective component in our `contexture-react` repo.
We've made these components so you can quickstart your search interfaces!

Even if our types are focused on the different search interfaces we
provide, our API is designed to allow you to build any type you might
need for any other possible use case you might encounter.

We believe that making a generic framework will allow users to be
creative on their search solutions. Because of that, we will start this
document by explaining how to build your own types.

Writing a new single type is about writing two plain JavaScript Objects:

- One which is sent to the [Contexture Provider](../querying/available-providers.md).
- Another one which is sent to the initialization of the [Context Tree](../interactive-queries/contexture-client.md#context-tree).

## How to Wite a Provider Type

Initializing [Contexture Core](../querying/contexture-core.md)
requires you to send a bunch of types per provider. A type on any
provider is just a valid string property name on the object that is
sent, accompanied with a corresponding value of a plain JavaScript
Object with one or more of the following properties:

| Property   | Type     | Params (Type)                    | Return Value Type | What it does                                                                                              |
| ---------- | -------- | -------------------------------- | ----------------- | --------------------------------------------------------------------------------------------------------- |
| `hasValue` | Function | Node (Object)                    | Boolean           | Allows Contexture to know wether or not to process this search.                                           |
| `filter`   | Function | Node (Object)                    | Object            | Returns a query with the applied input values, which will be sent later to the database provider.         |
| `result`   | Function | Node (Object), Search (Function) | Promise           | Allows running a direct search for this type before Comtexture sends the full seaech with the whole tree. |

Once you have written a type, you can use it by sending it to an
existing [Contexture Provider](../querying/available-providers.md). It
should look more or less like:

```javascript
let myType = {
  hasValue: (node) => node.requiredProperty,
  filter: (node) => ({
    providerQueryObject: {
      value: node.requiredProperty,
    },
  }),
}

let provider = MyProvider({
  types: {
    myType,
  },
})
```

**Type names are not exclusive across providers**. You can define one
type called `myAwesomeType` in more than one provider and you'll be
able to keep the same required node properties, thus the same
`hasValue`. This allows us to provide the same API for several types,
and re-use code even if we switch the target database of the search.

Once you have a type defined for one or more providers, you should
write the same type for `contexture-client`.

## How to Write a Client Type

Contexture Client already provides a some types based on our
`Example Types` (more on that later.) These type definitions help
the client understand how a specific node affects every other node or
itself.

To create a custom type, you will need to think on the behaviors you
might need for each one of the following properties:

| Property Name | Type     | Description                                                                                                                                                           |
| ------------- | -------- | --------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `validate`    | Function | Just as the Provider Type's `hasValue`, this function will let `contexture-client` know wether this node is valid for processing or not.                              |
| `reactors`    | Object   | The Reactors is how each of the node properties might affect this node or other nodes. See our [Introduction to Reactors]()                                           |
| `defaults`    | Object   | This object will help in the initialization of the nodes of the tree of this specific type through the definition of some default values on the specified properties. |

More details about `contexture-client` types, their properties and
their reserved words can be seen on the README of
[contexture-client](https://github.com/smartprocure/contexture-client#client-types).

The example types are already included in any instantiation
of Contexture Client's Contexture Tree. However, you can add any type
you need simply by extending the exposed `exampleTypes` with your own.
In the following snippet, we initialize a `ContextureTree` with the
available `exampleTypes`, and our new `myType`:

```javascript
import * as ContextureClient from 'contexture-client'

let tree = ContextureClient.ContextTree(
  {
    types: {
      ...ContextureClient.exampleTypes,
      myType: {
        validate: (node) => node.requiredProperty,
        reactors: {
          requiredProperty: 'others',
        },
        defaults: {
          requiredProperty: false,
        },
      },
    },
  },
  {
    // Here we will have the underlying tree
  }
)
```

## How to Write a UI Component for a Type

Writing a user interface for any type can be as simple as writing an
HTML or JSX Element that will render or modify any property of the
any node of an existing Contexture Tree, for example, using our custom
type `myType`, we could write an input field that, onChange, will
write the field's value into the `requiredProperty`. For example:

```javascript
// This is ES6+ and JSX

import * as ContextureClient from 'contexture-client'

let tree = ContextureClient.ContextTree(
  {
    service: myService,
    types: {
      ...ContextureClient.exampleTypes,
      myType: {
        validate: (node) => node.requiredProperty,
        reactors: {
          requiredProperty: 'others',
        },
        defaults: {
          requiredProperty: false,
        },
      },
    },
  },
  {
    key: 'root',
    join: 'and',
    children: [
      {
        key: 'myNode',
        type: 'myType',
      },
    ],
  }
)

let node = tree.getNode(['root', 'myNode'])

let Component = ({ node }) => (
  <input
    type="text"
    onChange={(e) => {
      node.requiredProperty = e.target.value
    }}
  />
)
```

Now that you have a component you can render it and play with it, but
the component won't render by itself. If you want to see examples of
custom components with automatic updates, please look at our [Managing
State Guide](../managing-state/index.md).

## The Example Types

With the intention of providing practical examples of how to write
types, we decided to share some of the types we use in our production
applications. These types belong to two different database processors:
`contexture-elasticsearch` and `contexture-mongo`.

**Example Types aren't the rule**. These types are only provided to
serve as a guide to build any other type you might need for your
application. You can also **extend our example types**, simply by
assigning new types as properties on the objects exposed by
`contexture-elasticsearch` and `contexture-mongo`.
