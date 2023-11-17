import { validateValueExistence } from '../../util/client.js'

export default {
  validate: validateValueExistence,
  reactors: {
    value: 'others',
  },
  defaults: {
    field: null,
    value: null,
  },
}
