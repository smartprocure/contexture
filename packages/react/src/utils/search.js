import F from 'futil-js'

export let oppositeJoin = node => F.getOrReturn('join', node) === 'and' ? 'or' : 'and'
