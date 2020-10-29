"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports["default"] = void 0;

var _reactDnd = require("react-dnd");

var _default = (0, _reactDnd.DragSource)('filter', {
  beginDrag: function beginDrag(props) {
    return {
      node: props.child || props.node,
      tree: props.tree
    };
  }
}, function (connect, monitor) {
  return {
    connectDragSource: connect.dragSource(),
    connectDragPreview: connect.dragPreview(),
    isDragging: monitor.isDragging()
  };
});

exports["default"] = _default;
//# sourceMappingURL=FilterDragSource.js.map