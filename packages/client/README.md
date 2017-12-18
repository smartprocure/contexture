# contexture-client
The Contexture (aka ContextTree) Client

## :construction: **VERY MUCH WIP** :construction: 

## API

The root function takes three params:

`Tree` - the actual tree
`service` - the async function that calls the contexture server
`config` - instance config



## Features
- Updates individual nodes independently
- Updates only the most minimal set of nodes possible in response to changes
  - Powered by reactors (only/others/all, field/join change, item add/remove, "data/config" property change) which account for and/or/not relationship
- Per node Pause/Resume
  - Keeps track of if it missed updates, allowing it to know if it needs to update on resume or not
- Per node async validation
  - Node types can implement a function to have a node instance pass (return true), be ignored for the search (return false), or block the search (throw)
- Stopping blank searches and eliminating blank nodes (nodes without values)
- Per Node Loading Indicators
- Intelligent Search Debouncing (global debounce and optional per node pausing until results come back)
- Dropping intermediate responses (implementation currently missing)
- Error handling


## Improvements
This client has a lot of design improvements over the previous client implementation (DataContext/ContextGroup):

- The client update logic now accounts for the join relationship, making it even more precise about when to run searches.
- Dispatch (and action methods) return a promise for when it resolves despite debounce, instead of relying on subscribing to when an `updating` observable becomes falsey.
- Much more memory efficient - functional instead of local function copies
- Instant traversals due to flat tree in parallel with nested
- Redux-y API
