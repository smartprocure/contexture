"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports["default"] = exports.FilterDropTarget = void 0;

var _reactDnd = require("react-dnd");

var FilterDropTarget = function FilterDropTarget(spec) {
  return (0, _reactDnd.DropTarget)('filter', spec, function (connect, monitor) {
    return {
      connectDropTarget: connect.dropTarget(),
      isOver: monitor.isOver(),
      canDrop: monitor.canDrop(),
      dragItem: monitor.getItem()
    };
  });
};

exports.FilterDropTarget = FilterDropTarget;
var _default = FilterDropTarget;
exports["default"] = _default;
//# sourceMappingURL=FilterDropTarget.js.map