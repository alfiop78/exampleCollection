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

  toggle() {this.elements.toggleAttribute('show');}

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
