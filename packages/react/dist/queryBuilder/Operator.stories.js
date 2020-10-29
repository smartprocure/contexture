"use strict";

var _react = _interopRequireDefault(require("react"));

var _react2 = require("@storybook/react");

var _util = require("./stories/util");

var _Operator = _interopRequireDefault(require("./Operator"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { "default": obj }; }

var operatorStory = function operatorStory(join, index, root) {
  return function () {
    return /*#__PURE__*/_react["default"].createElement(_Operator["default"], {
      node: {
        join: join
      },
      child: {
        join: 'and'
      },
      root: root,
      index: index,
      parent: _util.parent,
      noDrop: true
    });
  };
};

(0, _react2.storiesOf)('Search Components|QueryBuilder/Internals/Operator', module).addDecorator(_util.DnDDecorator).add('and', operatorStory('and', 1, _util.root)).add('or', operatorStory('or', 1, _util.root)).add('not', operatorStory('not', 1, _util.root)).add('first and', operatorStory('and', 0, _util.root)).add('first or', operatorStory('or', 0, _util.root)).add('first not', operatorStory('not', 0, _util.root));
//# sourceMappingURL=Operator.stories.js.map