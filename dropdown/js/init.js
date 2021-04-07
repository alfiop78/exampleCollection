(() => {
  var app = {
  };

  document.getElementById("test").onclick = (e) => {
    // imposto l'attributo show su .elements
    console.log(e.target);
    e.target.parentElement.querySelector('.elements').toggleAttribute('show');
  };
})();
