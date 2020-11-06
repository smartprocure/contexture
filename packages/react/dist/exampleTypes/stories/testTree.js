"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports["default"] = void 0;

var _mobx = require("mobx");

var _addonActions = require("@storybook/addon-actions");

var _fp = _interopRequireDefault(require("lodash/fp"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { "default": obj }; }

function _slicedToArray(arr, i) { return _arrayWithHoles(arr) || _iterableToArrayLimit(arr, i) || _unsupportedIterableToArray(arr, i) || _nonIterableRest(); }

function _nonIterableRest() { throw new TypeError("Invalid attempt to destructure non-iterable instance.\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method."); }

function _unsupportedIterableToArray(o, minLen) { if (!o) return; if (typeof o === "string") return _arrayLikeToArray(o, minLen); var n = Object.prototype.toString.call(o).slice(8, -1); if (n === "Object" && o.constructor) n = o.constructor.name; if (n === "Map" || n === "Set") return Array.from(o); if (n === "Arguments" || /^(?:Ui|I)nt(?:8|16|32)(?:Clamped)?Array$/.test(n)) return _arrayLikeToArray(o, minLen); }

function _arrayLikeToArray(arr, len) { if (len == null || len > arr.length) len = arr.length; for (var i = 0, arr2 = new Array(len); i < len; i++) { arr2[i] = arr[i]; } return arr2; }

function _iterableToArrayLimit(arr, i) { if (typeof Symbol === "undefined" || !(Symbol.iterator in Object(arr))) return; var _arr = []; var _n = true; var _d = false; var _e = undefined; try { for (var _i = arr[Symbol.iterator](), _s; !(_n = (_s = _i.next()).done); _n = true) { _arr.push(_s.value); if (i && _arr.length === i) break; } } catch (err) { _d = true; _e = err; } finally { try { if (!_n && _i["return"] != null) _i["return"](); } finally { if (_d) throw _e; } } return _arr; }

function _arrayWithHoles(arr) { if (Array.isArray(arr)) return arr; }

function _defineProperty(obj, key, value) { if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }

// Lifted from contexture-client since it's not exported
var treeLens = _fp["default"].curry(function (tree, path, prop) {
  return {
    get: function get() {
      return _fp["default"].get(prop, tree.getNode(path));
    },
    set: function set(value) {
      return tree.mutate(path, _defineProperty({}, prop, value));
    }
  };
});

var _default = function _default() {
  var f = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : _fp["default"].identity;
  var tree = (0, _mobx.observable)({
    facet: {
      key: 'facet',
      type: 'facet',
      path: ['facet'],
      values: [],
      optionsFilter: '',
      context: {
        options: [{
          name: '',
          count: 4
        }, {
          name: 'Apple',
          count: 15
        }, {
          name: 'Blueberry',
          count: 3
        }, {
          name: 'Coconut',
          count: 1
        }, {
          name: 'Orange',
          count: 8
        }, {
          name: 'Grape',
          count: '20'
        }, {
          name: 'Pear',
          count: 5
        }, {
          name: 'Strawberry',
          count: 12
        }]
      }
    },
    bool: {
      key: 'bool',
      value: null,
      path: ['bool']
    },
    exists: {
      key: 'exists',
      value: null,
      path: ['exists']
    },
    date: {
      key: 'date',
      path: ['date'],
      from: '2011-01-01T05:00:00.000Z',
      to: '2019-09-12T12:07:20.000Z'
    },
    query: {
      key: 'searchQuery',
      path: ['query'],
      type: 'query',
      field: 'title',
      query: ''
    },
    titleText: {
      key: 'titleText',
      path: ['titleText'],
      type: 'text',
      field: 'title',
      value: ''
    },
    tagsQuery: {
      key: 'tagsQuery',
      path: ['tagsQuery'],
      type: 'tagsQuery',
      field: 'title',
      tags: []
    },
    tagsText: {
      key: 'tagsText',
      path: ['tagsText'],
      type: 'tagsText',
      field: 'title',
      values: []
    },
    number: {
      key: 'searchNumber',
      path: ['number'],
      type: 'number',
      field: 'metaScore',
      min: 0,
      max: 100
    },
    geo: {
      key: 'geoSearch',
      path: ['geo'],
      type: 'geo',
      location: '',
      operator: 'within',
      radius: 1
    },
    results: {
      key: 'results',
      path: ['results'],
      type: 'results',
      pageSize: 6,
      page: 1,
      context: {
        response: {
          count: 1,
          results: [{
            _id: '123',
            title: 'Some Result',
            a: 1,
            b: 2,
            c: 3,
            nested: {
              value: 4
            }
          }, {
            _id: '124',
            title: 'Some Other Result',
            a: 1,
            b: 4,
            c: 3,
            nested: {
              value: 5
            }
          }, {
            _id: '135',
            title: 'A Different Result',
            a: 1,
            b: 2,
            c: 3,
            nested: {
              value: 6
            }
          }],
          startRecord: 1,
          endRecord: 1,
          totalRecords: 3
        }
      }
    },
    dateHistogram: {
      key: 'releases',
      path: ['releases'],
      type: 'dateHistogram',
      key_field: 'released',
      value_field: 'imdbVotes',
      interval: '3650d',
      context: {
        entries: [{
          key: 0,
          doc_count: 1,
          count: 1,
          min: 625633,
          max: 625633,
          avg: 625633,
          sum: 625633
        }, {
          key: 315360000000,
          doc_count: 3,
          count: 3,
          min: 74450,
          max: 557731,
          avg: 355868.3333333333,
          sum: 1067605
        }, {
          key: 630720000000,
          doc_count: 2,
          count: 2,
          min: 82360,
          max: 376362,
          avg: 229361,
          sum: 458722
        }, {
          key: 946080000000,
          doc_count: 4,
          count: 4,
          min: 28087,
          max: 395463,
          avg: 275019.25,
          sum: 1100077
        }, {
          key: 1261440000000,
          doc_count: 1,
          count: 1,
          min: 264551,
          max: 264551,
          avg: 264551,
          sum: 264551
        }],
        maxDate: null,
        minDate: null
      }
    }
  });
  var testTree = {
    getNode: function getNode(_ref) {
      var _ref2 = _slicedToArray(_ref, 1),
          path = _ref2[0];

      return tree[path];
    },
    mutate: _fp["default"].curry(function (_ref3, blob) {
      var _ref4 = _slicedToArray(_ref3, 1),
          path = _ref4[0];

      (0, _addonActions.action)('mutate')(path, blob);
      (0, _mobx.set)(tree[path], blob);
    })
  };
  testTree.lens = treeLens(testTree);
  var r = f(testTree);

  var Obj = function Obj() {
    return r;
  };

  Obj.prototype.toString = function () {
    return 'THIS IS A CONTEXTURE TEST TREE';
  };

  return new Obj();
};

exports["default"] = _default;
//# sourceMappingURL=testTree.js.map