/*
timelineId = elemento id della class='timelineContent'
*/

class Steps {

  constructor(stepTranslate) {
    // definisco il div che deve effettuare la translate
    this._translate = document.getElementById(stepTranslate);
    this._page = document.querySelector('.step[selected]');
    this._pageWidth = this._page.offsetWidth + 32; // width della pagina da translare

  }

  previous() {
    // this._pageWidth = this._page.offsetWidth + 32;
    this._translate.style.transform = "translateX("+(this._pageWidth-this._pageWidth)+"px)";
  }

  next() {
    // this._pageWidth = this._page.offsetWidth + 32;
    this._translate.style.transform = "translateX(-"+this._pageWidth+"px)";
  }

  goStep(e) {
    
  }

}
