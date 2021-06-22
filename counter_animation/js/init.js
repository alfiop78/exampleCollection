/*document.addEventListener("DOMContentLoaded", () => {
    function counter(id, start, end, duration) {
      let obj = document.getElementById(id),
       current = start,
       range = end - start,
       increment = end > start ? 0.01 : -1.01,
       step = Math.abs(Math.floor(duration / range)),
       timer = setInterval(() => {
        current += increment;
        // console.log(current.toFixed(2), end);
        obj.textContent = current.toFixed(2);
        if (current.toFixed(2) == end) {
         clearInterval(timer);
        }
       }, step);
     }
     counter("count1", 0, '10.02', 1);
});*/

(() => {
    console.log('app');
    Number.prototype.numberFormat = function(decimals, dec_point, thousands_sep) {
        dec_point = typeof dec_point !== 'undefined' ? dec_point : ',';
        thousands_sep = typeof thousands_sep !== 'undefined' ? thousands_sep : '.';

        var parts = this.toFixed(decimals).split('.');
        parts[0] = parts[0].replace(/\B(?=(\d{3})+(?!\d))/g, thousands_sep);

        return parts.join(dec_point);
    }

    var counter = { var: 0 };
    var tal = document.getElementById("tal");
        
     TweenMax.to(counter, 5, {
          var: 2100.23, 
          onUpdate: function () {
              var nwc = counter.var.numberFormat(2);
              tal.innerHTML = nwc;
          },
          ease:Circ.easeOut
      });
})();
