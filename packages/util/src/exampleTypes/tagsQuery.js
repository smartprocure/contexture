// These are reserved characters in the context of an elastic `query_string`
// query that are unlikely to be searched for by an user.
// See https://www.elastic.co/guide/en/elasticsearch/reference/current/query-dsl-query-string-query.html#_reserved_characters
let queryStringReserved = `|!(){}[\\]^"~*?\\<>`

// These are characters stripped out by our analyzers so there's no point in
// sending them.
let strippedByAnalyzers = `;,$'`

// Characters that we should strip out from `query_string` queries before
// sending to elastic.
export let queryStringCharacterBlacklist = `${queryStringReserved}${strippedByAnalyzers}`
