"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports["default"] = void 0;

var _react = _interopRequireDefault(require("react"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { "default": obj }; }

var tableCellPadding = 8;
/*
Component styles for the Grey Vest library. Each of these should be associated
with a specific omponent in the lib. The css/emotion refactor will move each of
these styles into its respective component - when it's finished, we should be
able to kill this file.
*/

var _default = function _default() {
  return /*#__PURE__*/_react["default"].createElement("style", null, "\n      /* Globals? */\n      body {\n        margin: 0;\n        background: #f6f6f6;\n        font-family: Lato;\n        font-size: 14px;\n        color: #454545;\n      }\n      h1 {\n        font-family: Lato;\n        font-size: 18px;\n        font-weight: bold;\n        line-height: 1.3;\n        letter-spacing: 3px;\n        text-transform: uppercase;\n        /*font-size: 22px;*/\n        margin: 30px 0;\n      }\n\n      /* Button */\n      .gv-button {\n        padding: 11px 22px 12px 22px;\n        border-radius: 3px;\n        background-color: #e3e5e6;\n\n        border: none;\n        font-size: 14px;\n        font-weight: bold;\n        letter-spacing: 2px;\n        text-transform: uppercase;\n        cursor: pointer;\n        /* margin 5px ????? */\n        transition: background-color .25s linear;\n      }\n      .gv-button.active, .gv-button.primary {\n        background-color: #0076de;\n        color: #fff;\n      }\n      .gv-button:disabled {\n        cursor: not-allowed;\n        opacity: 0.5;\n      }\n      .gv-button.success {\n        background-color: #5bb85b !important;\n      }\n      .gv-button.danger {\n        background-color: #d75050 !important;\n      }\n      .gv-button-radio > .gv-button {\n        margin-right: 20px;\n      }\n      .gv-button-radio > .gv-button:last-child {\n        margin-right: 0;\n      }\n      .gv-link-button {\n        /* Same as a contexture-themed link */\n        color: #0076DE;\n        background-color: transparent;\n        border: none;\n        cursor: pointer;\n        text-decoration: underline;\n        display: inline;\n        margin: 0;\n        padding: 0;\n      }\n      .gv-link-button:hover,\n      .gv-link-button:focus {\n        text-decoration: none;\n      }\n      \n      /* Expandable */\n      .gv-expandable-icon {\n        color: #9b9b9b;\n        will-change: transform;\n        transition: transform .2s ease-in;\n        transform: rotate(-90deg);\n        cursor: pointer;\n      }\n      \n      .gv-expandable-icon.expanded {\n        transition: transform .2s ease-out;\n        transform: rotate(0);\n      }\n      \n      .gv-expandable-body {\n        overflow: hidden;\n        max-height: 0;\n        will-change: max-height;\n        transition: max-height .3s ease-out;\n      }\n\n      .gv-expandable-body.expanded {\n        overflow-y: auto;\n        max-height: 80vh;\n        transition: max-height .3s ease-in;\n      }\n\n      /* Table */\n      .gv-table {\n        border-collapse: collapse;\n        width: 100%;\n      }\n      .gv-table tbody tr {\n        border-bottom: solid 2px rgba(237, 237, 237, 0.43);\n      }\n\n      .gv-table td, .gv-table th {\n        padding: ".concat(tableCellPadding, "px;\n        text-align: left;\n      }\n      \n      .gv-table th {\n        background: #fff;\n        line-height: 1.05;\n        padding: 0;\n        position: sticky;\n        top: 0;\n        z-index: 2;\n      }\n\n      .gv-table th > span {\n        display: flex;\n        align-items: center;\n        box-sizing: border-box;\n        padding: ").concat(tableCellPadding, "px; \n        min-height: 45px;\n        background: #fff;\n        position: relative;\n        z-index: 2;\n      }\n      \n      .gv-table th:after {\n        content: '';\n        position: absolute;\n        left: 0;\n        top: 0;\n        width: 100%;\n        height: 100%;\n        border-bottom: 10px solid transparent;\n        border-image: linear-gradient(rgba(69, 69, 69, 0.1), rgba(0,0,0,0)) 30;\n      }\n      \n      .gv-table th:first-child > span ,\n      .gv-table td:first-child {\n        padding-left: ").concat(2 * tableCellPadding, "px; \n      }\n      \n      .gv-table th:last-child > span ,\n      .gv-table td:last-child {\n        padding-right: ").concat(2 * tableCellPadding, "px; \n      }\n\n      .gv-table-footer {\n        box-shadow: rgba(69, 69, 69, 0.1) 0 -4px 10px -2px;\n      }\n\n      .gv-box {\n        border-radius: 4px;\n        background-color: #fff;\n        box-shadow: 0 2px 10px 0 rgba(39, 44, 65, 0.1);\n        padding: 15px;\n      }\n\n      input.gv-input, textarea.gv-input {\n        padding: 10px;\n      }\n      .gv-input, select, input {\n        outline: none;\n        font-size: 16px;\n        font-family: Lato;\n\n        border: solid 2px #EDEDED;\n        background: #fff;\n\n        width: 100%;\n        min-width: 0;\n\n        box-sizing: border-box;\n        height: 40px;\n      }\n\n      select, input, textarea {\n        border-radius: 4px;\n      }\n      select {\n        cursor: pointer;\n      }\n\n      /* Checkbox */\n      .gv-checkbox {\n        height: 20px;\n        width: 20px;\n        min-height: 20px;\n        min-width: 20px;\n        max-height: 20px;\n        max-width: 20px;\n        border-radius: 3px;\n        display: flex;\n        justify-content: center;\n        align-items: center;\n        cursor: pointer;\n      }\n      .gv-checkbox i {\n        font-size: 14px;\n        font-weight: bold;\n      }\n\n      /* CheckButton */\n      .gv-button.check-button {\n        padding: 5px 23px 5px 10px;\n      }\n      .gv-button.check-button .gv-checkbox {\n        height: 30px;\n        width: 30px;\n        font-size: 20px;\n        margin-right: 8px;\n      }\n      .gv-button.check-button .gv-checkbox i {\n        font-size: 20px;\n      }\n      .gv-button.check-button .gv-checkbox.checked {\n        color: #0076de;\n        background-color: transparent;\n        border-color: transparent;\n      }\n\n      /* Radio Buttons */\n      .gv-radio {\n        min-width: 16px;\n        width: 16px;\n        height: 16px;\n        background: #FFFFFF;\n        border: 2px solid #EDEDED;\n        border-radius: 50%;\n        display: inline-flex;\n        align-items: center;\n        justify-content: center;\n      }\n      .gv-radio-dot.active {\n        width: 14px;\n        height: 14px;\n        background: #007AFF;\n        border-radius: 50%;\n      }\n      .gv-radio-label {\n        padding-left: 10px;\n      }\n      .gv-radio-option {\n        cursor: pointer;\n        display: flex;\n        align-items: center;\n        margin-right: 25px;\n      }\n      .gv-radio-list {\n        display: flex;\n      }\n\n\n      /* Tags Input */\n      .tags-input {\n        border: 2px solid #EBEBEB;\n        border-radius: 4px;\n        background: #fff;\n      }\n\n      .tags-input > * {\n        box-sizing: border-box;\n      }\n      .tags-input input {\n        height: 30px;\n      }\n      .tags-input-tag-remove {\n        font-size: 12px;\n        padding: 8px;\n      }\n\n      /* PagerItem */\n      .gv-pager-item {\n        padding: 5px;\n        min-width: 30px;\n        background: white;\n        border-radius: 2px;\n        cursor: pointer;\n        display: inline-block;\n        box-sizing: border-box;\n        text-align: center;\n        margin: 0 2.5px;\n        color: #9b9b9b;\n      }\n      .gv-pager-item:hover {\n         background: #f5f5f5;\n      }\n      .gv-pager-item.active {\n        background-color: #0076de;\n        color: #fff;\n      }\n      .gv-pager-item.disabled {\n        cursor: not-allowed;\n        pointer-events: none;\n      }\n      .gv-pager-item:first-child.disabled,\n      .gv-pager-item:last-child.disabled {\n        display: none;\n      }\n\n      /* Text Button */\n      .gv-text-button {\n        border-radius: 100px;\n        padding: 5px;\n        cursor: pointer;\n        color: #9b9b9b;\n        display: inline-block;\n        transition: background-color .1s linear, color .1s linear;\n        user-select: none;\n      }\n      .gv-text-button > * {\n        vertical-align: middle;\n      }\n      .gv-text-button i {\n        width: 20px;\n        height: 20px;\n        font-size: 20px;\n      }\n      .gv-text-button:hover {\n        background-color: rgba(216, 216, 216, 0.4);\n        color: #000;\n      }\n      .gv-text-button.active, .gv-text-button.primary {\n        background-color: #0076de;\n        color: #fff;\n      }\n\n\n      /* Button Group Border Radii */\n      .gv-button-group {\n        border-radius: 3px;\n        display: flex;\n        overflow: hidden;\n      }\n      .gv-button-group > :first-child {\n        border-top-right-radius: 0px;\n        border-bottom-right-radius: 0px;\n      }\n      .gv-button-group > :last-child {\n        border-top-left-radius: 0px;\n        border-bottom-left-radius: 0px;\n      }\n\n\n      /* Search Bar + Button */\n      .gv-search-bar {\n        display: grid;\n        grid-template-columns: 1fr auto;\n        grid-gap: 30px;\n        top: 5px;\n        z-index: 1;\n        /*background: #f6f6f6;*/\n      }\n      .gv-search-bar .gv-box {\n        padding: 8px 10px;\n        display: flex;\n        flex-direction: column;\n        justify-content: center;\n        align-items: stretch;\n      }\n      .gv-search-bar > .gv-button-group {\n        box-shadow: 0 2px 10px 0 rgba(39, 44, 65, 0.1);\n      }\n      .gv-search-bar .gv-box .tags-input {\n        margin: 0;\n        border: none;\n      }\n      .gv-search-button {\n        font-size: 18px;\n      }\n      .gv-search-toolbar {\n        display: flex;\n        align-items: center;\n        padding: 15px;\n        background-color: #fff;\n      }\n      .gv-search-toolbar .gv-text-button {\n        margin-right: 5px;\n      }\n      .gv-search-toolbar .gv-text-button:last-child {\n        margin-right: 0;\n      }\n\n      /* Min Height here is to align better in QueryBuilder */\n       .gv-radio-list {\n        min-height: 40px;\n      }\n\n      /* Tabs */\n      .gv-tab-container .gv-tab {\n        display: inline-block;\n        padding: 15px 20px;\n        background-color: #e0e0e3;\n        font-size: 14px;\n        font-weight: bold;\n        cursor: pointer;\n        vertical-align: bottom;\n        border-left: solid 1px #c4c5ca;\n        transition: background-color 0.1s linear;\n        text-align: center;\n      }\n      .gv-tab.active + .gv-tab {\n        border-left: none;\n      }\n      .gv-tab:last-child {\n        border-radius: 0 4px 0 0;\n      }\n      .gv-tab:first-child {\n        border-radius: 4px 0 0 0;\n        border-left: none;\n      }\n      .gv-tab.active, .gv-tab.active:hover {\n        background-color: #fff;\n        font-size: 16px;\n        padding: 15px 30px;\n        border-radius: 4px 4px 0 0 !important;\n        /* white box shadow trick from http://dev.housetrip.com/2012/06/15/good-looking-css-tabs/ */\n        box-shadow: 0 10px 0 0 #fff, 0 2px 10px 0 rgba(39, 44, 65, 0.1);\n        border-left: none;\n      }\n      .gv-tab:hover {\n        background-color: rgba(147,149,160, 0.5);\n      }\n\n      .popover {\n        border-radius: 3px;\n        box-shadow: 0 2px 10px 0 rgba(39, 44, 65, 0.1);\n        border: solid 1px #f1f1f1;\n        padding: 5px;\n      }\n\n      /* this is part of NestedPicker */\n      .panel-tree-picker {\n        max-height: 640px;\n      }\n      .panel-tree-picker > div {\n        border-right: solid 1px #eef0f1;\n      }\n      .panel-tree-picker > div:last-child {\n        border-right: none;\n      }\n\n      .gv-text-error {\n        color: #D75050;\n      }\n      .gv-block-error {\n        margin: 15px 0;\n        color: #D75050;\n        background-color: #D7505011;\n        padding: 12px;\n        border-radius: 5px;\n      }\n      .gv-grid > * {\n        min-width: 0;\n      }\n\n      .labeled-checkbox {\n        display: flex;\n      }\n      .labeled-checkbox > span {\n        padding-left: 10px;\n      }\n\n      /* Reset to standard */\n      .react-date-picker * {\n        font-size: 16px;\n      }\n      .react-date-picker abbr {\n        text-decoration-line: none;\n        font-size: 11px;\n      }\n      .react-date-picker, .react-date-picker__wrapper {\n        width: 100%;\n      }\n      .react-date-picker__wrapper {\n        border: 2px solid #ededed!important;\n        border-radius: 4px;\n      }\n      .react-date-picker__inputGroup__input {\n        min-width: 20px!important;\n        text-align: center;\n        border: none!important;\n        height: 40px;\n      }\n      .react-date-picker__inputGroup__input::placeholder {\n        opacity: 0.5;\n      }\n      .react-date-picker__inputGroup__year {\n        min-width: 40px!important;\n      }\n      .react-calendar__month-view__days__day--weekend {\n        color: #000;\n      }\n      .react-calendar__month-view__days__day--neighboringMonth {\n        color: #969696;\n      }\n      .react-calendar__navigation {\n        margin-bottom: 0;\n      }\n      /* GV BOX it up */\n      .react-calendar {\n        border: 2px solid #ededed;\n        border-radius: 4px;\n        background-color: #fff;\n        box-shadow: 0 2px 10px 0 rgba(39, 44, 65, 0.1);\n        padding: 15px;\n        width: 400px !important;\n      }\n\n      /* Modals */\n      .default-modal-wrap {\n        width: auto;\n        max-width: 800px;\n        border: 30px solid white;\n        overflow: auto;\n      }\n    "));
};

exports["default"] = _default;
//# sourceMappingURL=Style.js.map