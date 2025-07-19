let current_background = 0, x = 0, y = 0
let background = [], relative = [], main_character, placeholder, button;
for (let i = 0; i < 7; i++){
    background[i] = document.getElementById(`background${i+1}`);
    relative[i] = document.getElementById(`background-r${i+1}`);
}
main_character = document.getElementById('main_character');
placeholder = document.getElementById('placeholder')
button = document.getElementById('button')
function next_background(){
    current_background++;
    for (let i = 0; i < 7; i++){
        background[i].style.display = 'none';
        if (relative[i]){
            relative[i].style.display = 'none';
        }
    }
    if (background.length < current_background){
        current_background = 1;
    }
    background[current_background-1].style.display = 'flex';
    if (relative[current_background-1]){
        relative[current_background-1].style.display = 'flex';
    }
}

function key_event_handler(event) {
    next_background();
}

function mouse_event_handler(event) {
    var rect = background[current_background - 1].getBoundingClientRect();
    var charrect = main_character.getBoundingClientRect();
    let x = event.clientX;
    let y = event.clientY;
    x -= charrect.width / 2;
    y -= charrect.height;
    if (x < rect.left) x = rect.left;
    if (x > rect.right - charrect.width) x = rect.right - charrect.width;
    if (y < rect.top) y = rect.top;
    if (y > rect.bottom - charrect.height) y = rect.bottom - charrect.height;
    main_character.style.left = x + 'px';
    main_character.style.top = y + 'px';
}

main_character.style.display = 'none';
placeholder.style.width = background[0].naturalWidth+'px';
placeholder.style.height = background[0].naturalHeight+'px';

button.addEventListener('click', function(event){
    placeholder.style.display = 'none';
    button.style.display = 'none';
    main_character.style.display = 'flex';
    document.addEventListener("keydown", key_event_handler);
    document.addEventListener("mousemove", mouse_event_handler);
    next_background();
})