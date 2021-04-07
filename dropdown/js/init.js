(() => {
  var app = {
  };

  document.querySelectorAll('input[type="search"]').forEach((item, i) => {
    item.onclick = (e) => {
      // console.log(e.target);
      e.target.parentElement.querySelector('.elements').toggleAttribute('show');
    };
  });
  // single selection
  document.querySelectorAll('ul.filters > .item').forEach((item, i) => {
    item.onclick = (e) => {
      console.log(e.target, e.path);
      // metto nella input il valore selezionato
      e.path[3].querySelector('input[type="search"]').value = e.target.getAttribute('value');
      e.path[3].querySelector('label').classList.add("has-content");
      e.path[2].removeAttribute('show');
    };
  });
  // multi-selection
  document.querySelectorAll('ul.filters[year] > .item').forEach((item, i) => {
    item.onclick = (e) => {
      console.log('multi', e.target, e.path);
      console.log(e.currentTarget);
      e.currentTarget.toggleAttribute('checked');
      (e.currentTarget.hasAttribute('checked')) ? e.currentTarget.querySelector('input').checked = true : e.currentTarget.querySelector('input').checked = false;
    };
  });

  document.querySelectorAll('.filterButton > button[done]').forEach((item, i) => {
    item.onclick = (e) => {
      
    };
  });



})();
