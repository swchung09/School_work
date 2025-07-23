let current_background = 0, x = 0, y = 0
let background = [], relative = [], main_character, placeholder, button;

//추가된 부분 (히트박스 핸들링 위함)
//--------------------------------------------------------------------------------------
let mouse_pos = {x:0, y:0}; // 히트박스 처리 위한 마우스 포인터 위치값 저장
let check_intv = null; // 히트박스 처리 함수 호출 주기
const obstacle = []; // [n번째 배경][m번째 장애물] = {x1: val, y1: val, x2: val, y2: val} 과 같이 배경-장애물 부분은 배열로, 왼쪽위-오른쪽아래 좌표는 dictionary로 저장
//--------------------------------------------------------------------------------------

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
async function mouse_event_handler(event) {
    var rect = background[current_background - 1].getBoundingClientRect();
    var charrect = main_character.getBoundingClientRect();
    let x = event.clientX;
    let y = event.clientY;
    
//추가된 부분 (히트박스 핸들링 위함)
//--------------------------------------------------------------------------------------
    mouse_pos.x = event.clientX; //x, y값 mouse_pos로 받음, 받은 값은 checker() 를 통해서 히트 체킹
    mouse_pos.y = event.clientY;
//--------------------------------------------------------------------------------------    
    
    x -= charrect.width / 2;
    y -= charrect.height;
    if (x < rect.left) x = rect.left;
    if (x > rect.right - charrect.width) x = rect.right - charrect.width;
    if (y < rect.top) y = rect.top;
    if (y > rect.bottom - charrect.height) y = rect.bottom - charrect.height;
    main_character.style.left = x + 'px';
    main_character.style.top = y + 'px';
    x = (event.clientX - rect.left) / rect.width;
    y = (event.clientY - rect.top) / rect.height;
    switch (current_background){
        case 1:
            if (0.93 < x && 0.71 < y){
                next_background();
            }
            break;
        case 2:
            if (x < 0.01 && 0.5 < y){
                next_background();
            }
            break;
        case 4:
            if (0.83 < x && 0.74 < y){
                next_background();
            }else if (0.6 > x){
                console.log(x);
                x *= background[current_background - 1].naturalWidth;
                y *= background[current_background - 1].naturalHeight;
                if (y > (800 / 1649) * x + 780){
                    let died = document.getElementById('died');
                    document.removeEventListener('mousemove', mouse_event_handler);
                    document.removeEventListener('keydown', key_event_handler);
                    main_character.style.display = 'none';
                    for (let i = 0; i < 7; i++) {
                        background[i].style.display = 'none';
                        if (relative[i]) {
                            relative[i].style.display = 'none';
                        }
                    }
                    died.style.display = 'flex';
                    await new Promise((resolve) => {
                        const handler = (event) => {
                            var rect = died.getBoundingClientRect();
                            x = (event.clientX - rect.left) / rect.width;
                            y = (event.clientY - rect.top) / rect.height;
                            if (0.57 < x && x < 0.86 && 0.66 < y && y < 0.82){
                                document.removeEventListener('click', handler);
                                died.style.display = 'none';
                                placeholder.style.display = 'flex';
                                button.style.display = 'flex';
                                current_background = 1000;
                            }
                        }
                        document.addEventListener('click', handler)
                    });
                }
            }
            break;
    }
}
function key_event_handler(event) {
    next_background();
}

//추가된 부분 (히트박스 핸들링 위함)
//--------------------------------------------------------------------------------------
function checker(){
    const current_obs = obstacle[current_background - 1]; //현재 배경의 장애물 정보 받아옴
    if(!current_obs || current_obs.length === 0){ //만약 장애물이 없다면 그냥 반환 (최적화를 위함이며, 함수 바깥에 무언가 저장, 전달하는 방법 통해서 추가 최적화도 가능할 듯?)
        return;
    }
    for(const obs of current_obs){ //각 장애물마다 확인 (장애물 정보 순회)
        if( mouse_pos.x > obs.x1 && mouse_pos.y > obs.y1 && mouse_pos.x < obs.x2 && mouse_pos.y < obs.y2 ) { //마우스 포인터의 위치가 장애물 (왼쪽 위, 오른쪽 아래로 직사각형 히트박스 구현) 안에 있는지 확인
            return; //현재는 반환이지만 이후 died 배경 전환코드로 치환 또는 수정 예정
        }
    }
}
//--------------------------------------------------------------------------------------

main_character.style.display = 'none';
placeholder.style.width = background[0].naturalWidth+'px';
placeholder.style.height = background[0].naturalHeight+'px';
button.addEventListener('click', function(event){
    placeholder.style.display = 'none';
    button.style.display = 'none';
    main_character.style.display = 'flex';
    document.addEventListener("keydown", key_event_handler);
    document.addEventListener("mousemove", mouse_event_handler);

//추가된 부분 (히트박스 핸들링 위함)
//--------------------------------------------------------------------------------------
    if(check_intv) clearInterval(check_intv); //interval 활용해서 100ms 주기로 확인 (값 변경할듯? 100ms는 너무 긴거같음, interval 관련 함수 등은 좀 더 찾아봐야함 (이해 부족))
    check_intv = setInterval(checker, 100);
//--------------------------------------------------------------------------------------
    
    next_background();
})
