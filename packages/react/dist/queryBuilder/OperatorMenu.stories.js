"use strict";

var _react = _interopRequireDefault(require("react"));

var _react2 = require("@storybook/react");

var _util = require("./stories/util");

var _OperatorMenu = _interopRequireDefault(require("./OperatorMenu"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { "default": obj }; }

(0, _react2.storiesOf)('Search Components|QueryBuilder/Internals', module).add('OperatorMenu', function () {
  return /*#__PURE__*/_react["default"].createElement(_OperatorMenu["default"], {
    node: {
      join: 'and'
    },
    parent: _util.parent,
    root: _util.root
  });
});
//# sourceMappingURL=OperatorMenu.stories.js.map