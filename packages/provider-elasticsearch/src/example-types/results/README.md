# Included fields

TODO: Talk about include/exclude and how highlighting gets affected by it

If fields inside arrays of objects are specified in `node.include` (after wildcards are expanded), they will be also included in the highlighted results for the array of objects regardless of whether they are excluded from source.

# Highlighting

Our approach to highlighting is designed to be as out of the box as possible, without too many configuration options. See `./type.d.ts` for more details on the API.

There are three pieces involved in highlighting:

1. Building out highlight configuration to send with an elastic request.
2. Transforming highlighted fragments in the elastic response into a structure similar to that of `_source`.
3. Merging such structure into a hit's `_source`.

## 1. Request

### Fields sent for highlighting

We assume that users want to highlight all the fields present in the query. The most logical approach is to extract relevant fields from the query and send them for highlighting, but for simplicity's sake we send every field in the schema, with some caveats.

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
      // `{field}.exact` will be sent for highlighting.
      "exact": { "highlight": true }
    }
  },
  "fields": {
    // `state` will be sent for highlighting.
    "state": {
      "elasticsearch": {
        "fields": {
          "keyword": {},
          // `state.exact` will be sent for highlighting.
          "exact": {}
        }
      }
    }
  }
}
```

</details>

#### 2. Fields groups

Fields groups are not sent for highlighting because we assume users want to highlight fields that were copied over instead of the fields groups themselves:

<details>

<summary>schema.json</summary>

```jsonc
{
  "fields": {
    // `address` won't be sent for highlighting since it's a field group.
    "address": {
      "elasticsearch": {}
    },
    // `state` will be sent for highlighting.
    "state": {
      "elasticsearch": {
        "copy_to": ["address"]
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

In the spirit of keeping our API simple, we generate opinionated highlighting configuration for large text blobs to improve highlighting performance. More often than not, it makes sense to only display highlighted fragments instead of the whole blob for these types of fields. Since elastic does not have a "blob" or "large text" type, we've adopted the convention of specifying a field's "subType" using elastic's [meta property](https://www.elastic.co/guide/en/elasticsearch/reference/8.11/mapping-field-meta.html):

<details>

<summary>schema.json</summary>

```jsonc
{
  "fields": {
    "donQuixoteText": {
      "elasticsearch": {
        "meta": {
          "subType": "blob"
        }
      }
    }
  }
}
```

</details>

## 2. Response

Currently the only supported behavior is to merge highlighted fragments into `_source` (we may provide an option to opt-out in the future). For this approach to work, fragments must contain the entire field value, so we set [number_of_fragments](https://www.elastic.co/guide/en/elasticsearch/reference/current/highlighting.html#highlighting-settings) to `0` in the request. The exception being blob text fields which set `number_of_fragments` to something `> 0` since they're too big to highlight in their entirety.

Assumming `exact` to be a sub-field of `details`, the following rules apply when transforming the highlight response:

#### 1. Text fields

The first fragments of each field (which should contain the entire field value because of `number_of_fragments: 0`) are merged into a single fragment

```json
{
  "details": ["The <em>lazy</em> fox"],
  "details.exact": ["<em>The</em> lazy fox"]
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
  "details.exact": ["<em>The</em> lazy fox", "<em>jumped</em> over"]
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

Elastic doesn't have a concept of array fields, so we rely again on the `subType` convention used for text blobs to identify them

<details>

<summary>schema.json</summary>

```jsonc
{
  "fields": {
    "gloriousArrayField": {
      "elasticsearch": {
        "meta": {
          "subType": "array"
        }
      }
    }
  }
}
```

</details>

which allows us to order highlighted array items based on the source array (as long as the source array is present in the response)

<details>

<summary>scalar-array.test.js</summary>

```javascript
import assert from 'node:assert'

const hit = {
  _source: {
    names: ['John', 'Smith', 'Jane', 'Austen'],
  },
  highlight: {
    names: ['<em>Austen</em>', '<em>Smith</em>'],
  },
}

// `fn` is just for illustration purposes
const actual = fn(hit.highlight.names, hit._source.names)

const expected = [undefined, '<em>Smith</em>', undefined, '<em>Austen</em>']

assert.deepEqual(actual, expected)
```

</details>

Ideally elastic's response would include enough information to deduce the array index for each highlighted fragment but unfortunately this is still [an open issue](https://github.com/elastic/elasticsearch/issues/7416).

Arrays of objects are equally ordered. Additionally, their structure is made to follow the source array's structure

<details>

<summary>object-array.test.js</summary>

```javascript
import assert from 'node:assert'

const hit = {
  _source: {
    people: [
      { name: 'John' },
      { name: 'Smith' },
      { name: 'Jane' },
      { name: 'Austen' },
    ],
  },
  highlight: {
    'people.name': ['<em>Austen</em>', '<em>Smith</em>'],
  },
}

// `fn` is just for illustration purposes
const actual = fn(hit.highlight['people.name'], hit._source.people)

const expected = [
  undefined,
  { name: '<em>Smith</em>' },
  undefined,
  { name: '<em>Austen</em>' },
]

assert.deepEqual(actual, expected)
```

</details>

## 3. Source Merging

Merging highlighted results into `_source` is done via a straightforward lodash's `merge`. Highlighted fields not present in `_source` still get merged onto it.

Arrays get special treatment when `filterSourceArrays` is set: non-highlighted items are discarded.
