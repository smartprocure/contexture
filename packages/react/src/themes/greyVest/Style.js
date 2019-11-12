import React from 'react'

let filterListMargin = 16

/*
Styles for the Grey Vest theme. These are ~external~ to the Grey Vest library,
and are meant for styling generic contexture-react components according to the
theme.
*/
export default () => (
  <style>
    {`
      /* Tags Query */

      .tags-query {
        border: 2px solid #EBEBEB;
        border-radius: 4px;
        background: #fff;
      }
      .tags-query .tags-input {
        border: 0;
      }

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
  

      /* ResultPager */

      .contexture-result-pager {
        display: flex;
        align-items: center;
        position: relative;
        top: 50px;
        border-radius: 4px;
        background-color: #fff;
        box-shadow: 0 2px 10px 0 rgba(39, 44, 65, 0.1);
        padding: 15px;
      }


      /* Facet */

      .contexture-facet a, .contexture-facet-select a {
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
        margin-top: 10px;
      }
      .contexture-facet > label > div {
        overflow: hidden;
        text-overflow: ellipsis;
      }


      /* Number ExampleType */

      .contexture-number-separator {
        margin: 0 10px;
      }
      .contexture-number-best-range {
        margin-top: 15px;
      }


      /* Filter List */

      .apply-filter-button button {
        margin-top: 10px;
        width: 100%;
      }

      .filter-list.gv-box {
        padding: ${filterListMargin}px;
      }
      .filter-list-item {
        border-bottom: solid 1px rgba(216, 216, 216, 0.3);
        padding-bottom: ${filterListMargin}px;
        margin-bottom: ${filterListMargin}px;
        margin-left: -${filterListMargin}px;
        margin-right: -${filterListMargin}px;
        padding-left: ${filterListMargin}px;
        padding-right: ${filterListMargin}px;
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
      .filter-list-item-contents {
        margin-top: 15px;
      }
      .filter-list-group {
        border-left: solid 2px;
        padding-left: ${filterListMargin +
          5}px; /* 30 for filter-list-item + 5 space */
        margin-left: -${filterListMargin}px;
        margin-top: -${filterListMargin -
          5}px; /* -30 for filter-list-item + 5 space */
        padding-top: ${filterListMargin}px;
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


      /* Filter Button List */

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


      /* Steps Accordion */

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
    `}
  </style>
)
