import { not } from '../../utils/elasticDSL.js'

export let hasValue = ({ latitude, longitude, radius, operator }) =>
  !!(latitude && longitude && radius && operator)

export let filter = ({ field, latitude, longitude, radius, operator }) => {
  let filter = {
    geo_distance: {
      [field]: [longitude, latitude],
      distance: `${radius}mi`,
    },
  }
  return operator === 'within' ? filter : not(filter)
}
