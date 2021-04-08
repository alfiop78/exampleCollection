class Dropdown {
  constructor(mdField) {
    this.mdField = mdField;
    // console.log(this.mdField);
    this.elements = this.mdField.querySelector('.elements');
    // .elements è l'elemento su cui viene applicato l'attributo show
    // console.log(this.elements);
    // input search, dove verrà inserito l'elemento selezionato dalla dropdown
    this.input = this.mdField.querySelector('input[type="search"]');
    // label
    this.label = this.mdField.querySelector('label[for]');
    // se .elements > .filters ha l'attributo multi recupero anche il tasto 'ok'
    this.ul = this.elements.querySelector('ul');
    console.log(this.ul);
    if (this.ul.hasAttribute('multi')) {
      this.btnDone = this.elements.querySelector('.filterButton > button[done]');
    }
  }

  toggle() {
    // prima di mostrare/nascondere una dropdown chiude qualsiasi altra dropdown aperta nella pagina
    console.log(document.querySelectorAll('.elements[filter][show]'));
    document.querySelectorAll('.elements[filter]').forEach((item, i) => {
      // ciclo tutte le dropdown presenti nella pagina...
      // apro/chiudo la dropdown che è stata attivata e chiude tutte le altre attualmente aperte.
      (item === this.elements) ? this.elements.toggleAttribute('show') : item.removeAttribute('show');
    });
  }

  search(value) {
    /*
    value : stringa inserita nella textbox, convertita in lowercase
    */
    // input search, filtro gli elmementi all'interno del filtro
    // console.log(Array.from(this.ul.querySelectorAll('.item')));
    this.ul.querySelectorAll('.item').forEach((item, i) => {
      // console.log(item.value);
      // console.log(item.value.toString().indexOf(value));
      if ((item.getAttribute('data-search').toString().toLowerCase().indexOf(value) === -1) ) {
        // elemento non trovato nella dropdown, lo nascondo
        item.setAttribute('hidden', true);
      } else {
        item.removeAttribute('hidden');
      }
    });


  }

}

// init
(() => {
  var app = {
    dropDown: null
  };

  // attivazione della dropdown dalla input search
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

  // tasto ok nella dropdown multi-select
  document.querySelectorAll('.filterButton > button[done]').forEach((item, i) => {
    item.onclick = (e) => {
      app.dropDown.toggle();
      // se ci sono elementi checked=true posso inserire <multi> nella input altrimenti lascio vuoto
      (app.dropDown.ul.querySelectorAll('input:checked').length > 0) ?
        app.dropDown.input.value = "<multi>" : app.dropDown.input.value = "";
      app.dropDown.label.classList.add('has-content');
    };
  });

  // input di ricerca delle dropdown
  app.inputSearch = (e) => {
    console.log(e.target.value);
    if (e.target.value.length === 0) {app.dropDown.label.classList.remove("has-content");}
    // la stringa da ricercare, convertita in lowercase
    app.dropDown.search(e.target.value.toLowerCase());
  }

})();
