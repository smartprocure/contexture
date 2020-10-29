"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.geoCodeLocation = exports.getLocationInfo = exports.loadHereOptions = void 0;

var _fp = _interopRequireDefault(require("lodash/fp"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { "default": obj }; }

function _typeof(obj) { "@babel/helpers - typeof"; if (typeof Symbol === "function" && typeof Symbol.iterator === "symbol") { _typeof = function _typeof(obj) { return typeof obj; }; } else { _typeof = function _typeof(obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; }; } return _typeof(obj); }

function asyncGeneratorStep(gen, resolve, reject, _next, _throw, key, arg) { try { var info = gen[key](arg); var value = info.value; } catch (error) { reject(error); return; } if (info.done) { resolve(value); } else { Promise.resolve(value).then(_next, _throw); } }

function _asyncToGenerator(fn) { return function () { var self = this, args = arguments; return new Promise(function (resolve, reject) { var gen = fn.apply(self, args); function _next(value) { asyncGeneratorStep(gen, resolve, reject, _next, _throw, "next", value); } function _throw(err) { asyncGeneratorStep(gen, resolve, reject, _next, _throw, "throw", err); } _next(undefined); }); }; }

var defaultHereConfig = {
  app_id: 'KzmI0fMwTyOG10rqZacS',
  // TEMP EMAIL USED - USE/GET YOUR APP_ID
  app_code: 'PykXtnTUeH7DDM-RLlpwyA',
  // TEMP EMAIL USED - USE/GET YOUR APP_CODE
  country: 'USA',
  autocomplete: 'https://autocomplete.geocoder.api.here.com/6.2/suggest.json',
  geoCoding: 'https://geocoder.api.here.com/6.2/geocode.json?gen=9'
};

var formatAddress = function formatAddress(_ref) {
  var address = _ref.address,
      matchLevel = _ref.matchLevel;
  var country = address.country,
      district = address.district,
      city = address.city,
      state = address.state,
      street = address.street,
      county = address.county,
      postalCode = address.postalCode,
      houseNumber = address.houseNumber;
  street = "".concat(street, " ").concat(city, ", ").concat(county, ", ").concat(state);
  var geoLevel = {
    country: country,
    district: "".concat(district, " ").concat(city, " ").concat(state),
    city: "".concat(city, " ").concat(county, " ").concat(state),
    houseNumber: "".concat(houseNumber, " ").concat(street),
    county: "".concat(county, ", ").concat(state),
    state: "".concat(state, ", ").concat(country),
    postalCode: "".concat(city, " ").concat(county, ", ").concat(state, ", ").concat(postalCode),
    street: street,
    intersection: street
  };
  return geoLevel[matchLevel];
};

var loadHereOptions = /*#__PURE__*/function () {
  var _ref2 = _asyncToGenerator( /*#__PURE__*/regeneratorRuntime.mark(function _callee(inputValue) {
    var countryCode,
        hereConfig,
        _hereConfig,
        url,
        app_id,
        app_code,
        country,
        apiUrl,
        data,
        _args = arguments;

    return regeneratorRuntime.wrap(function _callee$(_context) {
      while (1) {
        switch (_context.prev = _context.next) {
          case 0:
            countryCode = _args.length > 1 && _args[1] !== undefined ? _args[1] : 'USA';
            hereConfig = _args.length > 2 && _args[2] !== undefined ? _args[2] : defaultHereConfig;

            if (!(inputValue.length <= 2)) {
              _context.next = 4;
              break;
            }

            return _context.abrupt("return", []);

          case 4:
            if (_typeof(countryCode) === 'object') {
              hereConfig = countryCode;
              countryCode = 'USA';
            }

            hereConfig.country = countryCode;
            _hereConfig = hereConfig, url = _hereConfig.autocomplete, app_id = _hereConfig.app_id, app_code = _hereConfig.app_code, country = _hereConfig.country;
            apiUrl = "".concat(url, "?app_id=").concat(app_id, "&app_code=").concat(app_code, "&country=").concat(country, "&query=").concat(inputValue);
            _context.next = 10;
            return fetch(apiUrl);

          case 10:
            _context.next = 12;
            return _context.sent.json();

          case 12:
            data = _context.sent;

            if (!data.error) {
              _context.next = 18;
              break;
            }

            console.error('loadHereOptions', data.error);
            throw new Error(data.error);

          case 18:
            return _context.abrupt("return", _fp["default"].getOr([], 'suggestions', data).map(function (d) {
              return {
                label: formatAddress(d),
                value: d.locationId
              };
            }));

          case 19:
          case "end":
            return _context.stop();
        }
      }
    }, _callee);
  }));

  return function loadHereOptions(_x) {
    return _ref2.apply(this, arguments);
  };
}();

exports.loadHereOptions = loadHereOptions;

var getLocationInfo = /*#__PURE__*/function () {
  var _ref3 = _asyncToGenerator( /*#__PURE__*/regeneratorRuntime.mark(function _callee2(locationId) {
    var hereConfig,
        url,
        app_id,
        app_code,
        apiUrl,
        data,
        _args2 = arguments;
    return regeneratorRuntime.wrap(function _callee2$(_context2) {
      while (1) {
        switch (_context2.prev = _context2.next) {
          case 0:
            hereConfig = _args2.length > 1 && _args2[1] !== undefined ? _args2[1] : defaultHereConfig;
            url = hereConfig.geoCoding, app_id = hereConfig.app_id, app_code = hereConfig.app_code;
            apiUrl = "".concat(url, "&app_id=").concat(app_id, "&app_code=").concat(app_code, "&locationid=").concat(locationId);
            _context2.next = 5;
            return fetch(apiUrl);

          case 5:
            _context2.next = 7;
            return _context2.sent.json();

          case 7:
            data = _context2.sent;

            if (!data.error) {
              _context2.next = 13;
              break;
            }

            console.error('geoCodeLocation', data.error);
            throw new Error(data.error);

          case 13:
            return _context2.abrupt("return", _fp["default"].get('Response.View.0.Result.0', data));

          case 14:
          case "end":
            return _context2.stop();
        }
      }
    }, _callee2);
  }));

  return function getLocationInfo(_x2) {
    return _ref3.apply(this, arguments);
  };
}();

exports.getLocationInfo = getLocationInfo;

var geoCodeLocation = /*#__PURE__*/function () {
  var _ref4 = _asyncToGenerator( /*#__PURE__*/regeneratorRuntime.mark(function _callee3(locationId) {
    var hereConfig,
        _args3 = arguments;
    return regeneratorRuntime.wrap(function _callee3$(_context3) {
      while (1) {
        switch (_context3.prev = _context3.next) {
          case 0:
            hereConfig = _args3.length > 1 && _args3[1] !== undefined ? _args3[1] : defaultHereConfig;
            _context3.t0 = _fp["default"].flow(_fp["default"].get('Location.DisplayPosition'), _fp["default"].mapKeys(_fp["default"].toLower));
            _context3.next = 4;
            return getLocationInfo(locationId, hereConfig);

          case 4:
            _context3.t1 = _context3.sent;
            return _context3.abrupt("return", (0, _context3.t0)(_context3.t1));

          case 6:
          case "end":
            return _context3.stop();
        }
      }
    }, _callee3);
  }));

  return function geoCodeLocation(_x3) {
    return _ref4.apply(this, arguments);
  };
}();

exports.geoCodeLocation = geoCodeLocation;
//# sourceMappingURL=geo.js.map