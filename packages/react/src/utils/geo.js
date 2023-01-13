import _ from 'lodash/fp.js'

// HERE maps Sample config. Requires API Key
const defaultConfig = {
  apiKey: 'YOUR_API_KEY_GOES_HERE',
  country: 'USA',
  minCharacters: 3,
  lookup: 'https://lookup.search.hereapi.com/v1/lookup',
  geoCoding: 'https://geocode.search.hereapi.com/v1/geocode',
  autoComplete: 'https://autocomplete.search.hereapi.com/v1/autocomplete',
}

// Autocomplete
export let loadOptions = async (input, config = {}) => {
  let finalConfig = _.defaults(defaultConfig, config)
  let { autoComplete: url, apiKey, country, minCharacters } = finalConfig
  // Do nothing until we have more characters than the minimum allowed
  if (input.length < minCharacters) return []

  let apiUrl = `${url}?apiKey=${apiKey}&in=countryCode:${country}&q=${encodeURIComponent(
    input
  )}`
  let data = await (await fetch(apiUrl)).json()

  if (data.error) {
    console.error('geo > loadOptions error:', data.error)
    throw new Error(data.error)
  } else {
    return _.getOr([], 'items', data).map(suggestion => ({
      label: _.get('address.label', suggestion),
      value: _.get('id', suggestion),
    }))
  }
}

// Lookup by location Id
export let lookupByLocationId = async (locationId, config) => {
  let { lookup: url, apiKey } = config
  let apiUrl = `${url}?apiKey=${apiKey}&id=${locationId}`
  return (await fetch(apiUrl)).json()
}

// Geocode by provided string input
export let geoCodeLocation = async (string, config = {}) => {
  let { geoCoding: url, apiKey } = _.defaults(defaultConfig, config)
  let apiUrl = `${url}?apiKey=${apiKey}&q=${encodeURIComponent(string)}`
  return (await fetch(apiUrl)).json()
}
