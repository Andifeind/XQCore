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
  var model;
  var render;

  var sandbox = document.getElementsByClassName('cmpSandbox')[0];
  var codebox = document.getElementsByClassName('cmpCodebox')[0];
  var cmpName = document.getElementsByClassName('cmpName')[0].innerText;
  cmpName = cmpName.charAt(0).toUpperCase() + cmpName.substr(1);

  var arg = 'username';
  if (cmpName === 'Form') {
    arg = [
      { name: 'title', type: 'string' },
      { name: 'description', type: 'text' },
      { name: 'submit', type: 'button', action: 'submit', label: '', content: 'Submit' }
    ];
  }
  else if (cmpName === 'Text') {
    arg = 'description';
  }

  var cmp = new XQCore.Component(cmpName, arg);
  console.log('CMP', cmp); // eslint-disable-line
  cmp.appendTo(sandbox);

  if (cmpName === 'List') {
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
  else if (cmpName === 'Input') {
    model = new XQCore.Model('input', function(self) {
      self.schema = {
        username: { type: 'string', min: 3, max: 25 }
      };
    });

    var presenter; // eslint-disable-line
    presenter = new XQCore.Presenter('input', function(self) {
      self.coupleComponent(cmp, model);
    });


    render = function() {
      renderModel(model);
      codebox.textContent = cmp.toHTML();
    };

    model.on('state.change', render);
    model.on('data.change', render);
    render();
  }
  else if (cmpName === 'Text') {
    model = new XQCore.Model('text', function(self) {
      self.schema = {
        description: { type: 'string', min: 3, max: 225 }
      };
    });

    var presenter; // eslint-disable-line
    presenter = new XQCore.Presenter('text', function(self) {
      self.coupleComponent(cmp, model);
    });


    render = function() {
      renderModel(model);
      codebox.textContent = cmp.toHTML();
    };

    model.on('state.change', render);
    model.on('data.change', render);
    render();
  }
  else if(cmpName === 'Form') {
    model = new XQCore.Model('todo', function(self) {
      self.schema = {
        title: { type: 'string', min: 3, max: 25 },
        description: { type: 'string', min: 3, max: 225 }
      };
    });

    var presenter; // eslint-disable-line
    presenter = new XQCore.Presenter('todo', function(self) {
      self.coupleComponent(cmp, model);
    });


    render = function() {
      renderModel(model);
      codebox.textContent = cmp.toHTML();
    };

    model.on('state.change', render);
    model.on('data.change', render);
    render();
  }
  else if(cmpName === 'Tooltip') {
    cmp.content = 'Tooltip message!';
    codebox.textContent = cmp.toHTML();

    // add toogle button
    var stateToggle = document.createElement('button');
    stateToggle.textContent = 'Set inactive';
    stateToggle.style.marginTop = '40px';
    stateToggle.style.width = '100px';
    stateToggle.addEventListener('click', function() {
      cmp.active = !cmp.active;
      stateToggle.textContent = cmp.active ? 'Set inactive' : 'Set active';
    });

    sandbox.appendChild(stateToggle);
  }
  else if(cmpName === 'ProgressBar') {
    cmp.value = 33;

    setTimeout(function() {
      cmp.value = 99;
    }, 2000);
  }
  else if(cmpName === 'Counter') {
    cmp.value = 0;

    setInterval(function() {
      cmp.value++;
    }, 200);
  }
  else if(cmpName === 'Button') {
    cmp.content = 'Click me!';
  }
  else if(cmpName === 'Grid') {
    ['A', 'B', 'C', 'D', 'E', 'F', 'G', 'H', 'I', 'J', 'K', 'L', 'M', 'N', 'O', 'P', 'Q', 'R', 'S'].forEach(function(item) {
      cmp.push({ value: item });
    });
  }
  else if(cmpName === 'Table') {
    cmp.child = function(data) {
      return '<tr><td>' + data.title + '</td><td>' + data.number + '</td><td>' + data.content + '</td></tr>';
    };

    cmp.push({
      title: 'Row one',
      number: '1',
      content: 'This is the first row'
    });

    cmp.push({
      title: 'Row two',
      number: '2',
      content: 'This is the second row'
    });

    cmp.push({
      title: 'Row three',
      number: '3',
      content: 'This is the third row'
    });
  }

  codebox.textContent = cmp.toHTML();
}

document.addEventListener('DOMContentLoaded', loadSandbox);
