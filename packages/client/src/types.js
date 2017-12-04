import _ from 'lodash/fp';
import * as F from 'futil-js';
import { defaultHasValue } from './validation';
// import {toSentence} from 'underscore.string.fp'

export let defaultTypes = {
  default: {
    validate: defaultHasValue,
  },
  facet: {
    data: {
      values: [],
      mode: 'include',
    },
    config: {
      size: 12,
      filter: '',
    },
    context: {
      total: 0,
      options: [],
      cardinality: 0,
    },
    // validate: x => x.data.values,
    // toString: ({data: {values, mode}}) =>
    //   values.length
    //     ? F.compactJoin(' ', [
    //       'is',
    //       mode === 'exclude' ? 'not' : '',
    //       toSentence(', ', ` ${mode === 'exclude' ? 'nor' : 'or'} `, values)
    //     ])
    //     : 'is anything'
  },
};

export let getTypeProp = _.curry((types, prop, node) =>
  F.cascade([`${node.type}.${prop}`, `default.${prop}`], types)
);
export let runTypeFunction = _.curry((types, prop, node) =>
  getTypeProp(types, prop, node)(node)
);
