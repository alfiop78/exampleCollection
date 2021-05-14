(() => {
  var app = {

  };

  const circle = document.querySelector('.donut-segment-2');
  const label = document.querySelector('.donut-percent');
  const circumference = circle.getTotalLength();

  const value = 50; // valore restituito da una chiamata
  label.innerHTML = value+"&percnt;"; // valore all'interno del cerchio
  const againstValue = (circumference - value); // valore "pezzo restante" del bordo (dash) es. : 90 vs 10 oppure 50 vs 50
  // console.log(againstValue);
  // valore del risultato, lo imposto qui ma poi viene "sovrascritto" da quello nell'animazione qui sotto
  circle.style.strokeDasharray = `${value}, ${againstValue}`;
  circle.animate([
    { // from
      strokeDasharray: `0, ${circumference}`
    },
    { // to
      strokeDasharray: `${value}, ${againstValue}`
    }
  ], 500);
})();
