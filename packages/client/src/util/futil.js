let _ = require('lodash/fp')

// Sugar for checking non empty intersection
export let intersects = (a, b) => !_.isEmpty(_.intersection(a, b))

// Sets up basic event emitter/listener registry with an array of listeners per topic
//  e.g. listeners: { topic1: [fn1, fn2, ...], topic2: [...], ... }
// maybe better named pubsub with pub/sub methods?
// also might be something off the shelf to use
export let eventEmitter = (listeners = {}) => ({
    listeners,
    emit: (topic, ...args) => _.over(listeners[topic])(...args),
    on: (topic, fn) => {
      if (!listeners[topic]) listeners[topic] = []
      listeners[topic].push(fn)
      // unlisten
      return () => {
        listeners[topic] = _.without(fn, listeners[topic])
      }
    },
  })