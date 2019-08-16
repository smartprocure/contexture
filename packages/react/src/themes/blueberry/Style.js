import React from 'react'

export default () => (
  <style>
    {`
      h1 { font-size: 22px; }
      
      .bb-table {
        border-collapse: collapse;
        width: 100%;
      }
      .bb-table tbody tr {
        border-bottom: solid 2px #EDEDED;
      }
      .bb-table td, .bb-table th {
        padding: 20px;
        text-align: left;
      }
      .bb-table thead tr {
        border-bottom: solid 2px #9ABCDA;
      }
      
      .bb-box {
        border-radius: 4px;
        background-color: #fff;
        box-shadow: 0 2px 2px 0 #EDEDED;
        padding: 15px;
      }
      
      .bb-body, body {
        margin: 0;
        background: #f6f6f6;
        font-family: Lato;
        font-size: 16px;
        color: #454545;
      }
      
      .bb-input, .bb-body select, .bb-body input {
        outline: none;
        font-size: 16px;
        font-family: Lato;
        
        border: solid 2px #EDEDED;
        background: #fff;
        
        display: block;
        width: 100%;
        
        box-sizing: border-box;
        height: 40px;
      }
      
      .bb-body select, .bb-body input {
        border-radius: 4px;
      }
      .bb-body select {
        cursor: pointer;
      }
      
      .bb-body .tags-input {
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
      .bb-body .tags-input input {
        padding: 0;
        /* subtract padding (5+5) and borders (2+2) from 40 */
        height: 26px;
        /* Arbitrary theme design */
        padding-left: 7px;
      }
      .bb-body .tags-input-tag {
        border-radius: 4px;
        margin: 0 2px;
        /* Arbitrary theme design */
        padding: 3px 8px 5px 6px;
        font-size: 15px;
      }
      .bb-body .tags-input-tag-remove {
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
    `}
  </style>
)
