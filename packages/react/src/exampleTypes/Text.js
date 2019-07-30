import _ from 'lodash/fp'
import { contexturify, withTreeLens } from '../utils/hoc'
import LensInput from '../layout/LensInput'

let Text = _.flow(withTreeLens, contexturify)(LensInput)
Text.displayName = 'Text'

export default Text
