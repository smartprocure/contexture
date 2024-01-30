---
'contexture-elasticsearch': minor
---

Remove `subFields` configuration in the schema. Instead only send fields of type
`text` for highlighting. This both simplifies the API and reduces payload to
elastic, as well as fixing an issue where non-text top-level fields such as
`keyword` type fields were being highlighted when they should not be.
