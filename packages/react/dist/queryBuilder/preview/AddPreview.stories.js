"use strict";

var _react = _interopRequireDefault(require("react"));

var _react2 = require("@storybook/react");

var _addonActions = require("@storybook/addon-actions");

var _AddPreview = _interopRequireDefault(require("./AddPreview"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { "default": obj }; }

(0, _react2.storiesOf)('Search Components|QueryBuilder/Internals/AddPreview', module).add('and', function () {
  return /*#__PURE__*/_react["default"].createElement(_AddPreview["default"], {
    onClick: (0, _addonActions.action)('join'),
    join: "and"
  });
}).add('or', function () {
  return /*#__PURE__*/_react["default"].createElement(_AddPreview["default"], {
    onClick: (0, _addonActions.action)('join'),
    join: "or"
  });
}).add('not', function () {
  return /*#__PURE__*/_react["default"].createElement(_AddPreview["default"], {
    onClick: (0, _addonActions.action)('join'),
    join: "not"
  });
});
//# sourceMappingURL=AddPreview.stories.js.map