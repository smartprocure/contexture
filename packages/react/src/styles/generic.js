// Layout
export let dFlex = {
  display: 'flex',
}
export let flexJustifyContentBetween = {
  justifyContent: 'space-between',
  ...dFlex,
}
export let w100 = {
  width: '100%',
}
export let fullscreen = {
  position: 'fixed',
  top: 0,
  left: 0,
  bottom: 0,
  right: 0,
}

// Button
export let btn = {
  border: '1px solid #ccc',
  padding: '.5rem 1rem',
  // fontSize: '1rem',
  borderRadius: 5000, //'.25rem',
  background: 'white',
  textAlign: 'center',
  display: 'inline-block',
}
export let roundedLeft0 = {
  borderTopLeftRadius: 0,
  borderBottomLeftRadius: 0,
}
export let roundedRight0 = {
  borderTopRightRadius: 0,
  borderBottomRightRadius: 0,
}

// Misc
export let bgStriped = {
  backgroundImage:
    'linear-gradient(-45deg, rgba(200, 200, 200, 0.2) 25%, transparent 25%, transparent 50%, rgba(200, 200, 200, 0.2) 50%, rgba(200, 200, 200, 0.2) 75%, transparent 75%, transparent',
  backgroundSize: '1rem 1rem',
}

export let loading = {
  ...bgStriped,
  opacity: 0.5
}

// Search
export let joinColor = join =>
  ({
    and: '#5bc0de',
    or: '#5cb85c',
    not: '#d9534f',
  }[join.join || join])
export let bgJoin = tree => ({
  background: joinColor(tree),
  color: 'white',
})
export let bdJoin = tree => ({
  borderColor: joinColor(tree),
})
export let bgPreview = join => ({
  ...bgJoin(join),
  ...bgStriped,
})

export default {
  // Layout
  dFlex,
  flexJustifyContentBetween,
  w100,
  fullscreen,

  // Button
  btn,
  roundedLeft0,
  roundedRight0,

  // Misc
  bgStriped,

  // Search
  joinColor,
  bgJoin,
  bdJoin,
  bgPreview,
}
