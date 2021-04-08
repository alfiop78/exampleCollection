(() => {
  var app = {
    dropDown: null
  };

  document.querySelectorAll('input[type="search"]').forEach((item, i) => {
    item.onclick = (e) => {
      // console.log(e.target);
      // e.target.parentElement.querySelector('.elements').toggleAttribute('show');
      app.dropDown = new Dropdown(e.currentTarget.parentElement);
      // applico il toggleAttribute su .elements
      app.dropDown.toggle();
      // imposto evento oniput sulla input search
      app.dropDown.input.oninput = app.inputSearch;
    };
  });
  // single selection
  document.querySelectorAll('ul.filters[single] > .item').forEach((item, i) => {
    item.onclick = (e) => {
      // console.log(e.target, e.path);
      // metto nella input il valore selezionato e chiudo la select
      debugger;
      app.dropDown.input.value = e.currentTarget.querySelector('li').getAttribute('value');
      app.dropDown.label.classList.add('has-content');
      app.dropDown.toggle();
    };
  });
  // multi-selection
  document.querySelectorAll('ul.filters[multi] > .item').forEach((item, i) => {
    item.onclick = (e) => {
      // console.log('multi', e.target, e.path);
      // console.log(e.currentTarget);
      e.currentTarget.toggleAttribute('checked');
      (e.currentTarget.hasAttribute('checked')) ? e.currentTarget.querySelector('input').checked = true : e.currentTarget.querySelector('input').checked = false;
    };
  });

  document.querySelectorAll('.filterButton > button[done]').forEach((item, i) => {
    item.onclick = (e) => {
      app.dropDown.toggle();
      // se ci sono elementi checked=true posso inserire <multi> nella input altrimenti lascio vuoto
      (app.dropDown.ul.querySelectorAll('input:checked').length > 0) ?
        app.dropDown.input.value = "<multi>" : app.dropDown.input.value = "";
      app.dropDown.label.classList.add('has-content');
    };
  });

  app.inputSearch = (e) => {
    console.log(e.target.value);
    if (e.target.value.length === 0) {app.dropDown.label.classList.remove("has-content");}
    // la stringa da ricercare, convertita in lowercase
    app.dropDown.search(e.target.value.toLowerCase());
  }

})();
