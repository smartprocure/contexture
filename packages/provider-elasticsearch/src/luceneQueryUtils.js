module.exports = {
  luceneQueryProcessor: newVal =>
    (`${newVal}`)
      .replace(/“/g, '"')
      .replace(/”/g, '"')
      .replace(/‘/g, "'")
      .replace(/’/g, "'")
      .replace(/\band\b/gi, 'AND')
      .replace(/\bor\b/gi, 'OR')
      .replace(/\bnot\b/gi, 'NOT')
      // once better unit tested the above three could likely be replaced with:
      //.replace(/\b(?:and|or|not)\b/ig, function(s) { return s.toUpperCase(); })
      .replace(/\\(?!")/g, '\\\\')
      .replace(/\//g, '\\/')
      .trim()
}
