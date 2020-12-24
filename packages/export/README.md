# contexture-export

Contexture Export is a set of [contexture](https://github.com/smartprocure/contexture) utilities to get all of the records from a given tree.

This is accomplished by inserting a node in the tree that gets the data for you over one or more iterations. To do this correctly and efficiently, the tree is wrapped in an `AND` group (in case the root was an `OR`) and recursively marked `filterOnly` (to prevent getting results for any other nodes on the tree).

## Usage
```js
import { results } from 'contexture-export'

let service = Contexture({/*...*/})
let tree = { schema: 'someCollection', children: [/*...*/] }

let export = results({ tree, service, pageSize: 10 })

// Count results
let totalCount = await export.getTotalRecords()

// Stream
let stream = createWriteStream('someFile.txt');
for await (page of export)
  stream.write(page)
stream.end()

// To Array
let array = []
for await (let page of export)
  array = array.concat(page)
```

## API

Methods generally take a tree, service, and node, and return an object that is async iterable with the following methods:

 `getTotalRecords`, `hasNext` and `getNext`. Let's see them
before we examine the input properties:

- `getTotalRecords` is an `async` function that, as the name suggests,
  returns the number of total records in the database.
- `hasNext` is a function that returns a boolean value that indicates
  wether more values can be obtained or not.
- `getNext` is an `async` function that returns the values of the next
  "page". The concept of pages is completely irrelevant for the user,
  we handle it internally. If we can't safely iterate the results, the
  first call to `getNext` will return all the results.

Now, the input properties are dependant on the type we want to
extract, so they change a bit for each one of the available _Data
Strategies_. Each one of them work around our Example Types (read more
about them on [contexture-elasticsearch](https://github.com/smartprocure/contexture-elasticsearch)
and [contexture-mongo](https://github.com/smartprocure/contexture-mongo)).
Let's see what are the available Data Strategies:

- `results`: This strategy extracts the records out of the node with
  `results` type. It's not affected by the position of the
  results node. The parameter it receives are:
  - `service`: (REQUIRED) An async function that will receive a single parameter:
    the Contexture DSL with the changes required to retrieve only the
    necessary data for the _results_ strategy.
  - `tree`: (REQUIRED) The Contexture DSL! It must contain a node with the
    `results` type. It doesn't matter where!
  - `include`: An array with the list of fields that will
    be included on each retrieved record. This is relevant to the
    `results` type. It's undefined by default (which is valid).
  - `sortField`: Specifies what field will be used to sort the data.
    This is relevant to the `results` type. It's undefined by default
    (which is valid).
  - `sortDir`: Specifies in which direction the data will be sorted
    (`asc` or `desc`).  This is relevant to the `results` type. It's
    undefined by default (which is valid).
  - `pageSize`: It allows you to specify how many records per page
    (per call of `getNext`) are returned. It defaults to 100.
  - `page`: Indicates the starting page of the specified search.
    Defaults to 1.
  - `totalPages`: Indicates the maximum number of pages that will be
    obtained. Defaults to 100, but can be set to `Infinite`.
- `terms_stats`: This strategy extracts the records out of a node with
  the `terms_stats` type.
  - `service`: (REQUIRED) An async function that will receive a single parameter:
    the Contexture DSL with the changes required to retrieve only the
    necessary data for the _results_ strategy.
  - `tree`: (REQUIRED) The Contexture DSL! It must contain a node with the
    `results` type. It doesn't matter where!
  - `key_field`: Related to the ES aggregations
    (terms/stats/top_hits).
  - `value_field`: Related to the ES aggregations
    (terms/stats/top_hits).
  - `size`: Indicates the maximum number of records that will be
    obtained. Defaults to 100, but can be set to `0` to get all the
    possible results.
  - `sortDir`: Specifies in which direction the data will be sorted
    (`asc` or `desc`).  This is relevant to the `results` type. It's
    undefined by default (which is valid).

Although these objects can be used for anything you might find
valuable (or not! we won't judge), they're built to be passed onto the
_Export Strategies_, as you'll see in the next section.

### Export Strategies

The Export Strategies are a collection of `async` functions that retrieve each
and every one of the pages (leveraging the _Data Strategies_'
`hasNext` and `getNext` functions) and send the resulting data to
several possible outputs. Here are the available functions:

- `paged`: Receives an object with two properties: `strategy`, which
  holds the result of a perviously initialized Data Strategy, and an
  `onChange` function, which will be called for each available
  `getNext`.
- `bulk`: Receives an object with the Data Strategy on the property `strategy`.
  It will loop over all the available results and answer with an array
  containing all of the available records in one single call.
- `stream`: Receives an object with the Data Strategy on the property
  `strategy`, and a JavaScript Stream on `stream`. It will call
  `write` for each `getNext`, then close the stream.
- `CSVStream`: Receives the `strategy` and a `stream`. It will write a
  CSV header, then each record (also as a string CSV) into the stream.
  It also receives some customization properties: 
  - `onWrite`: called on result chunks each time the `stream` is written. 
  - `formatRules`: contains an object that optionally contains each property of the
  resulting records, which will contain (individually), an object with
  a `label` property (which will determine the name of the column),
  and `display` (which will be used to format each value on the given
  property, for each record). 
  - `omitFieldsFromResult`: specifies fields to be retrieved with result rows but
  not written to the CSV. Use case: you want to track your export by
  some internal _id field on the rows but don't want that field in the CSV.
  - `logger`: allows logging during the CSV construction and write.

You can think of the _Export Strategies_ as simple functions that pipe
each page of results onto anything. They begin being building blocks
for more complex processes (which might be noticeable in the nature of
the progression given on the list of each available function).

## Example Types

Given the Data Strategies and the Export Strategies, we bring back the
concept of Example Types that we share on most of our `contexture-`
repos. The Example Types are (here and everywhere else) intended to be
just mere examples of the possibilities that the underlying
architecture has. In this repo, we haven't incldued example types
(yet!), but here you can see how you can build one:

```javascript
const userExport = ({ service, logger, stream, tree, onWrite }) => {
  let strategy = dataStrategies.results({
    service,
    tree,
    pageSize: 100,
    totalPages: Infinity,
    include: [
      'name',
      'address',
      'phone',
      'email',
    ],
  })

  let formatRules = {
    name: {
      label: 'VIP Member',
      display: x => `Dear ${x}`
    },
  }

  return exportStrategies.CSVStream({
    strategy,
    stream,
    onWrite,
    formatRules,
    logger: (...x) => logger('ContactExport', ...x),
  })
}
```

Which could be used like:
```javascript
await userExport({
  stream,
  tree: someContextureDSL,
  service: x => someSearchService.create(x),
  logger: (...x) => logger.info(`User Export ${x.join(' ')}`),
  async onWrite({ records, totalRecords }) {
    await someDatabaseCollection.patch(id, {
      records,
      totalRecords,
    })
  },
})
```
