# contexture-client
The Contexture (aka ContextTree) Client

[![npm version](https://badge.fury.io/js/contexture-client.svg)](https://badge.fury.io/js/contexture-client)
[![CircleCI](https://circleci.com/gh/smartprocure/contexture-client.svg?style=svg)](https://circleci.com/gh/smartprocure/contexture-client)

## Overview
This library manages the state of a contexture tree to automatically run only the optimal minimal amount of searches possible.

In general, you perform `actions` which `dispatch` one or more events to an instantiated client, and it reacts by intelligently running searches as needed.

### Helpful Mental Models
To help people grok the purpose of the this library, this section attempts to explain in terms of mental models that developers are likely to have seen before.

#### Redux
You can think of the client like redux with prebuilt actions and reducers that are async and run searches.
Of course, astute readers will realize that model breaks down because a reducer that performs side effects and doesn't return new state isn't a reducer at all.

#### Pub/Sub
You can think of the client as a pub/sub system with prebuilt subscribers that can handle specific events. `dispatch` is like publish with the internal process/reactor functions acting as subscribers.


## Feature Highlights

- Updates individual nodes independently
- Updates only the most minimal set of nodes possible in response to changes
  - Powered by reactors (only/others/all, field/join change, item add/remove) which account for and/or/not relationship
- Per node Pause/Resume
  - Keeps track of if it missed updates, allowing it to know if it needs to update on resume or not
- Per node async validation
  - Node types can implement a function to have a node instance pass (return true), be ignored for the search (return false), or block the search (throw)
- Eliminating blank nodes (nodes without values)
- Per Node Loading Indicators
- Intelligent Search Debouncing (global debounce and optional per node pausing until results come back)
- Dropping intermediate (stale) responses
- Error handling


## API

### Instantiation

The root function takes two parameters, `config` and actual `tree` instance. It's curried, so you can call it like this:

```js
ContextureClient({...config}, tree)
```
or

```js
ContextureClient({...config})(tree)
```

if you want to pre apply it with config.

#### Config
The following config options are available:

| Name              | Type                           | Default      | Description |
| ----              | ----                           | -------      | ----------- |
| service           | function                       | n/a          | **Required** Async function to actually get service results (from the contexture server). An exception will be thrown if this is not passed in. |
| types             | ClientTypeSpec                 | exampleTypes | Configuration of available types (documented below) |
| debounce          | number                         | 1            | How many milliseconds to globally debounce search |
| onChange          | (node, changes) => {}          |  _.noop      | A hook to capture when the client changes any property on a node. Can be modified at run time by reassigning the property on a tree instance. |
| onResult          | (path, response, target) => {} |  _.noop      | A hook to capture when the client updates a node with results from the server. Can be modified at run time by reassigning the property on a tree instance. |
| debug             | boolean                        | false        | Debug mode will log all dispatched events and generally help debugging |
| extend            | function                       | F.extendOn   | Used to mutate nodes internally |
| initObject        | function                       | _.identity   | Called on the tree at initialization and on payloads before add. With `mobx`, this would be `observable` |
| snapshot          | function                       | _.cloneDeep  | Used to take snapshots |
| disableAutoUpdate | boolean                        | false        | Will disable automatically triggering updates at the end of dispatches, except for events that affect their target node. This is useful for a search button use case, similar to pausing the entire tree but always allowing through specific changes. This is typically used with the `triggerUpdate` action to kick off a dispatch that will update everything `markedForUpdate`. Can be changed at run time. | 

#### Client Types
Available types are passed in as config.

This is the general structure:

```js
{
  TypeName: {
    init: (node, extend) => {
      // Do stuff like extend the node with some default properties
    },
    defaults: {...} // sugar over simply calling extend(node, {...}) in init
    validate: async node => true || false || throw Exception()
    reactors: {
      fieldName: 'reactor',
      field2...
    },
    // When marked for update by a dispatch to a different node
    onUpdateByOthers: (node, extend) => { }
  },
  Type2....
}
```

When picking field reactors, you should use the `others` reactor for things that are used for filtering (formerly `data` properties), and `self` for things that are only used to determine that node's context result (formerly `config` properties).

**NOTE** There are a few reserved words you can't use for type properties:

| Name | Type | Notes |
| ---- | ---- | ----- |
| path | `[string]` |  The array of keys from the root to get to this node |
| markedForUpdate | `bool` | True when a node will be updated but the debonce time has not fully elapsed. |
| updating | `bool` | True when a node is waiting for a service call (_after_ debounce has elasped)  |
| paused | `bool` | Tracks whether a node is `paused`, which prevents it from requesting updates from the service |
| missedUpdate | `bool` | Tracks when nodes would have asked for updates but didn't because they were paused |
| hasValue | `bool` | Tracks when a node passed `validate`, which is used to determine if it participates in the search |
| lastUpdateTime | `timestamp` | Last time this node was updated with results from the service |
| context | `object` | Object which holds the contextual results from the server |
| type | `string` | Represents the contexture node type |
| key | `string` | Uniquely identifies this node in the tree, used to match results |
| updatingPromise | `Promise` | Resolves when the node is done updating, and is reset as a new pending promise when markedForUpdate - be careful if relying on this as the promise property is replaced with a new value whenever it's marked for update. |
| updatingDeferred | `Futil Deferred` | Interally used to resolve the updatingPromise |

#### Client Type Definition Config

| Name | Type | Notes |
| ---- | ---- | ----- |
| init | `(node, extend) => {}` | Called when a node is added and when the tree is first initialized. Can be used to do stuff like extend the node with some default properties. |
| defaults | `object` | Sugar over simply calling extend(node, {...}) in init |
| validate | `async node => true/false/throw Exception()` | An async function that will block updates until it resolves. Return true to let the node participate in the search, false for it to be excluded, or throw to block the search completely. This can be used to block waiting for things like an API service that gets a value. |
| reactors | `object` | An object of field names -> reactor names, primarily for use in `mutate` |
| subquery.getValues | `(sourceNode) => inputValues` | See subquery section below |
| subQuery.useValues | `(values, targetNode) => valuesToMutate` | See subquery section below |
| onUpdateByOthers | `(node, extend) => {}` | Called when a node is markedForUpdate by an event dispatched to a different node, which should generically capture all events where something caused the relevant filters to change and exclude anything that only affects itself. This is typically used to do things like reset paging since that should be reset when relevant filters change. |

### Run Time
The following methods are exposed on an instantiated client:

| Name | Signature | Description |
| ---- | --------- | ----------- |
| dispatch | `async event -> await searchCompleted` | A lower level, core method of interaction (called automatically by the actions above). You can await this for when updates settle and relevant searches are completed. |
| getNode | `[path] -> node` | Lookup a node by a path (array of keys). |
| serialize | `() => tree` | Returns a snapshot of the tree without any of the temporary state like updating flags. |
| lens | `(path, prop) -> ({ get, set })` | Given a path and a property, returns a lens that provides a getter and a setter for the provided property on the provided path. The setter function does a `mutate`. |
| tree | tree | A reference to the internal tree. If you mutate this, you should dispatch an appropriate event. |
| addActions | `(({ getNode, flat, dispatch, snapshot, extend, types, initNode }) => {actionsMethods} ) => null` | *Experimental* A method for extending the client with new actions on a per instance basis. You pass in a function which takes an object containing internal helpers and returns an object with actions that get extended onto the tree instance. |
| addReactors | `(() => {customReactors}) => null` | *Experimental* A method for adding new reactors on a per instance basis. You pass in a function which returns an object of new reactors to support (`{reactorName: reactorFunction}`). Reactors are passed `(parent, node, event, reactor, types, lookup)` and are expected to return an array of affected nodes. |
| subquery | `(targetPath, sourceTree, sourcePath, mapSubqueryValues?) => {}` | Sets up a subquery, using the types passed in to the client and assuming this tree instance is the target tree. For more info, see the [subquery](#Subquery) section below. |
| isPausedNested | `path -> bool` | Returns a bool for whether the node at the path and all of its children are paused. |

#### Actions

Client methods that mutate or otherwise act on nodes are known as **actions**. You can await these for when updates settle and relevant searches are completed. Conventionally, actions take a node path as their first parameter. 

Note that it's also possible to add custom actions to a client instance through the `addActions` method (see the table above for more details).

| Name | Signature | Description |
| ---- | --------- | ----------- |
| add | `async (path, newNode, {index}) -> await searchCompleted` | Adds a node to the tree as a child of the specified path. You can optionally pass an options object as the third param to specify the index where to add the node. The node can be a group with children. |
| remove | `async path -> await searchCompleted` | Removes a node at the specified path. Will also remove children of the target node. |
| mutate | `async (path, deltas) -> await searchCompleted` | Mutates the node at the given path with the new values. |
| triggerUpdate | `async () -> await searchCompleted` | Will trigger an update with a `none` reactor, updating only nodes that are already marked for update. This is useful when `disableAutoUpdate` is set to true. |
| clear | `async path -> await searchCompleted` | Resets the node's values to those given on the node type's `defaults` (except `field`) |
| replace | `async (path, newNodeOrTransform) -> await searchCompleted` | Replaces the node at the given path with a new node. Accepts either a node object or a `node -> newNode` transform function as its second argument. If a function is given, it is called on the node at `path`, and the result is then used in `replace`. |
| wrapInGroup | `async (path, newNode) -> await searchCompleted` | Wraps the node at the provided path in a group described by `newNode`. The node will be replaced it on its parent's children unless it is root node (with a nul parent). If the node has no parent, it will be done in place by mutating the node into the group described by `newNode` with the original node as it's only child. |
| move | `async (path, { path, index }) -> await searchCompleted` | Moves the node at the provided path (first argument) to the target location provided in the second parameter. If the target path is not specified, it will default to the current node's group. If the target index isn't provided, it will default to moving to the end of the target group. Useful for drag and drop query builder interfaces that let you move nodes around in and between groups. |
| pauseNested | `async path -> await searchCompleted` | Recursively set paused to true for the node at the path and all its children. |
| unpauseNested | `async path -> await searchCompleted` | Recursively set paused to false for the node at the path and all its children. |

#### Node Run Time
The following methods can be added to individual nodes (just set them on the object returned by getNode)

| Name | Signature | Description |
| ---- | --------- | ----------- |
| onMarkForUpdate | `async () => {}` | Called when a node is markedForUpdate (post validate), and will block the search until it resolves. Used internally by subquery. |
| afterSearch | `async () => {}` | Called on nodes that were marked for update _after_ the the search finishes - kind of like a per-node onResult, but will block the dispatch until it resolves (useful for holding up dispatches for side effects that an application might want to have happen after a search). Used internally by subquery. |
| validate | `async () => {}` | A per-node version of validate which will override the type specific validation method. |


### Top Level Exports
A number of utilities are now exposed as top level exports. You can import them like:

```js
import { utilName } from 'contexture-client'
```

| Name | Description |
| ---- | ----------- |
| Tree | A [futil `tree` api](https://smartprocure.github.io/futil-js/#api-trees-tree) pre applied with the right traversals, etc for working with contexture trees (e.g. Tree.walk) |
| `encode` | The futil encoder method used for the internal `flat` tree. Converts a path array to a flat tree key. Currently a slashEncoder. |
| `decode` | The futil decoder method used for the internal `flat` tree. Converts a flat tree key to a path array. Currently a slashEncoder. |
| `hasContext` | An internal utility that determines if a node has a context. Used primarily in custom reactors to help figure out if a node needs updating. |
| `hasValue` | An internal utility that checks if a node has a value and isn't in an error state. Used primarily in custom reactors to help figure out if other nodes would be affected by an event. |
| `exampleTypes` | A set of example types. This will likely be split out in a future version to its own repo. |
| `mockService` | Useful for mocking services during testing. Takes a config object of logInput, logOutput, and a mocks function which will should return results for a node as input (defaults to fixed results by type) and returns a function for use as a `service` for a contexture-client instance. |
| `subquery` | A tool for creating a subquery. See the section below. |


#### Subquery
A subquery (in contexture-client) is about taking the output of one search and making it the input for another search.
This is an in memory, cross-database, "select in" join on sources that don't need to be relational.

This works by providing a source node from which to **get** values, and a target to **use** those values. Logic on how to get and use those values are defined in the client type definitions.

The client exposes a method to create subqueries between two trees as a top level export, with this signature:
`(types, targetTree, targetPath, sourceTree, sourcePath, mapSubqueryValues?)`
It takes `types` (to lookup type specific logic), the tree and path of the source node, and then the tree and path of the target node.
Lastly, it can optionally take a function to override the type logic completely.

Client types need to implement these methods to be used in a subquery if mapSubqueryValues is not provided:

| Function Name | Signature | Explanation |
| ------------- | --------- | ----------- |
| `subquery.getValues` | (sourceNode) => inputValues | Allows a type to be a source node. Returns a list of values (typically an array) from new results for a node of this type. |
| `subQuery.useValues` | (values, targetNode) => valuesToMutate | Allows a type to be a target node. Returns a changeset that can be passed to `mutate` from a list of a values list (the output of a subquery.getValues call) for a node of this type. |

Here's an example implementation, using the `facet` example type:

```js
{
  facet: {
    subQuery: {
      useValues: x => ({ values: x }),
      getValues: x => _.map('name', x.context.options)
    },
    //...
  }
}
```

If you pass `mapSubqueryValues` as the last parameter, you can ignore the `types` parameter. It's signature is `(sourceNode, targetNode, types) => deltasForTargetNodeMutate`.

##### Loading Indicators
A change to the source node in a subquery will immediately mark the target node as marked for update, but will not execute it's search until after the source node has results and the debounce time passes.

Since target nodes are immediately marked for update when source nodes are, this eliminates the "double loading spinner" issue we've seen in other implementations.

Dispatches that result in subquery source nodes being updated will await the updates of the target nodes in their `afterSearch` methods - which means you can get a promise for when the whole thing finishes updating.


### Extending the Client
The client can be enhanced with new types, actions, and reactors.
- Types are the most common form of new functionality to be added and are paired with a type implementation for the contexture for a given provider.
- Actions represent a generic type of change to the tree. Custom actions are a great way to experiment with new functionality before adding it to the core and can directly access a lot of typically inaccessible internals like the `flat` tree (which you shouldn't need for normal use). Actions are added on a per instance basis using `tree.addActions`.
- Reactors can be added to dispatch new event types. Custom reactors are a way to experiment with new functionality before adding it to the core. Reactors are added on a per instance basis using `tree.addReactors`.

## Improvements

For those familiar with the previous client implementation (`DataContext`/`ContextGroup`), this client has a lot of design improvements:

- The update logic now accounts for the join relationship, making it even more precise about when to run searches
- Dispatch (and action methods) return a promise for when it resolves despite debounce, instead of relying on subscribing to when an `updating` observable becomes falsey.
- Much more memory efficient - functional instead of local function copies
- Instant traversals due to flat tree in parallel with nested
- Redux-y API

## Implementation Details
:construction: _More Details Coming Soon._ :construction:

### Process Algorithm

- An action method is called at the top level which:
  - Interally mutates the tree
  - Makes one or more calls to `dispatch` with relevant event data
- For each dispatched event:
  - Validate the entire tree (an async operation)
  - Bubble up the tree from the affected node up to the root, and for each node in the path:
    - Determine affected nodes by calling the reactor for the current event type
    - Mark each affected node for update, or if it is currently paused, mark that it missed updates
  - Trigger an update (which is debounced so it does not run right away)
- When the debounce elapses, an update is triggered:
  - Check if the update should be blocked
    - There may be no affected nodes
    - Some nodes might have erros on validation
  - Prepare for update - on each node that's markedForUpdate:
    - Set the lastUpdateTime to now (to enable dropping stale results later in this process)
    - Set `updating` to true
  - Serialize the search, omitting all temporary state except lastUpdateTime (which the sever will effectively echo back) and deleting nodes that are filter only with no value
  - Execute an actual contexture search
  - For each node in the response:
    - If the path isn't found in the current tree, ignore it
    - If the response is empty, ignore it
    - If the response has a lastUpdateTime earlier than the node in the current tree, ignore it (because it's stale)
    - If not ignoring the update, mutate the node with the result and set `updating` to false
- After all of this, the promise for the action/dispatch resolves (so you can await the entire process)

### Flat Trees

The client maintains a flat tree in addition to the actual tree, which is an object mapped using `flattenTree` from `futil-js`.
The keys are the array paths encoded as a string, currently using a slashEncoder.
This allows path lookups to perform in constant time at `O(1)`, drastically speeds up some of the internal tree operations.
The paths are also stamped on individual nodes for convenience as performing an action on a node requires knowing its path.

### Initialization
On instantiation, the client creates a flat tree representation of the tree and stamps the paths on the nodes.
