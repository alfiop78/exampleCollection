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
    };
  });
  // single selection
  document.querySelectorAll('ul.filters[single] > .item').forEach((item, i) => {
    item.onclick = (e) => {
      console.log(e.target, e.path);
      // metto nella input il valore selezionato e chiudo la select
      app.dropDown.input.value = e.target.getAttribute('value');
      app.dropDown.label.classList.toggle('has-content');
      app.dropDown.toggle();
    };
  });
  // multi-selection
  document.querySelectorAll('ul.filters[multi] > .item').forEach((item, i) => {
    item.onclick = (e) => {
      console.log('multi', e.target, e.path);
      console.log(e.currentTarget);
      e.currentTarget.toggleAttribute('checked');
      (e.currentTarget.hasAttribute('checked')) ? e.currentTarget.querySelector('input').checked = true : e.currentTarget.querySelector('input').checked = false;
    };
  });

  // document.querySelectorAll('.filterButton > button[done]').forEach((item, i) => {
  //   item.onclick = (e) => {
  //
  //   };
  // });

})();
