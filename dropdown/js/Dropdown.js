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
  }

  toggle() {this.elements.toggleAttribute('show');}


}
