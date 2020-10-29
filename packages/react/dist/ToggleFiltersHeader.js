"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports["default"] = void 0;

var _react = _interopRequireDefault(require("react"));

var _ShowFiltersButton = _interopRequireDefault(require("./purgatory/ShowFiltersButton"));

var _greyVest = require("./greyVest");

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { "default": obj }; }

var ToggleFiltersHeader = function ToggleFiltersHeader(_ref) {
  var mode = _ref.mode,
      setMode = _ref.setMode,
      children = _ref.children;
  return /*#__PURE__*/_react["default"].createElement(_greyVest.Flex, {
    style: {
      alignItems: 'center'
    }
  }, mode === 'resultsOnly' && /*#__PURE__*/_react["default"].createElement("span", {
    style: {
      marginRight: 5
    }
  }, /*#__PURE__*/_react["default"].createElement(_ShowFiltersButton["default"], {
    onClick: function onClick() {
      return setMode('basic');
    }
  })), /*#__PURE__*/_react["default"].createElement("h1", null, children));
};

var _default = ToggleFiltersHeader;
exports["default"] = _default;
//# sourceMappingURL=ToggleFiltersHeader.js.map