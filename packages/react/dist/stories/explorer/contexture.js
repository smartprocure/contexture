"use strict";

function _typeof(obj) { "@babel/helpers - typeof"; if (typeof Symbol === "function" && typeof Symbol.iterator === "symbol") { _typeof = function _typeof(obj) { return typeof obj; }; } else { _typeof = function _typeof(obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; }; } return _typeof(obj); }

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports["default"] = exports.updateSchemas = exports.schemas = exports.updateClient = exports.es = void 0;

var F = _interopRequireWildcard(require("futil"));

var _contexture = _interopRequireDefault(require("contexture"));

var _contextureClient = require("contexture-client");

var _elasticsearchBrowser = _interopRequireDefault(require("elasticsearch-browser"));

var _contextureElasticsearch = _interopRequireDefault(require("contexture-elasticsearch"));

var _types = _interopRequireDefault(require("contexture-elasticsearch/src/types"));

var _schemaMapping = _interopRequireDefault(require("contexture-elasticsearch/src/example-types/schemaMapping"));

var _contextureMobx = _interopRequireDefault(require("../../utils/contexture-mobx"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { "default": obj }; }

function _getRequireWildcardCache() { if (typeof WeakMap !== "function") return null; var cache = new WeakMap(); _getRequireWildcardCache = function _getRequireWildcardCache() { return cache; }; return cache; }

function _interopRequireWildcard(obj) { if (obj && obj.__esModule) { return obj; } if (obj === null || _typeof(obj) !== "object" && typeof obj !== "function") { return { "default": obj }; } var cache = _getRequireWildcardCache(); if (cache && cache.has(obj)) { return cache.get(obj); } var newObj = {}; var hasPropertyDescriptor = Object.defineProperty && Object.getOwnPropertyDescriptor; for (var key in obj) { if (Object.prototype.hasOwnProperty.call(obj, key)) { var desc = hasPropertyDescriptor ? Object.getOwnPropertyDescriptor(obj, key) : null; if (desc && (desc.get || desc.set)) { Object.defineProperty(newObj, key, desc); } else { newObj[key] = obj[key]; } } } newObj["default"] = obj; if (cache) { cache.set(obj, newObj); } return newObj; }

function asyncGeneratorStep(gen, resolve, reject, _next, _throw, key, arg) { try { var info = gen[key](arg); var value = info.value; } catch (error) { reject(error); return; } if (info.done) { resolve(value); } else { Promise.resolve(value).then(_next, _throw); } }

function _asyncToGenerator(fn) { return function () { var self = this, args = arguments; return new Promise(function (resolve, reject) { var gen = fn.apply(self, args); function _next(value) { asyncGeneratorStep(gen, resolve, reject, _next, _throw, "next", value); } function _throw(err) { asyncGeneratorStep(gen, resolve, reject, _next, _throw, "throw", err); } _next(undefined); }); }; }

var es = {
  client: {}
};
exports.es = es;

var updateClient = function updateClient(config) {
  es.client = _elasticsearchBrowser["default"].Client(config);
  return updateSchemas();
};

exports.updateClient = updateClient;
var elasticsearchProvider = (0, _contextureElasticsearch["default"])({
  getClient: function getClient() {
    return es.client;
  },
  types: (0, _types["default"])()
});
var schemas = {};
exports.schemas = schemas;

var updateSchemas = /*#__PURE__*/function () {
  var _ref = _asyncToGenerator( /*#__PURE__*/regeneratorRuntime.mark(function _callee() {
    var result;
    return regeneratorRuntime.wrap(function _callee$(_context) {
      while (1) {
        switch (_context.prev = _context.next) {
          case 0:
            console.info('Dynamically reading elasticsearch schemas');
            _context.t0 = _schemaMapping["default"];
            _context.next = 4;
            return elasticsearchProvider.getSchemas();

          case 4:
            _context.t1 = _context.sent;
            result = _context.t0.exampleTypeSchemaMapping.call(_context.t0, _context.t1);
            F.mergeOn(schemas, result);
            return _context.abrupt("return", result);

          case 8:
          case "end":
            return _context.stop();
        }
      }
    }, _callee);
  }));

  return function updateSchemas() {
    return _ref.apply(this, arguments);
  };
}();

exports.updateSchemas = updateSchemas;

var _default = (0, _contextureMobx["default"])({
  // debug: true,
  types: _contextureClient.exampleTypes,
  service: (0, _contexture["default"])({
    schemas: schemas,
    providers: {
      elasticsearch: elasticsearchProvider
    }
  })
});

exports["default"] = _default;
//# sourceMappingURL=contexture.js.map