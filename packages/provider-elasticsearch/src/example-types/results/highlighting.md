## Request

Our approach to highlighting is designed to be as out of the box as possible, without too many configuration options.

### Fields sent for highlighting

We assume that users want to highlight all the fields present in the query. The most logical approach is to extract relevant fields from the query and send them for highlighting, but for simplicity's sake we send every field in the schema, with some caveats.

#### Sub-fields

Whitelisted sub-fields are sent for highlighting, since they could be present in the query:

**schema.json**

```jsonc
{
  "elasticsearch": {
    "subFields": {
      // `{field}.keyword` will be sent for highlighting.
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

#### Fields groups

Fields groups are not sent for highlighting because we assume users want to highlight fields that were copied over instead of the fields groups themselves:

**schema.json**

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

However, this presents a problem since elastic only highlights fields contained in the query by default:

**request.json**

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

In order to fix this, we make use of elastic's [highlight_query](https://www.elastic.co/guide/en/elasticsearch/reference/current/highlighting.html#highlighting-settings), which allows us to set a per-field query for highlighting purposes:

**request.json**

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

#### Text blobs

In the spirit of keeping our API simple, we generate opinionated highlighting configuration for large text blobs to improve highlighting performance. More often than not, it makes sense to only display highlighted fragments instead of the whole blob for these types of fields. Since elastic does not have a "blob" or "large text" type, we've adopted the convention of specifying a field's "subType" using elastic's [meta property](https://www.elastic.co/guide/en/elasticsearch/reference/8.11/mapping-field-meta.html):

**schema.json**

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

## TODO: Response stage

Explain `number_of_fragments` if behavior is to replace source values

Explain current behavior of replacing source values (even when source values are missing) with highlighted results and how in the future we could not do this.

Explain that subfields get collapsed into their multifields

Explain how fragments get handled for each field depending on its mapping type

- noop for text blob fragments
- merge fragments into source array (elaborate)
  - when source is missing
  - when source is present
  - when `filterSourceArrays` is passed
- merge fragments otherwise
