import React from 'react'

export default () => (
  <style>
    {`
      h1 {
        font-family: Lato;
        font-size: 18px;
        font-weight: bold;
        line-height: 1.3;
        letter-spacing: 3px;
        text-transform: uppercase;
        /*font-size: 22px;*/
        margin: 30px 0;
      }

      /* Button */
      .gv-button {
        padding: 11px 22px 12px 22px;
        border-radius: 3px;
        background-color: #e3e5e6;

        border: none;
        outline: none;
        font-size: 14px;
        font-weight: bold;
        letter-spacing: 2px;
        text-transform: uppercase;
        cursor: pointer;
        /* margin 5px ????? */
        transition: background-color .25s linear;
      }
      .gv-button.active, .gv-button.primary {
        background-color: #0076de;
        color: #fff;
      }
      .gv-button:disabled {
        cursor: not-allowed;
        opacity: 0.5;
      }
      .gv-button.success {
        background-color: #5bb85b !important;
      }
      .gv-button.danger {
        background-color: #d75050 !important;
      }
      .gv-button-radio > .gv-button {
        margin-right: 20px;
      }
      .gv-button-radio > .gv-button:last-child {
        margin-right: 0;
      }
      .gv-link-button {
        /* Same as a contexture-themed link */
        color: #0076DE;
        background-color: transparent;
        border: none;
        cursor: pointer;
        text-decoration: underline;
        display: inline;
        margin: 0;
        padding: 0;
      }
      .gv-link-button:hover,
      .gv-link-button:focus {
        text-decoration: none;
      }

      /* Table */
      .gv-table {
        border-collapse: collapse;
        width: 100%;
      }
      .gv-table tbody tr {
        border-bottom: solid 2px rgba(237, 237, 237, 0.43);
      }
      .gv-table td, .gv-table th {
        padding: 20px;
        text-align: left;
      }
      .gv-table th > span {
        display: flex;
        align-items: center;
      }

      /* Nested Table */
      .gv-table .expanded, .gv-table .expanded + tr {
        background: rgba(237, 237, 237, 0.5)
      }

      .gv-box {
        border-radius: 4px;
        background-color: #fff;
        box-shadow: 0 2px 10px 0 rgba(39, 44, 65, 0.1);
        padding: 15px;
      }

      body {
        margin: 0;
        background: #f6f6f6;
        font-family: Lato;
        font-size: 14px;
        color: #454545;
      }

      input.gv-input, textarea.gv-input {
        padding: 10px;
      }
      .gv-input, select, input {
        outline: none;
        font-size: 16px;
        font-family: Lato;

        border: solid 2px #EDEDED;
        background: #fff;

        display: block;
        width: 100%;
        min-width: 0;

        box-sizing: border-box;
        height: 40px;
      }

      select, input, textarea {
        border-radius: 4px;
      }
      select {
        cursor: pointer;
      }

      /* Checkbox */
      .gv-checkbox {
        height: 20px;
        width: 20px;
        border-radius: 3px;
        display: flex;
        justify-content: center;
        align-items: center;
        cursor: pointer;
      }
      .gv-checkbox i {
        font-size: 14px;
        font-weight: bold;
      }

      /* CheckButton */
      .gv-button.check-button {
        padding: 5px 23px 5px 10px;
      }
      .gv-button.check-button .gv-checkbox {
        height: 30px;
        width: 30px;
        font-size: 20px;
        margin-right: 8px;
      }
      .gv-button.check-button .gv-checkbox i {
        font-size: 20px;
      }
      .gv-button.check-button .gv-checkbox.checked {
        color: #0076de;
        background-color: transparent;
        border-color: transparent;
      }

      /* Radio Buttons */
      .gv-radio {
        width: 16px;
        height: 16px;
        background: #FFFFFF;
        border: 2px solid #EDEDED;
        border-radius: 50%;
        display: inline-flex;
        align-items: center;
        justify-content: center;
      }
      .gv-radio-dot.active {
        width: 14px;
        height: 14px;
        background: #007AFF;
        border-radius: 50%;
      }
      .gv-radio-label {
        padding-left: 10px;
      }
      .gv-radio-option {
        cursor: pointer;
        display: flex;
        align-items: center;
        margin-right: 25px;
      }
      .gv-radio-list {
        display: flex;
      }


      /* Tags Input */
      .tags-input-one-line {
        max-height: 40px;
        overflow-y: auto;
      }
      .tags-input-one-line::-webkit-scrollbar {
        -webkit-appearance: none;
      }
      .tags-input-one-line::-webkit-scrollbar-thumb {
        border-radius: 8px;
        border: 2.5px solid #f1f1f1; /* should match background, can't be transparent */
        background-color: #c2c2c2;
      }
      .tags-input-one-line::-webkit-scrollbar-track {
        background-color: #f1f1f1;
        border-radius: 5px;
        border-top-left-radius: 0;
        border-bottom-left-radius: 0;
      }
      .tags-input > * {
        box-sizing: border-box;
      }
      .tags-input {
        border: 2px solid #EBEBEB;
        border-radius: 4px;
        background: #fff;
      }
      .tags-input input {
        height: 30px;
      }
      .tags-input-tag-remove {
        font-size: 12px;
        padding: 8px;
      }

      /* Tags Popover */
      .tags-input-popover {
        /* counteract default popover padding */
        margin: -5px;
      }
      .tags-input-popover > div {
        border-bottom: solid 1px rgba(216, 216, 216, 0.3);
        padding: 15px;
      }
      .tags-input-popover .popover-item:first-child {
        padding-top: 0;
      }
      .tags-input-popover .popover-item {
        padding-top: 10px;
      }

      /* Pager */
      .gv-pager {
        position: relative;
        top: 50px;
      }
      .gv-pager-item {
        padding: 5px;
        width: 30px;
        background: white;
        border-radius: 2px;
        cursor: pointer;
        display: inline-block;
        box-sizing: border-box;
        text-align: center;
        margin: 0 2.5px;
        color: #9b9b9b;
      }
      .gv-pager-item:hover {
         background: #f5f5f5;
      }
      .gv-pager-item.active {
        background-color: #0076de;
        color: #fff;
      }
      .gv-pager-item.disabled {
        cursor: not-allowed;
        pointer-events: none;
      }
      .contexture-result-pager {
        display: flex;
        align-items: center;
      }
      .contexture-result-pager .gv-pager-item:first-child {
        margin-right: 20px;
      }
      .contexture-result-pager .gv-pager-item:last-child {
        margin-left: 20px;
      }
      .contexture-result-pager .gv-pager-item:first-child.disabled,
      .contexture-result-pager .gv-pager-item:last-child.disabled {
        display: none;
      }

      /* Icon Button */
      .gv-text-button {
        border-radius: 100px;
        padding: 5px;
        cursor: pointer;
        color: #9b9b9b;
        display: inline-block;
        transition: background-color .1s linear, color .1s linear;
      }
      .gv-text-button > * {
        vertical-align: middle;
      }
      .gv-text-button i {
        width: 20px;
        height: 20px;
        font-size: 20px;
      }
      .gv-text-button:hover {
        background-color: rgba(216, 216, 216, 0.4);
        color: #000;
      }
      .gv-text-button.active, .gv-text-button.primary {
        background-color: #0076de;
        color: #fff;
      }


      /* Button Group Border Radii */
      .gv-button-group {
        border-radius: 3px;
        display: flex;
        overflow: hidden;
      }
      .gv-button-group > :first-child {
        border-top-right-radius: 0px;
        border-bottom-right-radius: 0px;
      }
      .gv-button-group > :last-child {
        border-top-left-radius: 0px;
        border-bottom-left-radius: 0px;
      }


      /* Search Bar + Button */
      .gv-search-bar {
        display: grid;
        grid-template-columns: 1fr auto;
        grid-gap: 30px;
        top: 5px;
        z-index: 1;
        /*background: #f6f6f6;*/
      }
      .gv-search-bar .gv-box {
        padding: 8px 10px;
        display: flex;
        flex-direction: column;
        justify-content: center;
        align-items: stretch;
      }
      .gv-search-bar > .gv-button-group {
        box-shadow: 0 2px 10px 0 rgba(39, 44, 65, 0.1);
      }
      .gv-search-bar .gv-box .tags-input {
        margin: 0;
        border: none;
      }
      .gv-search-button {
        font-size: 18px;
      }
      .gv-search-toolbar {
        display: flex;
        align-items: center;
        padding: 15px;
        background-color: #fff;
      }
      .gv-search-toolbar .gv-text-button {
        margin-right: 5px;
      }
      .gv-search-toolbar .gv-text-button:last-child {
        margin-right: 0;
      }


      .contexture-facet a {
        color: #0076de
      }
      .contexture-facet {
        font-size: 14px;
      }
      .contexture-facet > label {
        margin: 5px 0;
      }
      .contexture-facet .gv-checkbox {
        margin: 0 10px 0 0;
      }
      .contexture-facet > .gv-input[type="text"] {
        margin-bottom: 10px;
      }
      .contexture-facet-cardinality {
        margin: 10px 0;
      }
      .contexture-facet > label > div {
        overflow: hidden;
        text-overflow: ellipsis;
      }

      .contexture-number-separator {
        margin: 0 10px;
      }
      .contexture-number-best-range {
        margin-top: 15px;
      }

      /* Min Height here is to align better in QueryBuilder */
       .gv-radio-list {
        min-height: 40px;
      }

      /* Tabs */
      .gv-tab-container .gv-tab {
        display: inline-block;
        padding: 15px 20px;
        background-color: #e0e0e3;
        font-size: 14px;
        font-weight: bold;
        cursor: pointer;
        vertical-align: bottom;
        border-left: solid 1px #c4c5ca;
        transition: background-color 0.1s linear;
        text-align: center;
      }
      .gv-tab.active + .gv-tab {
        border-left: none;
      }
      .gv-tab:last-child {
        border-radius: 0 4px 0 0;
      }
      .gv-tab:first-child {
        border-radius: 4px 0 0 0;
        border-left: none;
      }
      .gv-tab.active, .gv-tab.active:hover {
        background-color: #fff;
        font-size: 16px;
        padding: 15px 30px;
        border-radius: 4px 4px 0 0 !important;
        /* white box shadow trick from http://dev.housetrip.com/2012/06/15/good-looking-css-tabs/ */
        box-shadow: 0 10px 0 0 #fff, 0 2px 10px 0 rgba(39, 44, 65, 0.1);
        border-left: none;
      }
      .gv-tab:hover {
        background-color: rgba(147,149,160, 0.5);
      }


      /* Filter List */
      .filter-list.gv-box {
        padding: 30px;
      }
      .filter-list-item {
        border-bottom: solid 1px rgba(216, 216, 216, 0.3);
        padding-bottom: 30px;
        margin-bottom: 30px;
        margin-left: -30px;
        margin-right: -30px;
        padding-left: 30px;
        padding-right: 30px;
      }
      .filter-field-label {
        font-size: 16px;
        font-weight: bold;
      }
      .filter-field-label-icon {
        color: #9b9b9b;
      }
      .filter-field-has-value {
        color: #0076de;
      }
      .filter-field-icon-refresh .gv-text-button {
        color: #0076de;
      }
      .filter-field-icon-refresh .gv-text-button:hover {
        color: #f6f6f6;
        background-color: #0076de;
      }
      .filter-list-item-contents {
        margin-top: 15px;
      }

      .filter-list-group {
        border-left: solid 2px;
        padding-left: 35px; /* 30 for filter-list-item + 5 space */
        margin-left: -30px;
        margin-top: -25px; /* -30 for filter-list-item + 5 space */
        padding-top: 30px;
      }

      .filter-actions-popover {
        userSelect: none;
        marginTop: 0.5rem;
        min-width: 5rem;
        transform: translateX(-2.25rem);
        lineHeight: 1.4rem;
      }
      .filter-actions-selected-type {
        opacity: 0.7;
        color: initial !important;
        cursor: default !important;
      }
      .filter-actions-separator {
        border-bottom: 1px solid #eee;
        margin: 4px -5px;
      }

      .popover {
        border-radius: 3px;
        box-shadow: 0 2px 10px 0 rgba(39, 44, 65, 0.1);
        border: solid 1px #f1f1f1;
        padding: 5px;
      }

      .panel-tree-picker {
        max-height: 640px;
      }
      .panel-tree-picker > div {
        border-right: solid 1px #eef0f1;
      }
      .panel-tree-picker > div:last-child {
        border-right: none;
      }

      .gv-text-error {
        color: #D75050;
      }
      .gv-block-error {
        margin: 15px 0;
        color: #D75050;
        background-color: #D7505011;
        padding: 12px;
        border-radius: 5px;
      }

      .labeled-checkbox {
        display: flex;
      }
      .labeled-checkbox > span {
        padding-left: 10px;
      }

      /* Reset to standard */
      .react-date-picker * {
        font-size: 16px;
      }
      .react-date-picker abbr {
        text-decoration-line: none;
        font-size: 11px;
      }
      .react-date-picker, .react-date-picker__wrapper {
        width: 100%;
      }
      .react-date-picker__wrapper {
        border: 2px solid #ededed!important;
        border-radius: 4px;
      }
      .react-date-picker__inputGroup__input {
        min-width: 20px!important;
        text-align: center;
        border: none!important;
        height: 40px;
      }
      .react-date-picker__inputGroup__input::placeholder {
        opacity: 0.5;
      }
      .react-date-picker__inputGroup__year {
        min-width: 40px!important;
      }
      .react-calendar__month-view__days__day--weekend {
        color: #000;
      }
      .react-calendar__month-view__days__day--neighboringMonth {
        color: #969696;
      }
      .react-calendar__navigation {
        margin-bottom: 0;
      }
      /* GV BOX it up */
      .react-calendar {
        border: 2px solid #ededed;
        border-radius: 4px;
        background-color: #fff;
        box-shadow: 0 2px 10px 0 rgba(39, 44, 65, 0.1);
        padding: 15px;
        width: 400px !important;
      }

      /* Modals */
      .default-modal-wrap {
        width: auto;
        max-width: 800px;
        border: 30px solid white;
        overflow: auto;
      }

      /* FilterButtonList */
      .filter-button-list.nested {
        border: 2px solid;
        border-radius: 6px;
        padding: 3px 5px;
        margin: 2px 5px;
      }
      .filter-button-list .check-button {
        margin: 5px;
        white-space: nowrap;
      }
      .filter-button-list > *:first-child {
        margin-left: 0;
      }
      .filter-button-list > *:last-child {
        margin-right: 0;
      }

      /* Query Wizard */
      .steps-accordion .accordion-step {
        padding: 40px;
        border-bottom: 1px solid #eef0f1;
      }
      .steps-accordion .gv-button {
        margin-right: 10px;
        margin-top: 5px;
        margin-bottom: 5px;
      }
      .steps-accordion .step-contents {
        margin: 30px 0;
      }
    
      .steps-accordion .accordion-step-title > * {
        margin: 0;
      }
      .steps-accordion .accordion-step-title span.step-number {
        color: #0076de;
      }
      .steps-accordion .back-button i {
        vertical-align: middle;
        line-height: 14px;
        margin: 0 10px 0 -5px;
        opacity: 0.4;
      }
      .steps-accordion .gv-button:first-child {
        margin-left: 0;
        margin-top: 5px;
        margin-bottom: 5px;
      }
      .filter-button-modal {
        min-width: 300px;
      }
      .filter-button-modal * {
        max-width: 480px;
      }
      .filter-button-modal h1 {
        margin: 0;
      }
      .filter-button-modal .filter-description {
        margin: 20px 0;
        color: #4a4a4a;
        line-height: 1.5;
      }
      .filter-button-modal .filter-component {
        margin: 30px 0;
      }
      .filter-button-modal .gv-button {
        margin-right: 10px;
      }
    `}
  </style>
)
