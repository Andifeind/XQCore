/*global XQCore:false */
'use strict';

function loadSandbox() {
  var sandbox = document.getElementsByClassName('cmpSandbox')[0];
  var codebox = document.getElementsByClassName('cmpCodebox')[0];
  var cmpName = document.getElementsByClassName('cmpName')[0].innerText;

  var cmp = new XQCore.Component(cmpName.charAt(0).toUpperCase() + cmpName.substr(1));
  console.log('CMP', cmp); // eslint-disable-line
  cmp.appendTo(sandbox);

  codebox.textContent = cmp.toHTML();
}

document.addEventListener('DOMContentLoaded', loadSandbox);
