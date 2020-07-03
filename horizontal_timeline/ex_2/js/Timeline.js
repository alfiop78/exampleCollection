/*
timelineId = elemento id della class='timelineContent'
*/

class Timeline {

  constructor(timelineId) {
    this.timelineRef = document.querySelector('#'+timelineId);
    console.log(this.timelineRef);
    this.translateRef = this.timelineRef.querySelector('.timelineTranslate');
    console.log(this.translateRef);
    this.overflowRef = this.timelineRef.querySelector('.timelineOverflow');
    // imposto width in base a larghezza pagina
   
    this.overflowRef.style.width = "500px";
    console.log(this.overflowRef);
    this.totalElements = this.timelineRef.querySelector('.timelineTranslate').childElementCount;
    // this.activeElementId = +this.timelineRef.querySelector('.timelineOverflow').getAttribute('active');
    this.btnAdd = this.timelineRef.querySelector('#add');
    this.btnAdd.onclick = this.add.bind(this);
    // console.log(this.btnAdd);
    // onclick sul primo circle nella timeline
    this.timelineRef.querySelector(".timeline > span[data-id='1']").onclick = this.goStep.bind(this);
  }

  move() {
    // Spostamento timeline
    // se data-elements="1" c'è solo una element nell'timelineoverflow, quindi lo incremento di 1
  
    let total = document.querySelector('.timeline').childElementCount;
    if (document.querySelector('.timeline span[active]')) {
      document.querySelector('.timeline span[active]').removeAttribute('active');
    }
    // console.log(document.querySelector(".timeline span[id='"+total+"']"));
    document.querySelector(".timeline span[data-id='"+total+"']").setAttribute('active', true);
    let offsetCard = document.querySelector("div[element][data-id='"+total+"']").offsetLeft;
    this.translateRef.style.transform = "translateX(-"+offsetCard+"px)"
    this.translateRef.setAttribute('data-x', -offsetCard);

  }

  goStep(e) {
    
    console.log(e);
    let targetId = +e.target.getAttribute('data-id');
    // spostamento timeline sull'elemento selezionato
    if (document.querySelector('.timeline span[active]')) {
      document.querySelector('.timeline span[active]').removeAttribute('active');
    }
    e.target.setAttribute('active', true);
    // left dello step this.id
    let offsetCard = document.querySelector("div[element][data-id='"+targetId+"']").offsetLeft;
    this.translateRef.style.transform = "translateX(-"+offsetCard+"px)"
    this.translateRef.setAttribute('data-x', -offsetCard);

  }

  add() {
    // Metodo per aggiungere un nuovo elemento alla timeline
    // aggiungo la element
    console.log(this);
    let tmplElement = document.getElementById('template-element');
    let tmplContent = tmplElement.content.cloneNode(true);
    let element = tmplContent.querySelector('div[element]');
    let subElement = tmplContent.querySelector('div[sub-element]');
    element.setAttribute('data-id', ++this.totalElements);
    // inserisco una descrizione all'interno dell'elemento aggiunto
    subElement.innerHTML = "element "+this.totalElements;
    this.translateRef.appendChild(element);

    // aggiungo il circle nella timeline
    let tmplCircleTimeline = document.getElementById('circle-timeline');
    tmplContent = tmplCircleTimeline.content.cloneNode(true);
    let circle = tmplContent.querySelector('span');
    let totalCircle = document.querySelector('.timeline').childElementCount;
    circle.setAttribute('data-id', ++totalCircle);
    circle.setAttribute('active', true);
    document.querySelector('.timeline').appendChild(circle);
    circle.onclick = this.goStep.bind(this);
    // mi sposto allo step della timeline appena aggiunta
    this.move();
  }
}
