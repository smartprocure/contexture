"use strict";

var _react = _interopRequireDefault(require("react"));

var _react2 = require("@storybook/react");

var _util = require("./stories/util");

var _Rule = _interopRequireDefault(require("./Rule"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { "default": obj }; }

(0, _react2.storiesOf)('Search Components|QueryBuilder/Internals', module).addDecorator(_util.DnDDecorator).add('Rule', function () {
  return /*#__PURE__*/_react["default"].createElement(_Rule["default"], {
    node: {
      type: 'test',
      key: 'testKey'
    },
    tree: {
      join: 'and'
    },
    root: _util.root,
    fields: {
      test: {
        field: 'test',
        label: 'Test',
        typeOptions: ['test']
      }
    }
  });
});
//# sourceMappingURL=Rule.stories.js.map