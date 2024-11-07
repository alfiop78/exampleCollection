document.addEventListener('DOMContentLoaded', (event) => {

    var dragSrcEl = null;
    var elementAt = null;

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
        elementAt = document.elementFromPoint(e.clientX, e.clientY);
        if (elementAt === dragSrcEl) return;
        // console.clear();
        // console.log('dragSrc : ', dragSrcEl.offsetLeft);
        // console.log('elementAt before : ', elementAt.offsetLeft);
        // console.log('diff : ', dragSrcEl.offsetLeft - elementAt.offsetLeft);
        // console.log('width / 2: ', dragSrcEl.offsetWidth / 2);
        if (dragSrcEl.offsetLeft - elementAt.offsetLeft <= (dragSrcEl.offsetWidth / 2)) {
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

        e.dataTransfer.dropEffect = 'move';

        return false;
    }

    function handleDragEnter(e) {
        this.classList.add('over');
    }

    function handleDragLeave(e) {
        this.classList.remove('over');
    }

    function handleDrop(e) {
        if (e.stopPropagation) {
            e.stopPropagation(); // stops the browser from redirecting.
        }

        // elementAt.before(dragSrcEl);
        // console.log(dragSrcEl, this);
        /* if (dragSrcEl != this) {
            dragSrcEl.innerHTML = this.innerHTML;
            this.innerHTML = e.dataTransfer.getData('text/html');
        } */

        return false;
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
        item.addEventListener('dragover', handleDragOver, false);
        item.addEventListener('dragleave', handleDragLeave, false);
        item.addEventListener('drop', handleDrop, false);
        item.addEventListener('dragend', handleDragEnd, false);
    });
});
