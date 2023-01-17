import bool from './bool.js'
import date from './date.js'
import dateHistogram from './dateHistogram.js'
import exists from './exists.js'
import facet from './facet.js'
import mongoId from './mongoId.js'
import number from './number.js'
import results from './results.js'
import statistical from './statistical.js'
import tagsText from './tagsText.js'
import termsStats from './termsStats.js'
import text from './text.js'

const defaultType = { validContext: () => true }

export {
  bool,
  date,
  dateHistogram,
  exists,
  facet,
  mongoId,
  number,
  results,
  statistical,
  tagsText,
  termsStats,
  text,
  defaultType as default,
}
