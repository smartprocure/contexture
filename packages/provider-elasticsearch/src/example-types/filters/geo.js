import { not } from '../../utils/elasticDSL.js'

export default {
  hasValue: ({ latitude, longitude, radius, operator }) =>
    !!(latitude && longitude && radius && operator),
  filter({ field, latitude, longitude, radius, operator }) {
    let filter = {
      geo_distance: {
        [field]: [longitude, latitude],
        distance: `${radius}mi`,
      },
    }
    return operator === 'within' ? filter : not(filter)
  },
}
