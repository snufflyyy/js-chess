export let mousePosition = { x: 0, y: 0 };
export let mouseDown = false;

export function getMousePosition(canvas, event) {
    let rect = canvas.getBoundingClientRect();
    let x = event.clientX - rect.left;
    let y = event.clientY - rect.top;

    mousePosition.x = x;
    mousePosition.y = y;
}

export function handleMouseDown() {
    mouseDown = true;
}

export function handleMouseUp() {
    mouseDown = false;
}