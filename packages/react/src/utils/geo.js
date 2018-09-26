import _ from 'lodash/fp'

const hereConfig = {
  app_id: 'KzmI0fMwTyOG10rqZacS', // TEMP EMAIL USED - USE/GET YOUR APP_ID
  app_code: 'PykXtnTUeH7DDM-RLlpwyA', // TEMP EMAIL USED - USE/GET YOUR APP_CODE
  country: 'USA',
  url: 'http://autocomplete.geocoder.api.here.com/6.2/suggest.json',
}

export let loadHereOptions = async inputValue => {
  if (inputValue.length <= 2) return []
  let url = `${hereConfig.url}?app_id=${hereConfig.app_id}&app_code=${
    hereConfig.app_code
  }&country=${hereConfig.country}&query=${inputValue}`
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
