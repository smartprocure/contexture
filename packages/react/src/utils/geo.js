import _ from 'lodash/fp'

const defaultHereConfig = {
  app_id: 'KzmI0fMwTyOG10rqZacS', // TEMP EMAIL USED - USE/GET YOUR APP_ID
  app_code: 'PykXtnTUeH7DDM-RLlpwyA', // TEMP EMAIL USED - USE/GET YOUR APP_CODE
  country: 'USA',
  autocomplete: 'http://autocomplete.geocoder.api.here.com/6.2/suggest.json',
  geoCoding: 'http://geocoder.api.here.com/6.2/geocode.json?gen=9',
}

let formatAddress = ({ address, matchLevel }) => {
  let {
    country,
    district,
    city,
    state,
    street,
    county,
    postalCode,
    houseNumber,
  } = address
  street = `${street} ${city}, ${county}, ${state}`
  let geoLevel = {
    country,
    district: `${district} ${city} ${state}`,
    city: `${city} ${county} ${state}`,
    houseNumber: `${houseNumber} ${street}`,
    county: `${county}, ${state}`,
    state: `${state}, ${country}`,
    postalCode: `${city} ${county}, ${state}, ${postalCode}`,
    street,
    intersection: street,
  }
  return geoLevel[matchLevel]
}
export let loadHereOptions = async (
  inputValue,
  hereConfig = defaultHereConfig
) => {
  if (inputValue.length <= 2) return []
  let { autocomplete: url, app_id, app_code, country } = hereConfig
  let apiUrl = `${url}?app_id=${app_id}&app_code=${app_code}&country=${country}&query=${inputValue}`

  let data = await (await fetch(apiUrl)).json()

  if (data.error) {
    console.error('loadHereOptions', data.error)
    throw new Error(data.error)
  } else {
    return _.getOr([], 'suggestions', data).map(d => ({
      label: formatAddress(d),
      value: d.locationId,
    }))
  }
}

export let getLocationInfo = async (
  locationId,
  hereConfig = defaultHereConfig
) => {
  let { geoCoding: url, app_id, app_code } = hereConfig
  let apiUrl = `${url}&app_id=${app_id}&app_code=${app_code}&locationid=${locationId}`

  let data = await (await fetch(apiUrl)).json()

  if (data.error) {
    console.error('geoCodeLocation', data.error)
    throw new Error(data.error)
  } else {
    return _.get('Response.View.0.Result.0', data)
  }
}

export let geoCodeLocation = async (
  locationId,
  hereConfig = defaultHereConfig
) =>
  _.get(
    'Location.DisplayPosition',
    await getLocationInfo(locationId, hereConfig)
  )
