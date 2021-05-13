(() => {
  var app = {

  };

  console.log(document.querySelector('.circle_animation'));
  const chartValue = document.getElementById('chart-1');
  const value = 90;
  let circle = document.querySelector('.circle_animation');
  const circumference = circle.getTotalLength();
  // let n = new Intl.NumberFormat('it-IT', {style: 'decimal', maximumFractionDigits : 2}).format('56');
  chartValue.innerHTML = value + " %";
  // la circonferenza è 438, faccio un rapporto per ottenere la percentuale
  // es. : una percentuale di 56 per farla comparire quasi al centro devo ottenere circa le metà di 438
  console.log( (((circumference*value)-1)/100) );

  let result = circumference - (((circumference*value)-1)/100);
  console.log(result);
  // console.log((((100 / -438)+1) * 100));
  // p.style.strokeDashoffset =(p.getTotalLength()-perc * p.getTotalLength()) / 100;
  circle.style.strokeDashoffset = result;

})();
