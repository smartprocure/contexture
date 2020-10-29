"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.emojiDataset = exports.resultTableProps = exports.withInfer = exports.story = exports["default"] = void 0;

var _fp = _interopRequireDefault(require("lodash/fp"));

var _react = _interopRequireDefault(require("react"));

var _themePicker = _interopRequireDefault(require("./stories/themePicker"));

var _MemoryTable = _interopRequireDefault(require("./MemoryTable"));

var _emojiData = _interopRequireDefault(require("./exampleTypes/stories/emojiData"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { "default": obj }; }

var _default = {
  title: 'MemoryTable',
  component: _MemoryTable["default"],
  decorators: [(0, _themePicker["default"])('greyVest')],
  parameters: {
    componentSubtitle: "A ResultTable from arbitrary data using contexture's memory provider",
    info: "\nMemoryTable is built on top of ResultTable and supports several of the same props: most notably `fields`, which takes a schema object that specifies which fields from the data are visible in the table and how they are ordered, and `infer`, which enables MemoryTable to infer field information from the given data without having to explicitly specify it in `fields`.\n\nHowever, in place of ResultTable's contexture-relevant `tree`/`node`/`path` props, MemoryTable simply accepts a `data` prop, which should be an array of obects. This is fed into a contexture instance running on the `memory` provider, which allows contexture to work against data in the form of plain Javascript objects (in contrast to, for example, a MongoDB database). The result is a dynamically-generated table with built-in support for sorting and filtering operations on the given data.\n"
  }
};
exports["default"] = _default;

var story = function story() {
  return /*#__PURE__*/_react["default"].createElement(_MemoryTable["default"], {
    data: _fp["default"].times(function (x) {
      return {
        id: x,
        value: _fp["default"].random(0, 20000)
      };
    }, 221),
    fields: {
      id: {
        label: '#'
      },
      value: {
        label: 'Count'
      }
    }
  });
};

exports.story = story;

var withInfer = function withInfer() {
  return /*#__PURE__*/_react["default"].createElement(_MemoryTable["default"], {
    infer: true,
    data: _fp["default"].times(function (x) {
      return {
        id: x,
        value: _fp["default"].random(0, 20000)
      };
    }, 221)
  });
};

exports.withInfer = withInfer;

var resultTableProps = function resultTableProps() {
  return /*#__PURE__*/_react["default"].createElement(_MemoryTable["default"], {
    data: _fp["default"].times(function (x) {
      return {
        id: x,
        value: _fp["default"].random(0, 20000)
      };
    }, 221),
    fields: {
      id: {
        label: '#'
      },
      value: {
        label: 'Count'
      }
    },
    pageSizeOptions: [12, 24, 48, 96]
  });
};

exports.resultTableProps = resultTableProps;

var emojiDataset = function emojiDataset() {
  return /*#__PURE__*/_react["default"].createElement(_MemoryTable["default"], {
    data: require('emoji-datasource'),
    fields: _emojiData["default"]
  });
};

exports.emojiDataset = emojiDataset;
//# sourceMappingURL=MemoryTable.stories.js.map