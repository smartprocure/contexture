import React from 'react'

export default () => (
  <style>
    {`
      h1 { font-size: 22px; }
      
      .gv-table {
        border-collapse: collapse;
        width: 100%;
      }
      .gv-table tbody tr {
        border-bottom: solid 2px #EDEDED;
      }
      .gv-table td, .gv-table th {
        padding: 20px;
        text-align: left;
      }
      .gv-table thead tr {
        border-bottom: solid 2px #9ABCDA;
      }
      
      .gv-box {
        border-radius: 4px;
        background-color: #fff;
        box-shadow: 0 2px 2px 0 #EDEDED;
        padding: 15px;
      }
      
      body {
        margin: 0;
        background: #f6f6f6;
        font-family: Lato;
        font-size: 16px;
        color: #454545;
      }
      
      .gv-input, select, input {
        outline: none;
        font-size: 16px;
        font-family: Lato;
        
        border: solid 2px #EDEDED;
        background: #fff;
        
        width: 100%;
        display: block;
        box-sizing: border-box;
        height: 40px;
      }
      
      select, input {
        border-radius: 4px;
      }
      select {
        cursor: pointer;
      }
      
      .tags-input {
        border: 2px solid #EBEBEB;
        border-radius: 4px;
        min-height: 40px;
        box-sizing: border-box;
        margin: 5px auto;
        background: #fff;
        /* Arbitrary theme design */
        padding: 7px;
      }
      /* To reach perfect 40px, remove real input padding because we have it on the fake one */
      .tags-input input {
        padding: 0;
        /* subtract padding (5+5) and borders (2+2) from 40 */
        height: 26px;
        /* Arbitrary theme design */
        padding-left: 7px;
      }
      .tags-input-tag {
        border-radius: 4px;
        margin: 0 2px;
        /* Arbitrary theme design */
        padding: 3px 8px 5px 6px;
        font-size: 15px;
      }
      .tags-input-tag-remove {
        /* Arbitrary theme design */
        padding-left: 8px;
        font-size: 10px;
      }
      
      .contexture-facet a {
        color: #0076de
      }
      
      .popover {
        border-radius: 4px;
        box-shadow: 0 2px 4px 0 #ededed;
        border: 1px solid #ebebeb;
      }

      .filter-list-item {
        margin-bottom: 25px;
      }

      .gv-tab-container {
        display: flex;
      }

      .gv-tab {
        padding: 10px 20px;
        cursor: pointer;
      }

      .gv-tab.active {
        font-weight: bold;
        border-bottom: solid 2px #9ABCDA;
      }

      .gv-box.filter-list {
        background-color: transparent;
        padding: 0;
        box-shadow: none;
      }

      .gv-search-bar .gv-box {
        padding: 0;
        box-shadow: none;
      }

      .gv-search-bar .tags-input {
        margin: 0;
      }

      .gv-search-bar {
        display: grid;
        grid-template-columns: 1fr auto;
        grid-gap: 5px;
        top: 5px;
        z-index: 1;
        /* background: #f6f6f6; */
      }

      .gv-search-toolbar {
        display: flex;
        align-items: center;
        flex: 1;
        justify-content: space-evenly;
      }

      /* Icon Button */
      .gv-text-button {
        border-radius: 100px;
        padding: 0 5px;
        cursor: pointer;
        font-size: 20px;
        color: #9b9b9b;
        display: inline-flex;
        justify-content: center;
        align-items: center;
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
    `}
  </style>
)
