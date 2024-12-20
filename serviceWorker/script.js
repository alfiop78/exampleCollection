(() => {
    if ('serviceWorker' in navigator) {
        // attivo il serviceWorker nell'evento load ma è possibile attivarlo anche in qualche altro evento
        window.addEventListener('load', () => {
            // il metodo register restituisce una promise, su cui si chiamare .then
            navigator.serviceWorker.register('service-worker.js').then((registration) => {
                console.log('registered');
                console.log(registration);
            }, (err) => {
                console.log(err);
            });
        });
    } else {
        alert('No service worker support in this browser');
    }
})();

