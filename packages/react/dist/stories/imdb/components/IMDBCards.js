"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports["default"] = void 0;

var _fp = _interopRequireDefault(require("lodash/fp"));

var _react = _interopRequireDefault(require("react"));

var _greyVest = require("../../../greyVest");

var _hoc = require("../../../utils/hoc");

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { "default": obj }; }

var IMDBCards = function IMDBCards(_ref) {
  var node = _ref.node;
  return /*#__PURE__*/_react["default"].createElement(_greyVest.Flex, {
    style: {
      flexWrap: 'wrap',
      justifyContent: 'center'
    }
  }, _fp["default"].map(function (_ref2) {
    var _id = _ref2._id,
        _ref2$_source = _ref2._source,
        title = _ref2$_source.title,
        poster = _ref2$_source.poster;
    return /*#__PURE__*/_react["default"].createElement("div", {
      key: _id,
      style: {
        margin: '5px',
        textAlign: 'center'
      }
    }, /*#__PURE__*/_react["default"].createElement("img", {
      src: poster,
      width: "180",
      height: "270"
    }), /*#__PURE__*/_react["default"].createElement("div", {
      style: {
        width: '180px'
      },
      dangerouslySetInnerHTML: {
        __html: title
      }
    }));
  }, node.context.response.results));
};

var _default = (0, _hoc.contexturify)(IMDBCards);

exports["default"] = _default;
//# sourceMappingURL=IMDBCards.js.map