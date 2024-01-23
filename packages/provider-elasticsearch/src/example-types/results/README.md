# Highlighting

Our approach to highlighting is designed to be as out of the box as possible, without too many configuration options. See [./type.d.ts](./type.d.ts) for more details on the API.

## 1. Request

### Fields included in `_source`

For the most part, we pass the results node `include` and `exclude` properties verbatim to elastic. We do however include paths for fields in arrays of objects as-needed (e.g. if not already included). This is strictly an implementation detail that allows us to correlate highlighted results for arrays of objects to the array items they belong to. Fields that were not originally included in the results node are removed from the response since it would be surprising for users to get values for fields they did not request.

### Fields sent for highlighting

We assume that users want to highlight all the fields present in the query. The most logical approach is to extract relevant fields from the query and send them for highlighting, but for simplicity's sake we send every field in the schema, with the following caveats.

#### 1. Sub-fields

Whitelisted sub-fields are sent for highlighting, since they could be present in the query:

<details>

<summary>schema.json</summary>

```jsonc
{
  "elasticsearch": {
    "subFields": {
      // `{field}.keyword` will *not* be sent for highlighting.
      "keyword": { "highlight": false },
      // `{field}.subfield` will be sent for highlighting.
      "subfield": { "highlight": true }
    }
  },
  "fields": {
    // `state` will be sent for highlighting.
    "state": {
      "elasticsearch": {
        "mapping": {
          "fields": {
            "keyword": {},
            // `state.subfield` will be sent for highlighting.
            "subfield": {}
          }
        }
      }
    }
  }
}
```

</details>

#### 2. Group fields

Group fields are not sent for highlighting because we assume users want to highlight fields that were copied over instead of the group fields themselves:

<details>

<summary>schema.json</summary>

```jsonc
{
  "fields": {
    // `address` won't be sent for highlighting since it's a group field.
    "address": {
      "elasticsearch": {}
    },
    // `state` will be sent for highlighting.
    "state": {
      "elasticsearch": {
        "mapping": {
          "copy_to": ["address"]
        }
      }
    }
  }
}
```

</details>

However, this presents a problem since elastic only highlights fields contained in the query by default:

<details>

<summary>request.json</summary>

```jsonc
{
  "query": {
    "match": {
      "address": {
        "query": "memphis"
      }
    }
  },
  "highlight": {
    "fields": {
      "state": {} // Won't be highlighted.
    }
  }
}
```

</details>

In order to fix this, we make use of elastic's [highlight_query](https://www.elastic.co/guide/en/elasticsearch/reference/current/highlighting.html#highlighting-settings), which allows us to set a query per-field for highlighting purposes:

<details>

<summary>request.json</summary>

```jsonc
{
  "query": {
    "match": {
      "address": {
        "query": "memphis"
      }
    }
  },
  "highlight": {
    "fields": {
      "state": {
        "highlight_query": {
          "match": {
            // `address` is replaced by `state`
            "state": {
              "query": "memphis"
            }
          }
        }
      }
    }
  }
}
```

</details>

#### 3. Text blobs

In the spirit of keeping our API simple, we generate opinionated highlighting configuration for large text blobs to improve highlighting performance. More often than not, it makes sense to only display highlighted fragments instead of the whole blob for these types of fields. Since elastic does not have a "blob" or "large text" type, we've adopted the convention of specifying a field's "subType" in the schema:

<details>

<summary>schema.json</summary>

```jsonc
{
  "fields": {
    "donQuixoteText": {
      "subType": "blob"
    }
  }
}
```

</details>

## 2. Response

Currently the only supported behavior is to merge highlighted fragments into `_source` (we may provide an option to opt-out in the future). For this approach to work, fragments must contain the entire field value, so we set [number_of_fragments](https://www.elastic.co/guide/en/elasticsearch/reference/current/highlighting.html#highlighting-settings) to `0` in the request. The exception being blob text fields which set `number_of_fragments` to a number `> 0` since they're too big to highlight in their entirety.

Assumming `subfield` to be a sub-field of `details`, the following rules apply when transforming the highlight response:

#### 1. Text fields

The first fragments of each field (which should contain the entire field value because of `number_of_fragments: 0`) are merged into a single fragment

```json
{
  "details": ["The <em>lazy</em> fox"],
  "details.subfield": ["<em>The</em> lazy fox"]
}
```

will be transformed into

```json
{
  "details": "<em>The</em> <em>lazy</em> fox"
}
```

Merging of highlighted fragments could be handled by elastic but this is still [an open issue](https://github.com/elastic/elasticsearch/issues/5172).

#### 2. Blob text fields

Blob text fields fragments are concatenated because that's the only sensible thing to do:

```json
{
  "details": ["The <em>lazy</em> fox", "jumped <em>over</em>"],
  "details.subfield": ["<em>The</em> lazy fox", "<em>jumped</em> over"]
}
```

will be transformed into

```json
{
  "details": [
    "The <em>lazy</em> fox",
    "jumped <em>over</em>",
    "<em>The</em> lazy fox",
    "<em>jumped</em> over"
  ]
}
```

#### 3. Array fields

Elastic doesn't have a concept of array fields, so we rely on the `subType` convention used for text blobs to identify them

<details>

<summary>schema.json</summary>

```jsonc
{
  "fields": {
    "library.books": {
      "subType": "array"
    }
  }
}
```

</details>

which allows us to order highlighted array items based on the source array

<details>

<summary>scalar-array.test.js</summary>

```javascript
import assert from 'node:assert'

let hit = {
  _source: {
    names: ['John', 'Smith', 'Jane', 'Austen'],
  },
  highlight: {
    names: ['<em>Austen</em>', '<em>Smith</em>'],
  },
}

// `fn` is just for illustration purposes
let actual = fn(hit.highlight.names, hit._source.names)

let expected = {
  1: '<em>Smith</em>',
  3: '<em>Austen</em>',
}

assert.deepEqual(actual, expected)
```

</details>

Ideally elastic's response would include enough information to deduce the array index for each highlighted fragment but unfortunately this is still [an open issue](https://github.com/elastic/elasticsearch/issues/7416).

Arrays of objects are equally ordered. Additionally, their structure follows the source array's structure

<details>

<summary>object-array.test.js</summary>

```javascript
import assert from 'node:assert'

let hit = {
  _source: {
    friends: [
      { name: 'John', age: 34 },
      { name: 'Smith', age: 21 },
      { name: 'Jane', age: 83 },
      { name: 'Austen', age: 3 },
    ],
  },
  highlight: {
    'friends.name': ['<em>Austen</em>', '<em>Smith</em>'],
  },
}

// `fn` is just for illustration purposes
let actual = fn(hit.highlight['friends.name'], hit._source.friends)

let expected = {
  1: { name: '<em>Smith</em>' },
  3: { name: '<em>Austen</em>' },
}

assert.deepEqual(actual, expected)
```

</details>

The paths specified in `copySourcePaths` are handled when ordering the array of objects. Assumming the example above and

```javascript
let copySourcePaths = ['friends.age']
```

the highlighted results become

```javascript
{
  1: { name: '<em>Smith</em>', age: 21 },
  3: { name: '<em>Austen</em>', age: 3 },
}
```
