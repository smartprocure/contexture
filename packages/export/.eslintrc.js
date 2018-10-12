module.exports = {
  extends: 'smartprocure',
  parser: 'babel-eslint',
  parserOptions: {
    sourceType: 'module',
    ecmaVersion: 2017
  },
  env: {
    node: true,
    jest: true,
    es6: true
  },
  rules: {
    "no-extra-semi": 0
  }
}
