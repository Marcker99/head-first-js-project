
window.onload = init;
function init() {
    var map = document.getElementById("map");
    map.onmousemove = showCoords
}
function showCoords(e) {
    var map = document.getElementById("coords");
    let x = e.clientX
    let y = e.clientY
    
    map.innerHTML = "Map coordinates: " + x + ", " + y;
}