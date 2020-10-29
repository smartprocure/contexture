"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.fromPopover = exports.withIsOpenOnCloseProps = exports.withOpenProp = exports["default"] = void 0;

var _react = _interopRequireDefault(require("react"));

var _futil = _interopRequireDefault(require("futil"));

var _react2 = require("../utils/react");

var _ = require(".");

var _decorator = _interopRequireDefault(require("./stories/decorator"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { "default": obj }; }

function _slicedToArray(arr, i) { return _arrayWithHoles(arr) || _iterableToArrayLimit(arr, i) || _unsupportedIterableToArray(arr, i) || _nonIterableRest(); }

function _nonIterableRest() { throw new TypeError("Invalid attempt to destructure non-iterable instance.\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method."); }

function _unsupportedIterableToArray(o, minLen) { if (!o) return; if (typeof o === "string") return _arrayLikeToArray(o, minLen); var n = Object.prototype.toString.call(o).slice(8, -1); if (n === "Object" && o.constructor) n = o.constructor.name; if (n === "Map" || n === "Set") return Array.from(o); if (n === "Arguments" || /^(?:Ui|I)nt(?:8|16|32)(?:Clamped)?Array$/.test(n)) return _arrayLikeToArray(o, minLen); }

function _arrayLikeToArray(arr, len) { if (len == null || len > arr.length) len = arr.length; for (var i = 0, arr2 = new Array(len); i < len; i++) { arr2[i] = arr[i]; } return arr2; }

function _iterableToArrayLimit(arr, i) { if (typeof Symbol === "undefined" || !(Symbol.iterator in Object(arr))) return; var _arr = []; var _n = true; var _d = false; var _e = undefined; try { for (var _i = arr[Symbol.iterator](), _s; !(_n = (_s = _i.next()).done); _n = true) { _arr.push(_s.value); if (i && _arr.length === i) break; } } catch (err) { _d = true; _e = err; } finally { try { if (!_n && _i["return"] != null) _i["return"](); } finally { if (_d) throw _e; } } return _arr; }

function _arrayWithHoles(arr) { if (Array.isArray(arr)) return arr; }

var _default = {
  title: 'GreyVest Library|Modal',
  component: _.Modal,
  decorators: [_decorator["default"]]
};
exports["default"] = _default;

var withOpenProp = function withOpenProp() {
  var open = _react["default"].useState(false);

  return /*#__PURE__*/_react["default"].createElement(_react["default"].Fragment, null, /*#__PURE__*/_react["default"].createElement(_.Modal, {
    open: open
  }, "Some Modal Content"), /*#__PURE__*/_react["default"].createElement(_.Button, {
    onClick: _futil["default"].on(open)
  }, "Open Modal"));
};

exports.withOpenProp = withOpenProp;
withOpenProp.story = {
  name: "With 'open' prop"
};

var withIsOpenOnCloseProps = function withIsOpenOnCloseProps() {
  var _React$useState = _react["default"].useState(false),
      _React$useState2 = _slicedToArray(_React$useState, 2),
      isOpen = _React$useState2[0],
      setIsOpen = _React$useState2[1];

  return /*#__PURE__*/_react["default"].createElement(_react["default"].Fragment, null, /*#__PURE__*/_react["default"].createElement(_.Modal, {
    isOpen: isOpen,
    onClose: function onClose() {
      return setIsOpen(false);
    }
  }, "Some Modal Content"), /*#__PURE__*/_react["default"].createElement(_.Button, {
    onClick: function onClick() {
      return setIsOpen(true);
    }
  }, "Open Modal"));
};

exports.withIsOpenOnCloseProps = withIsOpenOnCloseProps;
withIsOpenOnCloseProps.story = {
  name: "With 'isOpen'/'onClose' props"
};

var fromPopover = function fromPopover() {
  var open = (0, _react2.useLensObject)({
    modal: false,
    popover: false
  });
  return /*#__PURE__*/_react["default"].createElement(_react["default"].Fragment, null, /*#__PURE__*/_react["default"].createElement("p", null, "Demonstrates how to use modals inside of popovers. Ideally, the modal component should live outside the popover even if its opener is inside the popover, but in cases where it's absolutely necessary, modals can survive inside of popovers as long as steps are taken to keep the popover open as long as the modal is."), /*#__PURE__*/_react["default"].createElement(_.Button, {
    onClick: _futil["default"].on(open.popover)
  }, "Open Popover"), /*#__PURE__*/_react["default"].createElement(_.Popover, {
    isOpen: _futil["default"].view(open.popover),
    onClose: function onClose() {
      return !_futil["default"].view(open.modal) && _futil["default"].off(open.popover)();
    }
  }, /*#__PURE__*/_react["default"].createElement(_.DropdownItem, {
    onClick: _futil["default"].on(open.modal)
  }, "Open Modal"), /*#__PURE__*/_react["default"].createElement(_.Modal, {
    open: open.modal
  }, "Some modal content")));
};

exports.fromPopover = fromPopover;
//# sourceMappingURL=Modal.stories.js.map