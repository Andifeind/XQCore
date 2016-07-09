/*global XQCore:false */
'use strict';

function renderModel(model) {
  var mdlViewbox = document.getElementsByClassName('mdlViewbox')[0];
  var html = [
    '<div class="mdl">',
    '<span class="type-label">Model</span>',
    '<span class="label">Name:</span><span class="name">' + model.name + '</span>',
    '<span class="label">State:</span><span class="state">' + model.__state + '</span>',
    '<span class="label">Value:</span><span class="value">' + JSON.stringify(model.properties, null, '  ') + '</span>',
    '</div>'
  ].join('');

  mdlViewbox.innerHTML = html;
}

function loadSandbox() {
  var sandbox = document.getElementsByClassName('cmpSandbox')[0];
  var codebox = document.getElementsByClassName('cmpCodebox')[0];
  var cmpName = document.getElementsByClassName('cmpName')[0].innerText.toLowerCase();

  var cmp = new XQCore.Component(cmpName.charAt(0).toUpperCase() + cmpName.substr(1), 'username');
  console.log('CMP', cmp); // eslint-disable-line
  cmp.appendTo(sandbox);
  // cmp.render();

  if (cmpName === 'list') {
    var list = new XQCore.List('listing', function(self) {

    });

    var presenter; // eslint-disable-line
    presenter = new XQCore.Presenter('listing', function(self) {
      self.coupleComponent(cmp, list);
    });

    list.push({ value: 'Foo' });
    list.push({ value: 'Bar' });

    setTimeout(function() {
      list.push({ value: 'Bla' });
    }, 2000);

    setTimeout(function() {
      list.push({ value: 'Blubb' });
    }, 4000);
  }
  else if (cmpName === 'input') {
    var model = new XQCore.Model('input', function(self) {
      self.schema = {
        username: { type: 'string', min: 3, max: 25 }
      };
    });

    var presenter; // eslint-disable-line
    presenter = new XQCore.Presenter('input', function(self) {
      self.coupleComponent(cmp, model);
    });


    var render = function() {
      renderModel(model);
      codebox.textContent = cmp.toHTML();
    };

    model.on('state.change', render);
    model.on('data.change', render);
    render();
  }
  else if(cmpName === 'tooltip') {
    cmp.content = 'Tooltip message!';
    codebox.textContent = cmp.toHTML();

    // add toogle button
    var stateToggle = document.createElement('button');
    stateToggle.textContent = 'Set inactive';
    stateToggle.style.marginTop = '40px';
    stateToggle.addEventListener('click', function() {
      cmp.active = !cmp.active;
      stateToggle.textContent = cmp.active ? 'Set inactive' : 'Set active';
    });

    sandbox.appendChild(stateToggle);
  }
  else {
    codebox.textContent = cmp.toHTML();
  }
}

document.addEventListener('DOMContentLoaded', loadSandbox);
