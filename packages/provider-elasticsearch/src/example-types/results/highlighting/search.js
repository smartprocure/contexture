import _ from 'lodash/fp.js'
import F from 'futil'
import { getArrayOfObjectsPathsMap, getNestedPathsMap } from './util.js'
import {
  addPathsToRequestSource,
  getRequestHighlightFields,
} from './request.js'
import {
  mergeHighlightsOnSource,
  removePathsFromSource,
  getResponseHighlight,
} from './response.js'

let tags = {
  pre: '<span class="search-highlight">',
  post: '</span>',
}

export let searchWithHighlights = (node, search, schema) => async (body) => {
  // Paths for fields to always include regardless of whether the user included
  // them. They will be removed from the response hits so the user will not
  // receive fields they did not request.
  let pathsToAdd = _.flatten(
    F.mapIndexed(
      (paths, arrayPath) => _.map((path) => `${arrayPath}.${path}`, paths),
      getArrayOfObjectsPathsMap(schema)
    )
  )

  let { addedPaths, ...source } = addPathsToRequestSource(
    schema,
    body._source,
    pathsToAdd
  )

  let response = await search({
    ...body,
    _source: F.omitBlank(source),
    highlight: {
      pre_tags: [tags.pre],
      post_tags: [tags.post],
      number_of_fragments: 0,
      fields: getRequestHighlightFields(schema, node),
    },
  })

  const nestedPathsMap = getNestedPathsMap(
    schema,
    node.highlight?.copySourcePaths
  )

  for (let hit of response.hits.hits) {
    if (hit.highlight) {
      hit.highlight = getResponseHighlight(schema, hit, tags, nestedPathsMap)
    }
    removePathsFromSource(schema, hit, addedPaths)
    if (!node.highlight?.disableMergingOnSource) {
      mergeHighlightsOnSource(schema, hit)
    }
  }

  return response
}
