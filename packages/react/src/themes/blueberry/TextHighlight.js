import React from 'react'
import BaseTextHighlight from '../../layout/TextHighlight'

let Wrap = ({ style = {}, ...props }) => (
  <b style={{ backgroundColor: 'yellow', ...style }} {...props} />
)

let TextHighlight = props => <BaseTextHighlight {...props} Wrap={Wrap} />
export default TextHighlight
