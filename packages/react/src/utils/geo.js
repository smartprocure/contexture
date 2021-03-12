import _ from 'lodash/fp'

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
export let loadOptions = async (
  inputValue,
  config = defaultConfig
) => {
  let { autoComplete: url, apiKey, country, minCharacters } = config
  // Do nothing until we have more characters than the minimum allowed
  if (inputValue.length < minCharacters) return []
  // Compose the actual HERE API url
  let apiUrl = `${url}?apiKey=${apiKey}&in=countryCode:${country}&q=${inputValue}`
  let data = await (await fetch(apiUrl)).json()

  if (data.error) {
    console.error('loadHereOptions', data.error)
    throw new Error(data.error)
  } else {
    return _.getOr([], 'items', data).map(suggestion => ({
      label: _.get('address.label', suggestion),
      value: _.get('id', suggestion),
    }))
  }
}
// Lookup by location Id
export let getLocationInfo = async (
  locationId,
  config = defaultConfig
) => {
  let { lookup: url, apiKey } = config
  // Compose the actual HERE API url
  let apiUrl = `${url}?apiKey=${apiKey}&id=${locationId}`
  return (await fetch(apiUrl)).json()
}
// Lat/Lng conversion from and Id
export let geoCodeLocation = async (
  locationId,
  config = defaultConfig
) => {
  let { lat: latitude, lng: longitude } = _.get('position', await getLocationInfo(locationId, config))
  return { latitude, longitude }
}
