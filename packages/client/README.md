# contexture-client
The Contexture (aka ContextTree) Client

[![npm version](https://badge.fury.io/js/contexture-client.svg)](https://badge.fury.io/js/contexture-client)
[![CircleCI](https://circleci.com/gh/smartprocure/contexture-client.svg?style=svg)](https://circleci.com/gh/smartprocure/contexture-client)
[![Greenkeeper badge](https://badges.greenkeeper.io/smartprocure/contexture-client.svg)](https://greenkeeper.io/)

## Overview
This library manages the state of a contexture tree to automatically run only the optimal minimal amount of searches possible.

The general flow looks like this

- Instantiate a client with a tree (and some config)
- `dispatch` events that the client intelligently reacts to and runs searches if needed
- To keep it easy, the client also exposes top level `actions` that dispatches one or more events

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
- Stopping blank searches and eliminating blank nodes (nodes without values)
- Per Node Loading Indicators
- Intelligent Search Debouncing (global debounce and optional per node pausing until results come back)
- Dropping intermediate responses (implementation currently missing)
- Error handling


## API

### Instantiation

The root function takes two parameters, `config` and actual `tree` instance. It's curried, so you can call it like this:

```js
ContextTree({...config}, tree)
```
or

```js
ContextTree({...config})(tree)
```

if you want to pre apply it with config.

#### Config
The following config options are available:

| Name       | Type                           | Default      | Description |
| ----       | ----                           | -------      | ----------- |
| service    | function                       | n/a          | **Required** Async function to actually get service results (from the contexture core). An exception will be thrown if this is not passed in. |
| types      | ClientTypeSpec                 | exampleTypes | Configuration of available types (documented below) |
| debounce   | number                         | 1            | How many milliseconds to globally debounce search |
| onResult   | (path, response, target) => {} |  _.noop      | A hook to capture when the client updates a node with results from the server |
| allowBlank | boolean                        | false        | Whether or not the client will run blank searches |
| debug      | boolean                        | false        | Debug mode will log all dispatched events and generally help debugging |
| extend     | function                       | F.extendOn   | Used to mutate nodes internally |
| snapshot   | function                       | _.cloneDeep  | Used to take snapshots |

#### Client Types
Available types are passed in as config.

This is the general structure:

```js
{
  TypeName: {
    validate: async node => true || false || throw Exception()
    reactors: {
      fieldName: 'reactor',
      field2...
    }
  },
  Type2....
}
```

### Run Time
The following methods are exposed on an instantiated client

| Name | Signature | Description |
| ---- | --------- | ----------- |
| add | `async (path, newNode) -> await searchCompleted` | Adds a node to the tree as a child of the specified path. You can await this for when updates settle and relevant searches are completed. |
| remove | `async path -> await searchCompleted` | Removes a node at the specified path. You can await this for when updates settle and relevant searches are completed. |
| mutate | `async (path, deltas) -> await searchCompleted` | Mutates the node at the given path with the new values. You can await this for when updates settle and relevant searches are completed. |
| dispatch | `async event -> await searchCompleted` | The core method of interaction. Events are dispatched by the user, reacted to by the system, and searches are automatically run as needed. You can await this for when updates settle and relevant searches are completed. |
| getNode | `[path] -> node` | Lookup a node by a path (array of keys). |
| serialize | `() => tree` | Returns a snapshot of the tree without any of the temporary state like updating flags. |
| tree | tree | A reference to the internal tree. If you mutate this, you should dispatch an appropriate event. |

## Improvements

For those familiar with the previous client implementation (`DataContext`/`ContextGroup`), this client has a lot of design improvements:

- The update logic now accounts for the join relationship, making it even more precise about when to run searches
- Dispatch (and action methods) return a promise for when it resolves despite debounce, instead of relying on subscribing to when an `updating` observable becomes falsey.
- Much more memory efficient - functional instead of local function copies
- Instant traversals due to flat tree in parallel with nested
- Redux-y API

## Implementation Details

### Process Algorithm
:construction: _Coming Soon._ :construction:

