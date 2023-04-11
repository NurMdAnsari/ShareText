 
let popup = document.getElementById('popup-wrapper');
let btn = document.getElementById("popup-btn");
let span = document.getElementById("close");
btn.onclick = function() {
    popup.classList.add('show');
}
span.onclick = function() {
    popup.classList.remove('show');
}

window.onclick = function(event) {
    if (event.target == popup) {
        popup.classList.remove('show');
    }
}