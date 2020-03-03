import _ from 'lodash/fp'

let typeDefaults = {
  name: 'text',
  unified: 'text',
  non_qualified: 'text',
  docomo: null,
  au: 'text',
  softbank: 'text',
  google: 'text',
  image: 'text',
  sheet_x: 'number',
  sheet_y: 'number',
  short_name: 'text',
  short_names: 'text',
  text: null,
  texts: null,
  category: 'facet',
  sort_order: 'number',
  added_in: 'text',
  has_img_apple: 'bool',
  has_img_google: 'bool',
  has_img_twitter: 'bool',
  has_img_facebook: 'bool',
  skin_variations: 'facet',
  obsoletes: 'facet',
  obsoleted_by: 'facet',
}

export let schema = _.mapValues(typeDefault => ({ typeDefault }), typeDefaults)
