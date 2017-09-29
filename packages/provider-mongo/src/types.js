module.exports = require('include-all')({
  dirname: `${__dirname}/default-types`,
  filter: /(.+)\.js$/,
  optional: true,
})
