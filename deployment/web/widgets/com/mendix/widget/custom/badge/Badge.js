define(["react"],(function(e){"use strict";var t;!function(e){e.Number="number",e.DateTime="datetime"}(t||(t={}));var n,a={exports:{}};
/*!
    Copyright (c) 2018 Jed Watson.
    Licensed under the MIT License (MIT), see
    http://jedwatson.github.io/classnames
  */n=a,function(){var e={}.hasOwnProperty;function t(){for(var n=[],a=0;a<arguments.length;a++){var o=arguments[a];if(o){var l=typeof o;if("string"===l||"number"===l)n.push(o);else if(Array.isArray(o)){if(o.length){var r=t.apply(null,o);r&&n.push(r)}}else if("object"===l)if(o.toString===Object.prototype.toString)for(var i in o)e.call(o,i)&&o[i]&&n.push(i);else n.push(o.toString())}}return n.join(" ")}n.exports?(t.default=t,n.exports=t):window.classNames=t}();var o=a.exports;const l=t=>{const{type:n,className:a,style:l,value:r,onClick:i,onKeyDown:s,tabIndex:c}=t;return e.createElement("span",{role:i||s?"button":void 0,className:o("widget-badge",n,a,{"widget-badge-clickable":i}),onClick:i,onKeyDown:s,style:l,tabIndex:c},r)};return function(t){var n,a,o;const r=e.useCallback((()=>{var e;(e=t.onClick)&&e.canExecute&&!e.isExecuting&&e.execute()}),[t.onClick]),i=e.useCallback((e=>{"Enter"!==e.key&&" "!==e.key||r()}),[r]),s=t.onClick&&t.onClick.canExecute;return e.createElement(l,{type:t.type,value:null!==(a=null===(n=t.value)||void 0===n?void 0:n.value)&&void 0!==a?a:"",onClick:s?r:void 0,onKeyDown:s?i:void 0,className:t.class,style:t.style,tabIndex:s?null!==(o=t.tabIndex)&&void 0!==o?o:0:void 0})}}));