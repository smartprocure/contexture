import _ from 'lodash/fp'

const hereConfig = {
  app_id: 'KzmI0fMwTyOG10rqZacS', // TEMP EMAIL USED - USE/GET YOUR APP_ID
  app_code: 'PykXtnTUeH7DDM-RLlpwyA', // TEMP EMAIL USED - USE/GET YOUR APP_CODE
  country: 'USA',
  autocomplete: 'http://autocomplete.geocoder.api.here.com/6.2/suggest.json',
  geoCoding: 'http://geocoder.api.here.com/6.2/geocode.json?gen=9'
}

export let loadHereOptions = async inputValue => {
  if (inputValue.length <= 2) return []
  let {autocomplete: url, app_id, app_code, country} = hereConfig
  let apiUrl = `${url}?app_id=${app_id}&app_code=${app_code}&country=${country}&query=${inputValue}`

  let data = await (await fetch(apiUrl)).json()

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
  let {geoCoding: url, app_id, app_code} = hereConfig
  let apiUrl = `${url}&app_id=${app_id}&app_code=${app_code}&locationid=${locationId}`

  let data = await (await fetch(apiUrl)).json()
  
  if (data.error) {
    console.error('geoCodeLocation', data.error)
    throw new Error(data.error)
  } else {
    var position = _.get('Response.View.0.Result.0.Location.DisplayPosition', data)
    var location = _.get('Response.View.0.Result.0.Location.Address.Label', data)
  
    return {
      location, 
      latitude: position.Latitude, 
      longitude: position.Longitude
    }
  }
}