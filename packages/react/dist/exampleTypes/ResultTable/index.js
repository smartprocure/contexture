"use strict";

function _typeof(obj) { "@babel/helpers - typeof"; if (typeof Symbol === "function" && typeof Symbol.iterator === "symbol") { _typeof = function _typeof(obj) { return typeof obj; }; } else { _typeof = function _typeof(obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; }; } return _typeof(obj); }

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports["default"] = exports.PagedResultTable = void 0;

var _react = _interopRequireDefault(require("react"));

var _fp = _interopRequireDefault(require("lodash/fp"));

var F = _interopRequireWildcard(require("futil"));

var _FilterAdder = require("../../FilterAdder");

var _hoc = require("../../utils/hoc");

var _schema = require("../../utils/schema");

var _search = require("../../utils/search");

var _Header = _interopRequireDefault(require("./Header"));

var _TableBody = _interopRequireDefault(require("./TableBody"));

var _HighlightedColumnHeader = _interopRequireDefault(require("./HighlightedColumnHeader"));

var _ResultTableFooter = _interopRequireDefault(require("./ResultTableFooter"));

function _getRequireWildcardCache() { if (typeof WeakMap !== "function") return null; var cache = new WeakMap(); _getRequireWildcardCache = function _getRequireWildcardCache() { return cache; }; return cache; }

function _interopRequireWildcard(obj) { if (obj && obj.__esModule) { return obj; } if (obj === null || _typeof(obj) !== "object" && typeof obj !== "function") { return { "default": obj }; } var cache = _getRequireWildcardCache(); if (cache && cache.has(obj)) { return cache.get(obj); } var newObj = {}; var hasPropertyDescriptor = Object.defineProperty && Object.getOwnPropertyDescriptor; for (var key in obj) { if (Object.prototype.hasOwnProperty.call(obj, key)) { var desc = hasPropertyDescriptor ? Object.getOwnPropertyDescriptor(obj, key) : null; if (desc && (desc.get || desc.set)) { Object.defineProperty(newObj, key, desc); } else { newObj[key] = obj[key]; } } } newObj["default"] = obj; if (cache) { cache.set(obj, newObj); } return newObj; }

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { "default": obj }; }

function _extends() { _extends = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; }; return _extends.apply(this, arguments); }

var getIncludes = function getIncludes(schema, node) {
  return F.when(_fp["default"].isEmpty, _fp["default"].map('field', schema))(node.include);
};

var Tr = function Tr(props) {
  return /*#__PURE__*/_react["default"].createElement("tr", _fp["default"].omit(['record', 'fields', 'visibleFields', 'hiddenFields'], props));
};

var ResultTable = function ResultTable(_ref) {
  var fields = _ref.fields,
      infer = _ref.infer,
      path = _ref.path,
      criteria = _ref.criteria,
      _ref$node = _ref.node,
      node = _ref$node === void 0 ? {} : _ref$node,
      tree = _ref.tree,
      _ref$NoResultsCompone = _ref.NoResultsComponent,
      NoResultsComponent = _ref$NoResultsCompone === void 0 ? 'No Results Found' : _ref$NoResultsCompone,
      _ref$IntroComponent = _ref.IntroComponent,
      IntroComponent = _ref$IntroComponent === void 0 ? null : _ref$IntroComponent,
      _ref$Row = _ref.Row,
      Row = _ref$Row === void 0 ? Tr : _ref$Row,
      getRowKey = _ref.getRowKey,
      _ref$mapNodeToProps = _ref.mapNodeToProps,
      mapNodeToProps = _ref$mapNodeToProps === void 0 ? function () {
    return {};
  } : _ref$mapNodeToProps,
      pageSizeOptions = _ref.pageSizeOptions,
      stickyFields = _ref.stickyFields,
      Table = _ref.theme.Table;
  // If there are no fields, we won't render anything. This is most definitely a
  // user error when it happens
  if (_fp["default"].isEmpty(fields) && !infer) throw new Error('Fields are empty'); // From Theme/Components

  var mutate = tree.mutate(path); // Account for all providers here (memory provider has results with no response parent)

  var hasResults = !!_fp["default"].get('context.response.results.length', node) || !!_fp["default"].get('context.results.length', node); // NOTE infer + add columns does not work together (except for anything explicitly passed in)
  //   When removing a field, it's not longer on the record, so infer can't pick it up since it runs per render

  var schema = _fp["default"].flow(_fp["default"].merge(infer && (0, _schema.inferSchema)(node)), _schema.applyDefaults, _fp["default"].values, _fp["default"].orderBy('order', 'desc'))(fields);

  var includes = getIncludes(schema, node);

  var isIncluded = function isIncluded(x) {
    return _fp["default"].includes(x.field, includes);
  };

  var visibleFields = _fp["default"].flow(_fp["default"].map(function (field) {
    return _fp["default"].find({
      field: field
    }, schema);
  }), _fp["default"].compact)(includes);

  var hiddenFields = _fp["default"].reject(isIncluded, schema);

  var headerProps = {
    mapNodeToProps: mapNodeToProps,
    fields: fields,
    visibleFields: visibleFields,
    includes: includes,
    addOptions: (0, _FilterAdder.fieldsToOptions)(hiddenFields),
    addFilter: function addFilter(field) {
      return tree.add(criteria, (0, _search.newNodeFromField)({
        field: field,
        fields: fields
      }));
    },
    tree: tree,
    node: node,
    mutate: mutate,
    criteria: criteria
  };

  if (!node.updating && hasResults) {
    return /*#__PURE__*/_react["default"].createElement(_react["default"].Fragment, null, /*#__PURE__*/_react["default"].createElement(Table, null, /*#__PURE__*/_react["default"].createElement("thead", null, /*#__PURE__*/_react["default"].createElement("tr", null, F.mapIndexed(function (x) {
      return /*#__PURE__*/_react["default"].createElement(_Header["default"], _extends({
        key: x.field,
        field: x,
        sticky: _fp["default"].contains(stickyFields, x.field)
      }, headerProps));
    }, visibleFields), /*#__PURE__*/_react["default"].createElement(_HighlightedColumnHeader["default"], {
      node: node
    }))), /*#__PURE__*/_react["default"].createElement(_TableBody["default"], {
      node: node,
      fields: fields,
      visibleFields: visibleFields,
      hiddenFields: hiddenFields,
      schema: schema,
      Row: Row,
      getRowKey: getRowKey,
      stickyFields: stickyFields
    })), node.pageSize > 0 && /*#__PURE__*/_react["default"].createElement("div", {
      style: {
        background: '#fff',
        width: 'calc(100vw - 540px)',
        zIndex: 10,
        position: 'sticky',
        bottom: -1,
        left: '15px',
        borderRadius: 4,
        marginTop: 16,
        boxShadow: 'rgba(0, 0, 0, 0.15) 0px -1px 5px'
      }
    }, /*#__PURE__*/_react["default"].createElement(_ResultTableFooter["default"], {
      tree: tree,
      node: node,
      path: path,
      pageSizeOptions: pageSizeOptions
    })));
  }

  if (!node.markedForUpdate && !node.updating && !hasResults) {
    return NoResultsComponent;
  }

  return IntroComponent;
};

var PagedResultTable = (0, _hoc.contexturify)(ResultTable);
exports.PagedResultTable = PagedResultTable;
var _default = PagedResultTable;
exports["default"] = _default;
//# sourceMappingURL=index.js.map