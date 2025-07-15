var current_background = 0;
var background1 = document.getElementById("background1");
var background2 = document.getElementById("background2");
var background3 = document.getElementById("background3");
var background4 = document.getElementById("background4");
var background5 = document.getElementById("background5");
var background6 = document.getElementById("background6");
var background7 = document.getElementById("background7");
function next_background(){
    current_background++;
    background1.style.display = "none";
    background2.style.display = "none";
    background3.style.display = "none";
    background4.style.display = "none";
    background5.style.display = "none";
    background6.style.display = "none";
    background7.style.display = "none";
    switch (current_background){
        case 1:
            background1.style.display = "flex";
            break;
        case 2:
            background2.style.display = "flex";
            break;
        case 3:
            background3.style.display = "flex";
            break;
        case 4:
            background4.style.display = "flex";
            break;
        case 5:
            background5.style.display = "flex";
            break;
        case 6:
            background6.style.display = "flex";
            break;
        case 7:
            background7.style.display = "flex";
            break;
        default:
            current_background = 1;
            background1.style.display = "flex";
            break;
    }
}
next_background();
document.addEventListener("keydown", function(event) {
    if (event.key == "ArrowRight"){
        next_background();
    }
});