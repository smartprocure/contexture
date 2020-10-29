"use strict";

var _react = _interopRequireDefault(require("react"));

var _react2 = require("@storybook/react");

var _Async = _interopRequireDefault(require("react-select/lib/Async"));

var _geo = require("../utils/geo");

var _themePicker = _interopRequireDefault(require("../stories/themePicker"));

var _greyVest = require("../greyVest");

var _testTree = _interopRequireDefault(require("./stories/testTree"));

var _ = require(".");

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { "default": obj }; }

(0, _react2.storiesOf)('ExampleTypes|Geo filter & HERE maps', module).addDecorator((0, _themePicker["default"])('greyVest')).add('Geo filter & HERE maps', function () {
  return /*#__PURE__*/_react["default"].createElement("div", {
    style: {
      backgroundColor: '#333',
      color: '#AAA',
      padding: '20px',
      borderRadius: '10px'
    }
  }, /*#__PURE__*/_react["default"].createElement(_greyVest.Flex, {
    style: {
      flexFlow: 'column wrap'
    }
  }, /*#__PURE__*/_react["default"].createElement("div", {
    style: {
      flex: 1
    }
  }, /*#__PURE__*/_react["default"].createElement(_.Geo, {
    tree: (0, _testTree["default"])(),
    placeholder: "Enter address, city, state, zip or business name ...",
    loadOptions: _geo.loadHereOptions,
    path: ['geo'],
    AutoComplete: _Async["default"],
    GeoCodeLocation: _geo.geoCodeLocation
  }))));
});
//# sourceMappingURL=Geo.stories.js.map