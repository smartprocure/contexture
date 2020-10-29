"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports["default"] = void 0;

var _react = _interopRequireDefault(require("react"));

var _fp = _interopRequireDefault(require("lodash/fp"));

var _futil = _interopRequireDefault(require("futil"));

var _MemoryTable = _interopRequireDefault(require("../../MemoryTable"));

var _EmojiIcon = _interopRequireDefault(require("../../stories/EmojiIcon"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { "default": obj }; }

function ownKeys(object, enumerableOnly) { var keys = Object.keys(object); if (Object.getOwnPropertySymbols) { var symbols = Object.getOwnPropertySymbols(object); if (enumerableOnly) symbols = symbols.filter(function (sym) { return Object.getOwnPropertyDescriptor(object, sym).enumerable; }); keys.push.apply(keys, symbols); } return keys; }

function _objectSpread(target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i] != null ? arguments[i] : {}; if (i % 2) { ownKeys(Object(source), true).forEach(function (key) { _defineProperty(target, key, source[key]); }); } else if (Object.getOwnPropertyDescriptors) { Object.defineProperties(target, Object.getOwnPropertyDescriptors(source)); } else { ownKeys(Object(source)).forEach(function (key) { Object.defineProperty(target, key, Object.getOwnPropertyDescriptor(source, key)); }); } } return target; }

function _defineProperty(obj, key, value) { if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }

// types
var number = {
  typeDefault: number
};
var bool = {
  typeDefault: 'bool',
  display: function display(x) {
    return x ? 'Yes' : 'No';
  }
};
var codePoint = {
  typeDefault: 'text',
  display: _futil["default"].whenExists(_fp["default"].flow(_fp["default"].split('-'), _fp["default"].map(function (x) {
    return parseInt(x, 16);
  }), _fp["default"].spread(String.fromCodePoint)))
};
var schema = {
  image: {
    display: function display(x, record) {
      return /*#__PURE__*/_react["default"].createElement(_EmojiIcon["default"], {
        set: "facebook",
        record: record
      });
    }
  },
  name: {
    typeDefault: 'text'
  },
  unified: codePoint,
  non_qualified: codePoint,
  sheet_x: {
    typeDefault: 'number'
  },
  sheet_y: {
    typeDefault: 'number'
  },
  short_name: {
    typeDefault: 'facet'
  },
  short_names: {
    typeDefault: 'facet'
  },
  category: {
    typeDefault: 'facet'
  },
  sort_order: {
    typeDefault: 'number'
  },
  added_in: {
    typeDefault: 'facet'
  },
  has_img_apple: bool,
  has_img_google: bool,
  has_img_twitter: bool,
  has_img_facebook: bool,
  text: {
    typeDefault: 'facet'
  },
  texts: {
    typeDefault: 'facet'
  },
  obsoletes: codePoint,
  obsoleted_by: codePoint
};
schema.skin_variations = {
  typeDefault: 'facet',
  display: function display(x) {
    return x && /*#__PURE__*/_react["default"].createElement(_MemoryTable["default"], {
      data: _futil["default"].unkeyBy('skin_tone', x),
      fields: _objectSpread({
        skin_tone: codePoint
      }, _fp["default"].pick(['image', 'unified'], schema))
    });
  }
};
var _default = schema;
exports["default"] = _default;
//# sourceMappingURL=emojiData.js.map