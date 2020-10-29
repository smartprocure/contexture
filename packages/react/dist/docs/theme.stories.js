"use strict";

var _react = _interopRequireDefault(require("react"));

var _futil = _interopRequireDefault(require("futil"));

var _react2 = require("@storybook/react");

var _theme = require("../utils/theme");

var _react3 = require("../utils/react");

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { "default": obj }; }

function _extends() { _extends = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; }; return _extends.apply(this, arguments); }

var withStyle = function withStyle(style, Component) {
  return (0, _react3.wrapDisplayName)('withStyle', Component)(function (props) {
    return /*#__PURE__*/_react["default"].createElement(Component, _extends({
      style: style
    }, props));
  });
};

var VanillaButton = withStyle({
  backgroundColor: 'cornsilk',
  border: '2px solid tan',
  color: 'rosybrown'
}, 'button');
var StrawberryButton = withStyle({
  backgroundColor: 'lightcoral',
  border: '2px solid limegreen',
  color: 'greenyellow'
}, 'button');
var PearButton = withStyle({
  border: '2px solid olive',
  color: 'darkolivegreen',
  backgroundColor: 'yellowgreen'
}, 'button');
var GrapeButton = withStyle({
  border: '2px solid blueviolet',
  color: 'chartreuse',
  backgroundColor: 'mediumorchid'
}, 'button');
var ThemedButton = (0, _theme.withTheme)(function (_ref) {
  var theme = _ref.theme,
      children = _ref.children;
  return /*#__PURE__*/_react["default"].createElement(theme.Button, null, children);
});

var ButtonGroup = function ButtonGroup(_ref2) {
  var theme = _ref2.theme,
      _ref2$buttons = _ref2.buttons,
      buttons = _ref2$buttons === void 0 ? [] : _ref2$buttons;
  return _futil["default"].mapIndexed(function (button, i) {
    return /*#__PURE__*/_react["default"].createElement(theme.Button, {
      key: i
    }, button);
  })(buttons);
};

var ThemedButtonGroup = (0, _theme.withNamedTheme)('ButtonGroup')(ButtonGroup);
(0, _react2.storiesOf)('Theme API|Examples', module).add('Global defaults', function () {
  return /*#__PURE__*/_react["default"].createElement(_react["default"].Fragment, null, /*#__PURE__*/_react["default"].createElement(ThemedButton, null, "Default button from ", /*#__PURE__*/_react["default"].createElement("code", null, "withTheme")), /*#__PURE__*/_react["default"].createElement(_theme.ThemeConsumer, null, function (theme) {
    return /*#__PURE__*/_react["default"].createElement(theme.Button, null, "Default button from ", /*#__PURE__*/_react["default"].createElement("code", null, "ThemeConsumer"));
  }), /*#__PURE__*/_react["default"].createElement(_theme.ThemeProvider, {
    theme: {
      UnusedComponent: 'div'
    }
  }, /*#__PURE__*/_react["default"].createElement(ThemedButton, null, "Global defaults should work..."), /*#__PURE__*/_react["default"].createElement(_theme.ThemeConsumer, null, function (theme) {
    return /*#__PURE__*/_react["default"].createElement(theme.Button, null, "...with or without ThemeProvider");
  })));
}).add('Component-level defaults', function () {
  var DefaultVanillaButton = (0, _theme.withTheme)(function (_ref3) {
    var _ref3$theme$Button = _ref3.theme.Button,
        Button = _ref3$theme$Button === void 0 ? VanillaButton : _ref3$theme$Button,
        children = _ref3.children;
    return /*#__PURE__*/_react["default"].createElement(Button, null, children);
  });
  var DefaultVanillaFoo = (0, _theme.withTheme)(function (_ref4) {
    var _ref4$theme$Foo = _ref4.theme.Foo,
        Foo = _ref4$theme$Foo === void 0 ? VanillaButton : _ref4$theme$Foo,
        children = _ref4.children;
    return /*#__PURE__*/_react["default"].createElement(Foo, null, children);
  });
  return /*#__PURE__*/_react["default"].createElement(_theme.ThemeProvider, null, /*#__PURE__*/_react["default"].createElement(DefaultVanillaButton, null, "The global default for \"Button\" supercedes the component-level default"), /*#__PURE__*/_react["default"].createElement(DefaultVanillaFoo, null, "\"Foo\" has no global default, so it uses the component-level default"));
}).add('Theme precedence', function () {
  return /*#__PURE__*/_react["default"].createElement(_theme.ThemeProvider, {
    theme: {
      Button: VanillaButton,
      'ButtonGroup.Button': StrawberryButton
    }
  }, /*#__PURE__*/_react["default"].createElement(ThemedButton, null, "Top-level buttons are Vanilla"), /*#__PURE__*/_react["default"].createElement(ThemedButtonGroup, {
    buttons: ['Nested themes override top-level themes']
  }), /*#__PURE__*/_react["default"].createElement(ThemedButtonGroup, {
    theme: {
      Button: PearButton
    },
    buttons: ['Theme props override theme context']
  }));
}).add('withNamedTheme', function () {
  var UnnamedComponent = (0, _theme.withTheme)(function (_ref5) {
    var theme = _ref5.theme;
    return /*#__PURE__*/_react["default"].createElement(_react["default"].Fragment, null, /*#__PURE__*/_react["default"].createElement("div", null, "I am an anonymous component"), /*#__PURE__*/_react["default"].createElement(theme.Button, null, "Top-level buttons are Vanilla"));
  });
  var ExplicitlyNamedComponent = (0, _theme.withNamedTheme)('Jerry')(function (_ref6) {
    var theme = _ref6.theme;
    return /*#__PURE__*/_react["default"].createElement(_react["default"].Fragment, null, /*#__PURE__*/_react["default"].createElement("div", null, "I am also an anonymous component, but ", /*#__PURE__*/_react["default"].createElement("code", null, "withTheme"), " knows me as \"Jerry\""), /*#__PURE__*/_react["default"].createElement(theme.Button, null, "Jerry buttons are Strawberry!"));
  });
  var ButtonGroupGeorge = (0, _theme.withNamedTheme)('George')(ButtonGroup);
  return /*#__PURE__*/_react["default"].createElement(_theme.ThemeProvider, {
    theme: {
      Button: VanillaButton,
      'Jerry.Button': StrawberryButton,
      'George.Button': PearButton
    }
  }, /*#__PURE__*/_react["default"].createElement(UnnamedComponent, null), /*#__PURE__*/_react["default"].createElement("div", {
    style: {
      height: 20
    }
  }), /*#__PURE__*/_react["default"].createElement(ExplicitlyNamedComponent, null), /*#__PURE__*/_react["default"].createElement("div", {
    style: {
      height: 20
    }
  }), /*#__PURE__*/_react["default"].createElement("div", null, "This component is a ButtonGroup, but ", /*#__PURE__*/_react["default"].createElement("code", null, "withTheme"), " knows it as \"George\":"), /*#__PURE__*/_react["default"].createElement(ButtonGroupGeorge, {
    buttons: ['George buttons are Pear!']
  }));
});
(0, _react2.storiesOf)('Theme API|Examples/ThemeConsumer', module).add('Without name', function () {
  return /*#__PURE__*/_react["default"].createElement(_theme.ThemeProvider, {
    theme: {
      Button: VanillaButton,
      ButtonGroup: ButtonGroup,
      'ButtonGroup.Button': PearButton
    }
  }, /*#__PURE__*/_react["default"].createElement(_theme.ThemeConsumer, null, function (_ref7) {
    var Button = _ref7.Button;
    return /*#__PURE__*/_react["default"].createElement(Button, null, "Top-level buttons are Vanilla");
  }));
}).add('With name', function () {
  return /*#__PURE__*/_react["default"].createElement(_theme.ThemeProvider, {
    theme: {
      Button: VanillaButton,
      ButtonGroup: ButtonGroup,
      'ButtonGroup.Button': GrapeButton
    }
  }, /*#__PURE__*/_react["default"].createElement(_theme.ThemeConsumer, {
    name: "ButtonGroup"
  }, function (_ref8) {
    var Button = _ref8.Button;
    return /*#__PURE__*/_react["default"].createElement(Button, null, "ButtonGroup buttons are Grape!");
  }));
});

var IconButton = function IconButton(_ref9) {
  var _ref9$theme = _ref9.theme,
      Button = _ref9$theme.Button,
      Icon = _ref9$theme.Icon,
      children = _ref9.children;
  return /*#__PURE__*/_react["default"].createElement(Button, null, /*#__PURE__*/_react["default"].createElement(Icon, null), children);
};

var ThemedIconButton = (0, _theme.withNamedTheme)('IconButton')(IconButton);
(0, _react2.storiesOf)('Theme API|Examples/Multi-level nesting', module).add('With theme context', function () {
  return /*#__PURE__*/_react["default"].createElement(_theme.ThemeProvider, {
    theme: {
      Icon: function Icon() {
        return /*#__PURE__*/_react["default"].createElement("span", null, "\uD83C\uDF68");
      },
      Button: VanillaButton,
      'ButtonGroup.Button': ThemedIconButton,
      'ButtonGroup.IconButton.Icon': function ButtonGroupIconButtonIcon() {
        return /*#__PURE__*/_react["default"].createElement("span", null, "\uD83C\uDF53");
      },
      'ButtonGroup.IconButton.Button': StrawberryButton
    }
  }, /*#__PURE__*/_react["default"].createElement(ThemedIconButton, null, "Top-level Icon & Button theme"), /*#__PURE__*/_react["default"].createElement(ThemedButtonGroup, {
    buttons: ['ButtonGroup Icon & Button theme']
  }));
}).add('With theme props', function () {
  return /*#__PURE__*/_react["default"].createElement(_theme.ThemeProvider, {
    theme: {
      Icon: function Icon() {
        return /*#__PURE__*/_react["default"].createElement("span", null, "\uD83C\uDF68");
      },
      Button: VanillaButton
    }
  }, /*#__PURE__*/_react["default"].createElement(ThemedIconButton, null, "Top-level Icon & Button theme"), /*#__PURE__*/_react["default"].createElement(ThemedButtonGroup, {
    theme: {
      Button: ThemedIconButton,
      'IconButton.Icon': function IconButtonIcon() {
        return /*#__PURE__*/_react["default"].createElement("span", null, "\uD83C\uDF47");
      },
      'IconButton.Button': GrapeButton
    },
    buttons: ['ButtonGroup Icon & Button theme']
  }));
});
//# sourceMappingURL=theme.stories.js.map