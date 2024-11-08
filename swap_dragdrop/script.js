document.addEventListener('DOMContentLoaded', (event) => {

    var dragSrcEl = null;
    var elementAt = null;
    const span = document.createElement('span');
    var test;
    span.className = 'mark';

    function handleDragStart(e) {
        this.style.opacity = '0.2';

        dragSrcEl = this;

        e.dataTransfer.effectAllowed = 'move';
        e.dataTransfer.setData('text/html', this.innerHTML);
    }

    function handleDragOver(e) {
        if (e.preventDefault) {
            e.preventDefault();
        }
        // console.log(this);
        elementAt = document.elementFromPoint(e.clientX, e.clientY);
        test = document.elementFromPoint(e.clientX, e.clientY);
        // console.log(elementAt);

        // TEST: logica funzionante con un marcatore PRIMA di elementAt (elemento su cui è posizionato il mouse)
        if (elementAt.classList.contains('box')) {
            // .box
            // console.log('drop prima di ', elementAt);
            // elementAt.style.left = '10px';
            // fino a quando elementAt ha un elemento successivo, sposto tutti di 10px left
            while (test.nextElementSibling) {
                test.nextElementSibling.classList.add('diff');
                test = test.nextElementSibling;
            }

            // se il mouse si trova sullo stesso elemento (elementAt === dragSrcEl) non visualizzo lo span
            if (dragSrcEl !== elementAt) elementAt.before(span);
            // NOTE: con il before dell'elemento draggato c'è un problema:
            // Quando il mouse è posizionato sul .box, questo si sposta e il elementAt non è più il .box ma il .container
            // elementAt.before(dragSrcEl);
        } else {
            // .container
            elementAt.appendChild(span);
            // this.appendChild(dragSrcEl);
        }
        // TEST: logica funzionante con un marcatore PRIMA di elementAt (elemento su cui è posizionato il mouse)
        /* if (elementAt === dragSrcEl) return;
        if (elementAt.classList.contains('container')) {
            this.appendChild(dragSrcEl);
        } else {
            // console.clear();
            // console.log('dragSrc : ', dragSrcEl.offsetLeft);
            // console.log('elementAt before : ', elementAt.offsetLeft);
            // console.log('diff : ', dragSrcEl.offsetLeft - elementAt.offsetLeft);
            // console.log('width / 2: ', dragSrcEl.offsetWidth / 2);
            if (dragSrcEl.offsetLeft - elementAt.offsetLeft <= (dragSrcEl.offsetWidth / 2)) {
                // console.log(elementAt);
                // elementAt.style.left = '-100%';
                // const val = dragSrcEl.offsetLeft - elementAt.offsetLeft;
                // elementAt.style.left = `-${dragSrcEl.offsetWidth}px`;
                // dragSrcEl.style.left = '514px';
                elementAt.after(dragSrcEl);
            } else {
                // elementAt.style.left = `${dragSrcEl.offsetWidth}px`;
                // elementAt.style.left = '100%';
                // dragSrcEl.style.left = '-514px';
                elementAt.before(dragSrcEl);
            }
        } */
        // span.remove();

        e.dataTransfer.dropEffect = 'move';

        return false;
    }

    function handleDragEnter(e) {
        console.log('drageneter');
        this.classList.add('over');
    }

    function handleDragLeave(e) {
        console.log('dragLeave');
        this.classList.remove('over');
        this.parentElement.querySelectorAll('.diff').forEach(el => el.classList.remove('diff'));
    }

    function handleContainerDrop(e) {
        if (e.stopPropagation) {
            e.stopPropagation(); // stops the browser from redirecting.
        }
        dragSrcEl.classList.replace('el', 'box');
        elementAt.classList.remove('over');
        span.after(dragSrcEl);
        span?.remove();
        this.querySelectorAll('.diff').forEach(el => el.classList.remove('diff'));
    }

    function handleDragEnd(e) {
        this.style.opacity = '1';

        items.forEach(function(item) {
            item.classList.remove('over');
        });
    }


    let items = document.querySelectorAll('.container .box');
    items.forEach(function(item) {
        item.addEventListener('dragstart', handleDragStart, false);
        item.addEventListener('dragenter', handleDragEnter, false);
        item.addEventListener('dragleave', handleDragLeave, false);
        item.addEventListener('dragend', handleDragEnd, false);
    });
    let elements = document.querySelectorAll('.el');
    elements.forEach(function(item) {
        item.addEventListener('dragstart', handleDragStart, false);
        item.addEventListener('dragenter', handleDragEnter, false);
        item.addEventListener('dragleave', handleDragLeave, false);
        item.addEventListener('dragend', handleDragEnd, false);
    });
    document.querySelector('.container').addEventListener('drop', handleContainerDrop);
    document.querySelector('.container').addEventListener('dragover', handleDragOver);

});
