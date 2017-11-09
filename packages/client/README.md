# contexture-client
The Contexture (aka ContextTree) Client

## :construction: **VERY MUCH WIP** :construction: 

## API

The root function takes three params:

`Tree` - the actual tree
`service` - the async function that calls the contexture server
`config` - instance config




## Improvements
This client has a lot of design improvements over the previous client implementation (DataContext/ContextGroup):

- The client update logic now accounts for the join relationship, making it even more precise about when to run searches.
- Dispatch (and action methods) return a promise for when it resolves despite debounce, instead of relying on subscribing to when an `updating` observable becomes falsey.
- Much more memory efficient - functional instead of local function copies
- Instant traversals due to flat tree in parallel with nested
- Redux-y API
