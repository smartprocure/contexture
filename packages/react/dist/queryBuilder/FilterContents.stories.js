"use strict";

var _react = _interopRequireDefault(require("react"));

var _react2 = require("@storybook/react");

var _util = require("./stories/util");

var _FilterContents = _interopRequireDefault(require("./FilterContents"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { "default": obj }; }

(0, _react2.storiesOf)('Search Components|QueryBuilder/Internals', module).add('FilterContents', function () {
  return /*#__PURE__*/_react["default"].createElement(_FilterContents["default"], {
    node: {
      // type: 'test',
      key: 'testKey'
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
//# sourceMappingURL=FilterContents.stories.js.map