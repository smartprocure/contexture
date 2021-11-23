ES mappings are returned with different shapes depending on the elasticsearch version.
This is a breakdown of those differences with JSON examples.

## es5
  - allows multple types per index.
  - GET INDEX/_mapping shows type names.

After:
POST /twitter/users
POST /twitter/tweets

GET twitter/_mapping
```json
{
  "twitter": {
    "mappings": {
      "users": {
        "properties": {
          "message": {
            "type": "text",
            "fields": {
              "keyword": {
                "type": "keyword",
                "ignore_above": 256
              }
            }
          },
          "post_time": {
            "type": "date"
          },
          "username": {
            "type": "text",
            "fields": {
              "keyword": {
                "type": "keyword",
                "ignore_above": 256
              }
            }
          }
        }
      },
      "tweets": {
        "properties": {
          "message": {
            "type": "text",
            "fields": {
              "keyword": {
                "type": "keyword",
                "ignore_above": 256
              }
            }
          },
          "post_time": {
            "type": "date"
          },
          "username": {
            "type": "text",
            "fields": {
              "keyword": {
                "type": "keyword",
                "ignore_above": 256
              }
            }
          }
        }
      }
    }
  }
}
```

## es6
  - allows a type to be specified when POSTing but only one type is allowed.
    - If no type specified, _doc is used.
  - GET INDEX/_mapping shows type names.
  - not sure how to import an es5 index to see what multi-type looks like.

After:
POST /twitter/tweets

GET twitter/_mapping
```json
{
  "twitter": {
    "mappings": {
      "tweets": {
        "properties": {
          "message": {
            "type": "text",
            "fields": {
              "keyword": {
                "type": "keyword",
                "ignore_above": 256
              }
            }
          },
          "post_time": {
            "type": "date"
          },
          "username": {
            "type": "text",
            "fields": {
              "keyword": {
                "type": "keyword",
                "ignore_above": 256
              }
            }
          }
        }
      }
    }
  }
}
```

After:
POST /twitter

GET twitter/_mapping
```json
{
  "twitter": {
    "mappings": {
      "_doc": {
        "properties": {
          "message": {
            "type": "text",
            "fields": {
              "keyword": {
                "type": "keyword",
                "ignore_above": 256
              }
            }
          },
          "post_time": {
            "type": "date"
          },
          "username": {
            "type": "text",
            "fields": {
              "keyword": {
                "type": "keyword",
                "ignore_above": 256
              }
            }
          }
        }
      }
    }
  }
}
```

## es7
  - allows a type to be specified when POSTing but only one type allowed.
  - If no type specified, _doc is used.
  - GET INDEX/_mapping DOES NOT show the type.
  - GET INDEX/_mapping?include_type_name DOES show the type.

After:
POST /twitter/tweets

GET twitter/_mapping
```json
{
  "twitter": {
    "mappings": {
      "properties": {
        "message": {
          "type": "text",
          "fields": {
            "keyword": {
              "type": "keyword",
              "ignore_above": 256
            }
          }
        },
        "post_time": {
          "type": "date"
        },
        "username": {
          "type": "text",
          "fields": {
            "keyword": {
              "type": "keyword",
              "ignore_above": 256
            }
          }
        }
      }
    }
  }
}
```

After:
POST /twitter/tweets

GET twitter/_mapping?include_type_name
```json
{
  "twitter": {
    "mappings": {
      "tweets": {
        "properties": {
          "message": {
            "type": "text",
            "fields": {
              "keyword": {
                "type": "keyword",
                "ignore_above": 256
              }
            }
          },
          "post_time": {
            "type": "date"
          },
          "username": {
            "type": "text",
            "fields": {
              "keyword": {
                "type": "keyword",
                "ignore_above": 256
              }
            }
          }
        }
      }
    }
  }
}
```
