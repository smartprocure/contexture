import React from 'react'
import BaseTextHighlight from '../../layout/TextHighlight'

let Wrap = props => <b style={{ backgroundColor: 'yellow' }} {...props} />

let TextHighlight = props => <BaseTextHighlight Wrap={Wrap} {...props} />
export default TextHighlight
