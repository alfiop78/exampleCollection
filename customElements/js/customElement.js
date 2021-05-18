class metricWidget extends HTMLDivElement {
  constructor() {
    // Always call super first in constructor
    console.log('metricWidget');
    super();

    // write element functionality in here

    // creo section
    let section = document.createElement('section');
    console.log(self);
    console.log(this);
    this.classList.add('metricChart');

    this.appendChild(section);
    let metricIcon = document.createElement('div');
    metricIcon.classList.add('metricIcon');
    section.appendChild(metricIcon);
    let icon = document.createElement('div');
    icon.classList.add('icon');
    metricIcon.appendChild(icon);
    let materialIcon = document.createElement('i');
    materialIcon.classList.add('material-icons');
    materialIcon.innerText = 'info';
    icon.appendChild(materialIcon);

    let data = document.createElement('div');
    data.classList.add('data');
    section.appendChild(data);
    let metricLabel = document.createElement('div');
    metricLabel.classList.add('metricLabel');
    data.appendChild(metricLabel);
    let metricValue = document.createElement('div');
    metricValue.classList.add('metricValue');
    data.appendChild(metricValue);
    let value = document.createElement('span');
    value.classList.add('value');
    metricValue.appendChild(value);
    let symbol = document.createElement('span');
    symbol.classList.add('symbol');
    metricValue.appendChild(symbol);
    let metricAlert = document.createElement('span');
    metricAlert.classList.add('metricAlert');
    this.appendChild(metricAlert);

  }
}
