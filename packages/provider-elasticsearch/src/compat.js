// Detect if ElasticSearch client is at least version 8 by detecting whether an
// `extend` method exists on it.
//
// @see https://www.elastic.co/guide/en/elasticsearch/client/javascript-api/8.0/changelog-client.html#_remove_client_extensions_api
export function isAtLeastVersion8(client) {
  return !client.extend
}
