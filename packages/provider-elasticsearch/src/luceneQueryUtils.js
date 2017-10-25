let charmap = require('./asciifyCharMap')

let utils = {
  // https://github.com/tstrimple/asciify-string
  asciifyString: function asciifyString(string) {
    var charsReplaced = 0

    function setCharAt(t, i, c) {
      if (i > t.length - 1) {
        return t
      }

      return t.substr(0, i) + c + t.substr(i + 1)
    }

    for (var i = string.length - 1; i >= 0; i--) {
      var c = string[i]

      if (charmap[c]) {
        charsReplaced++
        string = setCharAt(string, i, charmap[c])
      }
    }

    return {
      result: string,
      changes: charsReplaced,
    }
  },

  //https://developer.mozilla.org/en-US/docs/Web/JavaScript/Guide/Regular_Expressions#special-white-space
  _reWHITESPACE: /[ \f\n\r\t\v\u00a0\u1680\u180e\u2000-\u200a\u2028\u2029\u202f\u205f\u3000\ufeff]+/g,

  luceneQueryProcessor: newVal =>
    utils
      .asciifyString(`${newVal}`)
      .result.replace(/[\xad]/g, ' ') // Convert SHY-HYPHEN to HYPHEN-MINUS (ZD #9811)
      .replace(/−/g, '-') // Convert MINUS-SIGN to HYPHEN-MINUS (ZD #7477)
      .replace(utils._reWHITESPACE, ' ') // any kind of white space to normal spaces
      .replace(/\band\b/gi, 'AND')
      .replace(/\bor\b/gi, 'OR')
      .replace(/\bnot\b/gi, 'NOT')
      // once better unit tested the above three could likely be replaced with:
      //.replace(/\b(?:and|or|not)\b/ig, function(s) { return s.toUpperCase(); })
      .replace(/\s\s+/g, ' ')
      .trim(),
}

module.exports = utils
