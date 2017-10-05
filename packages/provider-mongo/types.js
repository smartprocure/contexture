module.exports = require('include-all')({
  dirname: `${__dirname}/src/example-types`,
  filter: /(.+)\.js$/,
  optional: true,
})
