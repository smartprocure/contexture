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
for await (let record of report)
  stream.write(record)
stream.end()

// To Array
let array = []
for await (let record of report)
  array = array.concat(record)

// To array with it-all
import all from 'it-all'
let array = await all(report)
```

### CSV Usage
Using our fast-csv wrapper, you can pass it a write stream, async iterable, and transforms based on contexture schemas

```js
import _ from 'lodash/fp'
import { createWriteStream } from 'fs'
import { results, csv } from 'contexture-export'

let service = Contexture({/*...*/})
let tree = { schema: 'someCollection', children: [/*...*/] }
let schema = { field1: {/*...*/} }

await csv(
  stream: createWriteStream('./test/actualFile.csv'),
  iterableData: results({ service, tree }),
  transform: [
    {key: 'name', label: 'THE,NAME', display: _.capitalize},
    {key: 'value', label: 'Value', display: _.identity},
  ],
)
```

## API

- `nodes`: Correspond to contexture nodes
    - `results`: This strategy extracts the records out of the node with
      `results` type. It's not affected by the position of the
      results node.
        - args:
            - `options`: object
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
        - return:
            - iterableObject
                - `getTotalRecords`: function, returns the number of total records
    - `terms_stats`:
        - args:
            - `options`: object
                - `service`: (REQUIRED) An async function that will receive a single parameter:
                  the Contexture DSL with the changes required to retrieve only the
                  necessary data for the _results_ strategy.
                - `tree`: (REQUIRED) The Contexture DSL! It must contain a node with the
                  `results` type. It doesn't matter where!
                - `key_field`: The field to calculate stats for
                - `size`: the number of records to perfom the stats on

- `csv`: writes csv data to a stream. The parameter it receives are:
    - args:
        - `options`: object
            - stream, // writable stream target stream
            - `iterableData`: an iterable data object where each iteraction yields an object
            - `transform`: order list of which indicates the header label,
              display function for the field,and key of the record. `[{ key: string, label: string, display: funciton}...]`
            - `onWrite`: function to intercept writing a records, recieves `{recordsWriten: int, record: object}`
    - return:
        - object
            - `cancel`: function, stops the writing to the stream
            - `promise`: resolves when the writing is complete
