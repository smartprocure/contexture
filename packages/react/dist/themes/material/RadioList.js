"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports["default"] = void 0;

var _core = require("@material-ui/core");

var _react = _interopRequireDefault(require("react"));

var _mobxReact = require("mobx-react");

var _fp = _interopRequireDefault(require("lodash/fp"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { "default": obj }; }

function _objectWithoutProperties(source, excluded) { if (source == null) return {}; var target = _objectWithoutPropertiesLoose(source, excluded); var key, i; if (Object.getOwnPropertySymbols) { var sourceSymbolKeys = Object.getOwnPropertySymbols(source); for (i = 0; i < sourceSymbolKeys.length; i++) { key = sourceSymbolKeys[i]; if (excluded.indexOf(key) >= 0) continue; if (!Object.prototype.propertyIsEnumerable.call(source, key)) continue; target[key] = source[key]; } } return target; }

function _objectWithoutPropertiesLoose(source, excluded) { if (source == null) return {}; var target = {}; var sourceKeys = Object.keys(source); var key, i; for (i = 0; i < sourceKeys.length; i++) { key = sourceKeys[i]; if (excluded.indexOf(key) >= 0) continue; target[key] = source[key]; } return target; }

var RadioList = function RadioList(_ref) {
  var options = _ref.options,
      value = _ref.value,
      _onChange = _ref.onChange,
      props = _objectWithoutProperties(_ref, ["options", "value", "onChange"]);

  return /*#__PURE__*/_react["default"].createElement("div", props, _fp["default"].map(function (option) {
    return /*#__PURE__*/_react["default"].createElement("label", {
      key: option.value,
      style: {
        cursor: 'pointer',
        marginRight: 25
      }
    }, /*#__PURE__*/_react["default"].createElement(_core.Radio, {
      onChange: function onChange() {
        _onChange(option.value);
      },
      value: option.value,
      checked: value === option.value
    }), option.label);
  }, options));
};

var _default = (0, _mobxReact.observer)(RadioList);

exports["default"] = _default;
//# sourceMappingURL=RadioList.js.map