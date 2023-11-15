## Request

Our approach to highlighting is designed to be as out of the box as possible, without too many configuration options.

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

## Response

Currently the only supported behavior is to merge highlighted fields into source fields (we may provide an option to opt-out in the future). Fields present in the highlighted results but not in the source still get merged onto the source. For this approach to work, the highlighted fields must contain the entire field value (as opposed to only fragments), so we set [number_of_fragments](https://www.elastic.co/guide/en/elasticsearch/reference/current/highlighting.html#highlighting-settings) to `0` in the request. The exception being blob text fields which we default to return highlighted fragments instead of the entire highlighted value.

Before merging, highlighted results need to be transformed. Assumming `exact` to be a sub-field of `details`, the following rules apply:

#### 1. Text fields

The first fragments of each field (which should contain the entire field value because of `number_of_fragments: 0`) are merged into one value

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

Blob text fields get their highlighted fragments joined, because there is no other behavior we could take here:

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

which allows us to order highlighted array items based on the source array (as long as it's present)

<details>

<summary>ordering.test.js</summary>

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

const actual = order(hit.highlight.names, hit._source.names)
const expected = [undefined, '<em>Smith</em>', undefined, '<em>Austen</em>']

assert.deepEqual(actual, expected)
```

</details>

Ideally elastic's response would include enough information to deduce the array index for each highlighted fragment but unfortunately this is still [an open issue](https://github.com/elastic/elasticsearch/issues/7416).
