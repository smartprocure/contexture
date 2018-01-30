From index:

// TODO
//   rearg contexture so types + service can be curried first and reused in app - add two options obj and merge (so we can have defaults)

//TODO
//  unify notify subscribers with dispatch/mutate
// subscribe(path, fn, type), fn: (delta, node) -> null

// TODO
// types (validate, to(Human)String, defaults?, hasContext)
// schemas?
// subscriptions (e.g. cascade)
// make sure all locally tracked props are in _meta or something like that
//    Constrain all update to an update meta method which can be overriden to support observables and notifications
//  both kinds of pausing - normal and queue paused
// sergvice adapter: schema transform + contextMap (should be solved with custom serialize + server aliasing)
// subquery/savedsearch
// tree lenses
// broadcast pausing, just hold on to dispatches?
// Add
//   never updated
