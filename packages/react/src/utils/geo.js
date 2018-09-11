import _ from 'lodash/fp'

const hereConfig = {
  app_id:   'KzmI0fMwTyOG10rqZacS',   // YOUR APP_ID
  app_code: 'PykXtnTUeH7DDM-RLlpwyA', // YOUR APP_CODE
  country:  'USA',
  url: 'http://autocomplete.geocoder.api.here.com/6.2/suggest.json'
}

export let loadHereOptions = inputValue =>
  new Promise((resolve, reject) => {
    if(inputValue.length > 2) {
      fetch(`${hereConfig.url}?app_id=${hereConfig.app_id}&app_code=${hereConfig.app_code}&country=${hereConfig.country}&query=${inputValue}`)
        .then(response => response.json())
        .then(data => {
          if(data.error) {
            console.log(data.error)
            reject(data.error)
          } else {
            resolve(_.getOr([], 'suggestions', data).map(d => ({ label: d.label, value: d.locationId })))
          }
        });
      } else {
        resolve([])
      }
    })
