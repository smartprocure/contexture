---
title: Contexture
description: A toolkit for building data interfaces
hero:
  tagline: A toolkit for building data interfaces
---

> **TODO**: Include some fancy screenshots 😎

A contexture UI is a tree of **nodes**. Nodes have inputs, contextual results, and can affect other nodes in interesting ways.

Nodes have types that capture a reusable data interface pattern. They generally work with any dataset, but can also capture domain-specific patterns. For example, a node type could represent a checkbox list of filter options. Or a number range input with a histogram of possible values. It could be a chart that aggregates the data or a pivot table. It might even look up user content that isn’t in the data set you’re working with. Contexture offers standard types off-the-shelf, but it's easy to make your own.

### Server

On the server, node types specify how to get their data (and affect others) in each data provider they support. They tend to be simple and output pieces of a database query like filters and aggregations. We've built providers for elasticsearch, mongodb, and memory. More are in progress (e.g. SQL and ODATA) and you can also build your own (e.g. for a custom API).

Nodes are part of a tree that captures how they’re related to each other. For example, nodes in a boolean AND relationship should affect each other’s results. Nodes related via an OR should not [^bool-example]. Non-leaf node branches ("groups") can nest infinitely. Regardless of how deep the tree goes, contexture figures out how nodes affect each other.

[^bool-example]: Consider a node with a list of city options ANDed with a node that picked 3 specific states. The UI should only show cities in those states. But if they're ORed together, all cities should be available options.

### Client

To keep track of all this, contexture's client manages the UI state and optimizes requests. It can integrate with off-the-shelf state managers (like mobx) or you can use the built-in watch API. There's a lot more detail in the client documentation - but some feature examples include:

- A deep understanding of node relationships allows it to avoid unnecessary requests. For example, nodes related via ORs won't trigger each other to update.
- Nodes can pause and resume, keeping track of missed updates. This is great for use cases like hidden nodes in inactive tabs or collapsed accordions. The client won't update them until they unpause - and only if they've actually missed updates.
- Nodes track statuses like loading, last update times, and validation out of the box.
- The client can debounce changes to the entire tree and drop intermediate results.

### React

Contexture has a react component library that interacts with the client. There are generic components ranging from nested query builders to entire search layouts. Every included node type also has a component (like checkbox lists). You can drop in a single component for a complete UI with dynamic filters - or build it up component by component. There's even a robust theming API to customize every part of the UI.

### How does all this work?

The client's functions ("actions") dispatch events to nodes (much like redux). An action might mutate node properties, pause or resume a node, or add, remove, or move a node to a group. Node-specific event reactor functions then determine which nodes to update. After an optional debounce, requests go to the server when there are nodes to update. The server walks the tree and runs queries for each node based on its type and the relevant provider. For more detailed information, each package has its own readme.

## Repo Notes

#### Packages

| Github                                                      | npm                                                                                | Description                                                                                                       |
| ----------------------------------------------------------- | ---------------------------------------------------------------------------------- | ----------------------------------------------------------------------------------------------------------------- |
| [server](./packages/server)                                 | [contexture](https://www.npmjs.com/package/contexture-elasticsearch)               | The server library that exectues the DSL to retrieve data                                                         |
| [provider-elasticsearch](./packages/provider-elasticsearch) | [contexture-elasticsearch](https://www.npmjs.com/package/contexture-elasticsearch) | Elasticsearch provider for contexture                                                                             |
| [provider-mongo](./packages/provider-mongo)                 | [contexture-mongo](https://www.npmjs.com/package/contexture-mongo)                 | MongoDB provider for contexture                                                                                   |
| [client](./packages/client)                                 | [contexture-client](https://www.npmjs.com/package/contexture-client)               | The client library that manages the DSL, allowing for hyper efficient updates running only what is exactly needed |
| [react](./packages/react)                                   | [contexture-react](https://www.npmjs.com/package/contexture-react)                 | React components for building contexture interfaces                                                               |
| [export](./packages/export)                                 | [contexture-export](https://www.npmjs.com/package/contexture-export)               | Export searches into files or any other target                                                                    |

#### Ecosystem And Resources

- [Elasticon 2018 Talk About Contexture](http://github.com/smartprocure/contexture-ec18-talk)
