'use strict';

function loadSandbox() {
  var sandbox = document.getElementsByClassName('cmpSandbox')[0];
  var cmpName = document.getElementsByClassName('cmpName')[0].innerText;

  var cmp = XQCore.Component(cmpName);
  sandbox.innerHTML = cmp.render({});
}

document.addEventListener('DOMContentLoaded', loadSandbox);
