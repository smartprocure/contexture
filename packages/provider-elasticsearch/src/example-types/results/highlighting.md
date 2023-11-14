# Request

### Fields sent for highlighting

Our approach to highlighting is designed to be as out of the box as possible, without too many configuration options. We assume by default that users want to highlight all the fields present in their query. In order to achieve this, the most logical approach is to extract relevant fields from the elastic query and send them for highlighting, but instead we send every field in the schema for simplicity's sake (with the exception of fields groups). For example, given the following schema:

```json
{
  "fields": {
    "address": {
      "elasticsearch": {}
    },
    "state": {
      "elasticsearch": {
        "copy_to": ["address"]
      }
    },
    "city.street": {
      "elasticsearch": {
        "copy_to": ["address"]
      }
    }
  }
}
```

The fields `state` and `city.street` will be sent for highlighting, but the fields group `address` will be ommitted.

Whitelisted sub-fields (as defined by the schema) are also sent for highlighting, since they could be present in the query. For example, given the following schema:

```json
{
  "elasticsearch": {
    "subFields": {
      "keyword": { "highlight": false },
      "exact": { "highlight": true }
    }
  },
  "fields": {
    "state": {
      "elasticsearch": {
        "fields": { "keyword": {}, "exact": {} }
      }
    },
    "city.street": {
      "elasticsearch": {
        "fields": { "keyword": {}, "exact": {} }
      }
    }
  }
}
```

The fields `state`, `state.exact`, `city.street`, and `city.street.exact` will be sent, since the `exact` sub-field is whitelisted for highlighting in the schema's `elasticsearch.subFields` configuration.

> Explain how in the future we could pick up fields from the query itself (handling fields groups and wildcards), to reduce the payload sent to elastic.

### Highlight queries

> [!NOTE]
> Elastic only highlights fields contained in the query by default, for example in the following query:
>
> ```json
> {
>   "query": {
>     "match": {
>       "city": { "query": "memphis" }
>     }
>   },
>   "highlight": {
>     "fields": {
>       "city": {},
>       "state": {}
>     }
>   }
> }
> ```
>
> `city` will get highlighted but `state` won't since it's not in the query.

Explain how text blobs get picked up from the schema and what configuration gets generated for them.

Explain why we need to set a highlight query on certain fields

## Response stage

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
