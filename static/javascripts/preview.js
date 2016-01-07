var templateDataTable = document.getElementById('template-data');
var templateDataBody = templateDataTable.querySelector('tbody');
var addRow = document.getElementById('add-row');
var markdownTemplate = document.getElementById('markdown-template');
var parsedMarkdownTemplate = Mustache.parse(markdownTemplate.innerHTML);
var renderedTemplate = document.getElementById('rendered-template');
var commonmark = markdownit('commonmark');

function insertRow () {
  var newRow = document.createElement('tr');
  var keyCell = document.createElement('td');
  var valueCell = document.createElement('td');
  var removeRowCell = document.createElement('td');
  var keyInput = document.createElement('input');
  var valueInput = document.createElement('input');
  var removeRowButton = document.createElement('button');

  newRow.appendChild(keyCell);
  newRow.appendChild(valueCell);
  newRow.appendChild(removeRowCell);

  keyCell.appendChild(keyInput);
  valueCell.appendChild(valueInput);
  removeRowCell.appendChild(removeRowButton);

  keyCell.classList.add('key-cell');
  valueCell.classList.add('value-cell');
  removeRowButton.textContent = '-';

  templateDataBody.appendChild(newRow);
  keyInput.focus();

  keyInput.addEventListener('keypress', function (e) {
    if (e.keyCode == 13) {
      valueInput.focus();
    }
  });

  valueInput.addEventListener('keypress', function (e) {
    if (e.keyCode == 13) {
      insertRow();
    }
  });

  keyInput.addEventListener('keyup', renderTemplate);
  valueInput.addEventListener('keyup', renderTemplate);

  removeRowButton.addEventListener('click', function () {
    templateDataBody.removeChild(newRow);
    renderTemplate();
  });

  return newRow;
}

function collectData() {
  var data = {};
  for (var i=0; i<templateDataBody.rows.length; i++) {
    var row = templateDataBody.rows[i];
    data[row.querySelector('.key-cell input').value] = row.querySelector('.value-cell input').value;
  }
  return data;
}

function renderTemplate() {
  renderedTemplate.innerHTML = commonmark.render(
    Mustache.render(markdownTemplate.innerHTML, collectData()
  ));
}

function initializeData() {
  var data = {},
      variables = parsedMarkdownTemplate.filter(function (item) {
        if (item[0] == 'name') {
          return true;
        }
      }).map(function (item) {
        return item[1];
      }),
      search = location.search.substring(1),
      searchData = (search === '') ? {} : JSON.parse(
        '{"' + decodeURI(search).replace(/"/g, '\\"').replace(/&/g, '","').
                                 replace(/=/g,'":"') +
        '"}');

    variables.forEach(function (variable) {
      data[variable] = variable;
    });

    for (var key in searchData) {
      data[key] = searchData[key];
    }


    for (key in data) {
      var value = data[key],
          row = insertRow();

      row.querySelector('.key-cell input').value = key;
      row.querySelector('.value-cell input').value = value;
    }
}

addRow.addEventListener('click', insertRow);

initializeData();
insertRow();
renderTemplate();
