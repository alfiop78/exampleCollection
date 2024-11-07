const d = document.getElementsByClassName("draggable");

let grid = 50; //Width of one grid box

for (let i = 0; i < d.length; i++) {
    d[i].style.position = "relative";
}

function filter(e) {
    let target = e.target;

    target.moving = true;
    target.oldX = e.clientX;

    target.oldLeft =
        window
            .getComputedStyle(target)
            .getPropertyValue("left")
            .split("px")[0] * 1; //Get left style as a number

    document.onmousemove = dr;

    function dr(event) {
        event.preventDefault();

        if (!target.moving) {
            return;
        }
        target.distX = event.clientX - target.oldX;
        target.style.left = target.oldLeft + target.distX + "px";
        target.style.pointerEvents = "none"; //Stops target from being elementAt
        moveElementAt();
    }

    function endDrag() {
        target.moving = false;
        target.style.left =
            target.oldLeft + Math.round(target.distX / grid) * grid + "px";
        moveElementAt(); //Do it at endDrag() also to stop elements from overlapping
        target.style.pointerEvents = "auto";
    }

    function moveElementAt() {
        let rootEl = target.parentNode;
        let elementAt = document.elementFromPoint(
            target.offsetLeft,
            target.offsetTop //Get element at target's coordinates
        );

        if (elementAt === rootEl) {
            return
        } //Stop rootEl from moving

        //Move elementAt either grid units left or right depending on which way target is approaching it from
        if (target.offsetLeft - elementAt.offsetLeft * 1 <= grid / 2) //Can also compare to 0, comparing to grid/2 stops elements' position from breaking when moving very fast to some extent
        {
            elementAt.style.left =
                window
                    .getComputedStyle(elementAt)
                    .getPropertyValue("left")
                    .split("px")[0] * 1 - grid + "px";
        } else {
            elementAt.style.left =
                window
                    .getComputedStyle(elementAt)
                    .getPropertyValue("left")
                    .split("px")[0] * 1 + grid + "px";
        }

    }
    document.onmouseup = endDrag;
}
document.onmousedown = filter;
