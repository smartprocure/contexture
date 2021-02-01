# contexture-export

Contexture Export is a set of [contexture](https://github.com/smartprocure/contexture) utilities to get all of the records from a given tree.

This is accomplished by inserting a node in the tree that gets the data for you over one or more iterations. To do this correctly and efficiently, the tree is wrapped in an `AND` group (in case the root was an `OR`) and recursively marked `filterOnly` (to prevent getting results for any other nodes on the tree).

## Usage

### Simple usage
```js
import { results } from 'contexture-export'

let service = Contexture({/*...*/})
let tree = { schema: 'someCollection', children: [/*...*/] }

let report = results({ tree, service, pageSize: 10 })

// Count results
let totalCount = await report.getTotalRecords()

// Stream
let stream = createWriteStream('someFile.txt');
for await (page of report)
  stream.write(page)
stream.end()

// To Array
let array = []
for await (let page of report)
  array = array.concat(page)

// To array with it-all
import all from 'it-all'
let array = await all(report)
```

### CSV Usage
Using our fast-csv wrapper, you can pass it a write stream, async iterable, and transforms based on contexture schemas

```js
import { createWriteStream } from 'fs'
import { schemaToCSVTransforms, results, csv } from 'contexture-export'

let service = Contexture({/*...*/})
let tree = { schema: 'someCollection', children: [/*...*/] }
let schema = { field1: {/*...*/} }

await csv.writeToStream(
  createWriteStream('./test/actualFile.csv'),
  results({ service, tree }),
  schemaToCSVTransforms(schema)
)
```

## API

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

- `csv`
  - `writeToStream`: function for writing csv data to a stream
      - `stream`: a writable stream
      - `data`: an iterable set of records, usually the return value of `results`
      - `config`: config that gets passed to `format` see below
  - `format`: our wrapper method around fast-csv with some extra options, see the following
      - `transformHeaders`: function to convert the formatting of the headers
      - `transformaedHeaders`: an object mapping the expected keys to the desired value of the header. `transformHeaders` will be ignored if this is defined.
      - `onWrite`: a callback that gets called incrementally and pssed an object with `records` that is the number of records written
      - `includeEndRowDelimiter`: overrides the default `false` in fast-csv to `true` but can be set to false again if no newline at the end of the file is desired.
