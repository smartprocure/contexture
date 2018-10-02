import _ from 'lodash/fp'

const hereConfig = {
  app_id: 'KzmI0fMwTyOG10rqZacS', // TEMP EMAIL USED - USE/GET YOUR APP_ID
  app_code: 'PykXtnTUeH7DDM-RLlpwyA', // TEMP EMAIL USED - USE/GET YOUR APP_CODE
  country: 'USA',
  url: 'http://autocomplete.geocoder.api.here.com/6.2/suggest.json',
  geo: 'http://geocoder.api.here.com/6.2/geocode.json?gen=9'
}

export let loadHereOptions = async inputValue => {
  if (inputValue.length <= 2) return []
  let url = `${hereConfig.url}?app_id=${hereConfig.app_id}&app_code=${hereConfig.app_code}&country=${hereConfig.country}&query=${inputValue}`
  let data = await (await fetch(url)).json()
  if (data.error) {
    console.error('loadHereOptions', data.error)
    throw new Error(data.error)
  } else {
    return _.getOr([], 'suggestions', data).map(d => ({
      label: d.label,
      value: d.locationId,
    }))
  }
}
export let geoCodeLocation = async locationId => {
  let url = `${hereConfig.geo}&app_id=${hereConfig.app_id}&app_code=${hereConfig.app_code}&locationid=${locationId}`
  let data = await (await fetch(url)).json()
  if (data.error) {
    console.error('geoCodeLocation', data.error)
    throw new Error(data.error)
  } else {
    var position = _.get('Response.View.0.Result.0.Location.DisplayPosition', data)
    var location = _.get('Response.View.0.Result.0.Location.Address.Label', data),
        latitude  = position.Latitude,
        longitude = position.Longitude

    return {location, latitude, longitude}
  }
}