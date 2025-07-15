let current_background = 0;
let background = [];
for (let i = 0; i < 7; i++){
    background[i] = document.getElementById(`background${i+1}`);
}
function next_background(){
    current_background++;
    for (let i = 0; i < 7; i++){
        background[i].style.display = 'none';
    }
    if (background.length < current_background){
        current_background = 1;
    }
    background[current_background-1].style.display = 'flex';
}
next_background();
document.addEventListener("keydown", function(event) {
    if (event.key == "ArrowRight"){
        next_background();
    }
});
