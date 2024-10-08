let customElem = document.getElementById("textarea");
var suggestions = ['CodAziendaSid', 'id_Azienda', 'CodMarcaRicambi', 'Codice', 'versioneDMS'];

const findIndexOfCurrentWord = (textarea, caretPosition) => {
    // ottengo il valore corrente e la posizione del cursore
    const currentValue = textarea.firstChild.textContent;
    // const cursorPos = caretPosition;

    // Cerco l'indice di partenza della parola corrente...
    let startIndex = caretPosition - 1;
    // ... il ciclo cerca all'indietro dalla posizione corrente-1 (startIndex) fino a quando trova uno spazio
    // oppure il carattere di "a capo"
    while (startIndex >= 0 && !/\W/.test(currentValue[startIndex])) {
        startIndex--;
    }
    // lo startIndex corrisponde all'indice di inizio della parola corrente
    return startIndex;
};

customElem.addEventListener('input', (e) => {
    const sel = document.getSelection();
    // console.log(sel);
    if (!e.target.firstChild) return;
    const startIndex = findIndexOfCurrentWord(e.target, sel.anchorOffset);
    const currentWord = e.target.firstChild.textContent.substring(startIndex + 1);
    console.log(`current word : ${currentWord}`);
    if (currentWord.length > 0) {
        let regex = new RegExp(`^${currentWord}.*`, 'i');
        const match = suggestions.find(value => value.match(regex));
        if (match) {
            // console.log(match);
            const span = document.createElement('span');
            span.textContent = match.slice(currentWord.length, match.length);
            (e.target.querySelector('span')) ? e.target.replaceChild(span, e.target.querySelector('span')) : e.target.appendChild(span);
        } else {
            if (e.target.querySelector('span')) e.target.querySelector('span').textContent = '';
        }
    }
});

customElem.addEventListener('keyup', (e) => {
    const sel = document.getSelection();
    console.log(sel);
    const caretPosition = sel.anchorOffset;
    console.log(caretPosition);
    if (e.code === 'Space') {
        if (e.target.querySelector('span')) e.target.querySelector('span').textContent = '';
    }
});

customElem.addEventListener('click', (e) => {
    const caretPosition = document.caretPositionFromPoint(e.clientX, e.clientY);
    console.log(caretPosition.offset);
});

customElem.addEventListener('keydown', function(e) {
    const sel = document.getSelection();
    console.log(sel);
    // const caretPosition = sel.anchorOffset;
    if (!['Tab', 'ArrowRight'].includes(e.key)) return;
    e.preventDefault();
    switch (e.key) {
        case 'Tab':
        case 'ArrowRight':
            e.target.firstChild.textContent += e.target.querySelector('span').textContent;
            e.target.querySelector('span').textContent = '';
            // posiziono il cursore alla fine della stringa
            sel.setPosition(e.target.firstChild, e.target.firstChild.length);
            break;
        default:
            break;
    }
});
