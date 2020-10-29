"use strict";

var _react = _interopRequireDefault(require("react"));

var _fp = _interopRequireDefault(require("lodash/fp"));

var _react2 = require("@storybook/react");

var _recompose = require("recompose");

var _2 = require(".");

var _decorator = _interopRequireDefault(require("./stories/decorator"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { "default": obj }; }

var GridItem = (0, _recompose.defaultProps)({
  className: 'gv-grid-item'
})(_2.GridItem);
(0, _react2.storiesOf)('GreyVest Library|Grid', module).addDecorator(_decorator["default"]).add('Grail Demo', function () {
  return /*#__PURE__*/_react["default"].createElement(_react["default"].Fragment, null, /*#__PURE__*/_react["default"].createElement("style", null, "\n        .gv-grid-item {\n          border: 2px solid black;\n        }\n      "), /*#__PURE__*/_react["default"].createElement(_2.Grid, {
    gap: "20px 30px",
    areas: ['header header header', 'left main right', 'footer footer footer'],
    rows: "2fr 5fr 1fr",
    columns: "1fr 3fr 1fr"
  }, /*#__PURE__*/_react["default"].createElement(GridItem, {
    area: "header"
  }, "header"), /*#__PURE__*/_react["default"].createElement(GridItem, {
    area: "footer"
  }, "footer"), /*#__PURE__*/_react["default"].createElement(GridItem, {
    area: "main"
  }, "main content"), /*#__PURE__*/_react["default"].createElement(GridItem, {
    area: "right"
  }, "right sidebar"), /*#__PURE__*/_react["default"].createElement(GridItem, {
    area: "left"
  }, "left sidebar")));
}).add('GridItem positioning', function () {
  return /*#__PURE__*/_react["default"].createElement(_react["default"].Fragment, null, /*#__PURE__*/_react["default"].createElement("style", null, "\n        .gv-grid-item {\n          padding: 5px;\n          background-color: white;\n          display: inline-flex;\n          flex-flow: column wrap;\n          justify-content: center;\n          justify-self: stretch;\n          text-align: center;\n        }\n      "), /*#__PURE__*/_react["default"].createElement(_2.Grid, {
    columns: "repeat(8, 50px)",
    rows: "repeat(8, 50px)",
    gap: 2,
    style: {
      backgroundColor: 'lightgrey',
      display: 'inline-grid'
    }
  }, /*#__PURE__*/_react["default"].createElement(GridItem, {
    column: 4,
    row: 3
  }, "(4, 3)"), /*#__PURE__*/_react["default"].createElement(GridItem, {
    column: 4,
    row: 8,
    width: 5
  }, "(4, 8); 5w"), /*#__PURE__*/_react["default"].createElement(GridItem, {
    column: "7/9",
    row: 2,
    height: 4,
    placeSelf: "center center"
  }, "(7:9, 2); 4h"), /*#__PURE__*/_react["default"].createElement(GridItem, {
    column: "3/5",
    row: "4/8"
  }, "(3:5, 4:8)"), /*#__PURE__*/_react["default"].createElement(GridItem, {
    area: "2/1/4/3"
  }, "(1:3, 2:4)"), /*#__PURE__*/_react["default"].createElement(GridItem, null, "A"), /*#__PURE__*/_react["default"].createElement(GridItem, null, "B"), /*#__PURE__*/_react["default"].createElement(GridItem, {
    width: 2
  }, "C; 2w")));
}).add('Rows/columns shorthand', function () {
  return /*#__PURE__*/_react["default"].createElement(_2.Grid, {
    columns: 5,
    gap: 10
  }, _fp["default"].times(function (n) {
    return /*#__PURE__*/_react["default"].createElement("div", {
      style: {
        border: '2px solid black'
      }
    }, n);
  }, 20));
});
//# sourceMappingURL=Grid.stories.js.map