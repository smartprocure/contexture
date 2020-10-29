"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports["default"] = void 0;

var _react = _interopRequireDefault(require("react"));

var _futil = _interopRequireDefault(require("futil"));

var _fp = _interopRequireDefault(require("lodash/fp"));

var _recompose = require("recompose");

var _mobxReact = require("mobx-react");

var _mobx = require("mobx");

var _TextHighlight = _interopRequireDefault(require("./TextHighlight"));

var _TextInput = _interopRequireDefault(require("./TextInput"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { "default": obj }; }

function _extends() { _extends = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; }; return _extends.apply(this, arguments); }

var PickerContext = /*#__PURE__*/_react["default"].createContext(); // Unflatten by with support for arrays (allow dots in paths) and not needing a _.keyBy first


var unflattenObjectBy = _fp["default"].curry(function (iteratee, x) {
  return _fp["default"].zipObjectDeep(_futil["default"].mapIndexed(iteratee, x), _fp["default"].values(x));
});

var isField = function isField(x) {
  return x.typeDefault;
};

var FilteredSection = _fp["default"].flow((0, _recompose.setDisplayName)('FilteredSection'), _mobxReact.observer)(function (_ref) {
  var options = _ref.options,
      _onClick = _ref.onClick,
      highlight = _ref.highlight;

  var _React$useContext = _react["default"].useContext(PickerContext),
      PickerItem = _React$useContext.PickerItem,
      TextHighlight = _React$useContext.TextHighlight;

  return /*#__PURE__*/_react["default"].createElement("div", null, _futil["default"].mapIndexed(function (option, field) {
    return /*#__PURE__*/_react["default"].createElement(PickerItem, {
      key: field,
      onClick: function onClick() {
        return _onClick(option.value);
      }
    }, /*#__PURE__*/_react["default"].createElement(TextHighlight, {
      text: option.label,
      pattern: highlight
    }));
  }, options));
});

var getItemLabel = function getItemLabel(item) {
  return isField(item) ? item.shortLabel || item.label : _fp["default"].startCase(item._key);
};

var Section = _fp["default"].flow((0, _recompose.setDisplayName)('Section'), _mobxReact.observer)(function (_ref2) {
  var options = _ref2.options,
      _onClick2 = _ref2.onClick,
      selected = _ref2.selected;

  var _React$useContext2 = _react["default"].useContext(PickerContext),
      PickerItem = _React$useContext2.PickerItem;

  return /*#__PURE__*/_react["default"].createElement("div", {
    style: {
      overflow: 'auto',
      width: '100%'
    }
  }, _fp["default"].map(function (item) {
    return /*#__PURE__*/_react["default"].createElement(PickerItem, {
      key: item._key,
      onClick: function onClick() {
        return _onClick2(item.value || item._key, item);
      },
      active: selected === item._key,
      disabled: selected && selected !== item._key,
      hasChildren: !isField(item)
    }, getItemLabel(item));
  }, _fp["default"].flow(_futil["default"].unkeyBy('_key'), _fp["default"].sortBy(getItemLabel))(options)));
});

var toNested = _fp["default"].flow(_fp["default"].map(function (x) {
  return _fp["default"].defaults({
    path: x.value
  }, x);
}), unflattenObjectBy('path'));

var PanelTreePicker = (0, _mobxReact.inject)(function (store, _ref3) {
  var onChange = _ref3.onChange,
      options = _ref3.options;
  var x = {
    state: (0, _mobx.observable)({
      selected: []
    }),
    nestedOptions: toNested(options),
    selectAtLevel: _fp["default"].curry(function (level, key, field) {
      if (isField(field)) onChange(field.value);else x.state.selected.splice(level, x.state.selected.length - level, key);
    })
  };
  return x;
})((0, _mobxReact.observer)(function (_ref4) {
  var selectAtLevel = _ref4.selectAtLevel,
      state = _ref4.state,
      nestedOptions = _ref4.nestedOptions;
  return /*#__PURE__*/_react["default"].createElement("div", {
    className: "panel-tree-picker",
    style: {
      display: 'inline-flex',
      width: '100%'
    }
  }, /*#__PURE__*/_react["default"].createElement(Section, {
    options: nestedOptions,
    onClick: selectAtLevel(0),
    selected: state.selected[0]
  }), _futil["default"].mapIndexed(function (_key, index) {
    return /*#__PURE__*/_react["default"].createElement(Section, {
      key: index,
      options: _fp["default"].get(state.selected.slice(0, index + 1), nestedOptions),
      onClick: selectAtLevel(index + 1),
      selected: state.selected[index + 1]
    });
  }, state.selected));
}));
PanelTreePicker.displayName = 'PanelTreePicker';

var matchLabel = function matchLabel(str) {
  return _fp["default"].filter(function (x) {
    return _futil["default"].matchAllWords(str)(x.label);
  });
};

var NestedPicker = function NestedPicker(_ref5) {
  var options = _ref5.options,
      onChange = _ref5.onChange,
      _ref5$PickerItem = _ref5.PickerItem,
      PickerItem = _ref5$PickerItem === void 0 ? 'div' : _ref5$PickerItem,
      _ref5$TextInput = _ref5.TextInput,
      TextInput = _ref5$TextInput === void 0 ? _TextInput["default"] : _ref5$TextInput,
      _ref5$TextHighlight = _ref5.TextHighlight,
      TextHighlight = _ref5$TextHighlight === void 0 ? _TextHighlight["default"] : _ref5$TextHighlight;

  var filter = _react["default"].useState('');

  return /*#__PURE__*/_react["default"].createElement(PickerContext.Provider, {
    value: {
      PickerItem: PickerItem,
      TextHighlight: TextHighlight
    }
  }, /*#__PURE__*/_react["default"].createElement(TextInput, _extends({}, _futil["default"].domLens.value(filter), {
    placeholder: "Enter filter keyword..."
  })), _futil["default"].view(filter) ? /*#__PURE__*/_react["default"].createElement(FilteredSection, {
    options: matchLabel(_futil["default"].view(filter))(options),
    onClick: onChange,
    highlight: _futil["default"].view(filter)
  }) : /*#__PURE__*/_react["default"].createElement(PanelTreePicker, {
    options: options,
    onChange: onChange
  }));
};

var _default = (0, _mobxReact.observer)(NestedPicker);

exports["default"] = _default;
//# sourceMappingURL=NestedPicker.js.map