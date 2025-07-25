let current_background = 0, x = 0, y = 0
let background = [], relative = [], main_character, placeholder, button, found_code = 0, found_phone = 0, found_key = 0, temp;

let check_intv = null; // 히트박스 처리 함수 호출 주기
const obstacle = []; // [n번째 배경][m번째 장애물] = {x1: val, y1: val, x2: val, y2: val} 과 같이 배경-장애물 부분은 배열로, 왼쪽위-오른쪽아래 좌표는 dictionary로 저장

for (let i = 0; i < 9; i++){ // 배경 리스트 생성
    background[i] = document.getElementById(`background${i+1}`);
    relative[i] = document.getElementById(`background-r${i+1}`);
}
main_character = document.getElementById('main_character'); // 케릭터 및 요소 불러오기
placeholder = document.getElementById('placeholder')
button = document.getElementById('button')
function next_background(){ // 다음 배경 전환 함수
    temp = null;
    current_background++;
    for (let i = 0; i < 9; i++){ // 모든 배경 숨김
        background[i].style.display = 'none';
        if (relative[i]){
            relative[i].style.display = 'none';
        }
    }
    if (background.length < current_background){
        current_background = 1;
    }
    background[current_background-1].style.display = 'flex'; // 현재 배경 표시
    if (relative[current_background-1]){
        relative[current_background-1].style.display = 'flex';
    }
    reload_object();
}
async function mouse_event_handler(event) { // 마우스 이벤트 핸들러
    var rect = background[current_background - 1].getBoundingClientRect(); // 배경 크기 정보
    var charrect = main_character.getBoundingClientRect(); // 케릭터 크기 정보
    let x = event.clientX; // 마우스 X 좌표
    let y = event.clientY; // 마우스 Y 좌표
    
    x -= charrect.width / 2; // 케릭터 중앙으로 위치 조정
    y -= charrect.height; // 케릭터 아래로 위치 조정
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
            if (x < 0.05 && 0.6 < y){
                next_background();
            }
            break;
        case 3:
            if (x < 0.07 && y < 0.5){// && found_code
                next_background();
            }
            break;
        case 4:
            if (0.83 < x && 0.74 < y){
                next_background();
            }else if (0.6 > x){
                x *= background[current_background - 1].naturalWidth;
                y *= background[current_background - 1].naturalHeight;
                if (y > (800 / 1649) * x + 780){
                    let died = document.getElementById('died'); // 사망 처리
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
        case 5:
            if (0.83 < x && 0.74 < y && found_phone && found_key == 1){
                next_background();
            }
            break;
        case 6:
            if (0.45 < x && x < 0.6 && y < 0.1){
                next_background();
            }
            break;
        case 7:
            if (0.35 < x && x < 0.6 && 0.9 < y){
                next_background();
            }
            break;
        case 8:
            if (y < 0.7){
                next_background();
            }
            break;
    }
    reload_object();
    checker(x, y);
}
function key_event_handler(event) {
    next_background();
}
async function reload_object() {
    switch (current_background){
        case 3:
            if (!temp){
                var list = [
                    [0.205, 0.25],
                    [0.297, 0.25],
                    [0.387, 0.25],
                    [0.205, 0.433],
                    [0.297, 0.433],
                    [0.387, 0.433],
                    [0.199, 0.631],
                    [0.29, 0.631],
                    [0.38, 0.631],
                    [0.2, 0.833],
                    [0.292, 0.833],
                    [0.382, 0.833],
                    [0.62, 0.25],
                    [0.711, 0.25],
                    [0.801, 0.25],
                    [0.623, 0.431],
                    [0.715, 0.431],
                    [0.804, 0.431],
                    [0.618, 0.627],
                    [0.709, 0.627],
                    [0.798, 0.627],
                    [0.62, 0.826],
                    [0.712, 0.826],
                    [0.803, 0.826],
                ]
                temp = list[Math.floor(Math.random() * list.length)];
            }
            var rect = background[current_background - 1].getBoundingClientRect();
            var computer_on = document.getElementById('computer_on');
            var left = rect.left + rect.width * temp[0] - computer_on.width / 2;
            var top = rect.top + rect.height * temp[1] - computer_on.height / 2;
            computer_on.style.display = 'flex';
            computer_on.style.left = left + 'px';
            computer_on.style.top = top + 'px';
            if (parseInt(main_character.style.left) < left+computer_on.width / 2
                && left < parseInt(main_character.style.left)+computer_on.width / 2
                && parseInt(main_character.style.top) < top+computer_on.height
                && top < parseInt(main_character.style.top)+computer_on.height
                && found_code == 0){
                    document.removeEventListener('resize', mouse_event_handler);
                    document.removeEventListener('mousemove', mouse_event_handler);
                    document.removeEventListener('keydown', key_event_handler);
                    computer_on.style.display = 'none';
                    main_character.style.display = 'none';
                    placeholder.style.display = 'flex';
                    background[2].style.display = 'none';
                    relative[2].style.display = 'none';
                    const chars = 'abcdefghijklmnopqrstuvwxyz';
                    var password = '', answer = [];
                    for (let i = 0; i < 5; i++) {
                        password += chars.charAt(Math.floor(Math.random() * 26));
                    }
                    placeholder.innerHTML = `<h1>비밀번호 맞추기!</h1>
                    <p>비밀번호는 아래 텍스트를 문자 사이의 알파벳 순서번호의 차이를 숫자로 나타낸 4자리 숫자입니다.</p>
                    <p>텍스트 : "${password}"</p>
                    <fieldset>
                        <legend>비밀번호 입력</legend>
                        <p id="prompt"></p>
                        <p> 1번째 글자 : <input type="text" id="pw1"></p>
                        <p> 2번째 글자 : <input type="text" id="pw2"></p>
                        <p> 3번째 글자 : <input type="text" id="pw3"></p>
                        <p> 4번째 글자 : <input type="text" id="pw4"></p>
                        <button id="submit">제출</button>
                    </fieldset>`;
                    for (let i = 0; i < 4; i++) {
                        answer[i] = Math.abs(password.charCodeAt(i + 1) - password.charCodeAt(i));
                    }
                    console.log(answer);
                    await new Promise((resolve) => {
                        const handler = (event) => {
                            var pw1, pw2, pw3, pw4;
                            pw1 = document.getElementById('pw1').value;
                            pw2 = document.getElementById('pw2').value;
                            pw3 = document.getElementById('pw3').value;
                            pw4 = document.getElementById('pw4').value;
                            console.log(pw1, pw2, pw3, pw4);
                            if (pw1 == answer[0] && pw2 == answer[1] && pw3 == answer[2] && pw4 == answer[3]){
                                found_code = 1;
                                placeholder.style.display = 'none';
                                main_character.style.display = 'flex';
                                computer_on.style.display = 'flex';
                                background[2].style.display = 'flex';
                                relative[2].style.display = 'flex';
                                document.removeEventListener("click", handler);
                                document.addEventListener("keydown", key_event_handler);
                                document.addEventListener("mousemove", mouse_event_handler);
                                window.addEventListener("resize", reload_object);
                                placeholder.innerHTML = '<p>이 게임은 감옥탈출 게임입니다.<br>당신은 감옥에 갇혀있습니다.<br>당신은 탈출할 수 있을까요?<br><br><strong>게임을 시작하려면 버튼을 눌러주세요!</strong></p><button id="button">시작</button>';
                                button = document.getElementById('button');
                                button.addEventListener('click', function(event){
                                    found_code = 0;
                                    placeholder.style.display = 'none';
                                    button.style.display = 'none';
                                    main_character.style.display = 'flex';
                                    current_background = 0;
                                    document.addEventListener("keydown", key_event_handler);
                                    document.addEventListener("mousemove", mouse_event_handler);
                                    window.addEventListener("resize", reload_object);
                                    next_background();
                                })
                            }else {
                                document.getElementById('prompt').innerText = '틀렸습니다. 다시 입력해주세요.';
                            }
                        }
                        document.getElementById('submit').addEventListener('click', handler)
                    });
            }
            break;
        case 5:
            const charrect = main_character.getBoundingClientRect();
            var rect = background[current_background - 1].getBoundingClientRect();
            var phone = document.getElementById('phone');
            var lock = document.getElementById('lock');
            var key = document.getElementById('key');
            if (!temp){
                var list = [
                    [0.728, 0.26],
                    [0.07, 0.45],
                    [0.728, 0.64],
                    [0.07, 0.86],
                ]
                temp = [list[Math.floor(Math.random() * list.length)]];
            }
            if (!found_phone){
                phone.style.display = 'flex';
                phone.style.left = rect.left + rect.width * temp[0][0] - phone.width / 2 + 'px';
                phone.style.top = rect.top + rect.height * temp[0][1] - phone.height / 2 + 'px';
                const phonerect = phone.getBoundingClientRect();
                if (charrect.right > phonerect.left && charrect.left < phonerect.right &&
                    charrect.bottom > phonerect.top && charrect.top < phonerect.bottom){
                    phone.style.display = 'none';
                    found_phone = 1;
                }
            }else {
                phone.style.display = 'none';
            }
            if (!found_key){
                lock.style.display = 'flex';
                lock.style.left = rect.left + rect.width * 0.91 - lock.width / 2 + 'px';
                lock.style.top = rect.top + rect.height * 0.14 - lock.height / 2 + 'px';
                const lockrect = lock.getBoundingClientRect();
                if (charrect.right > lockrect.left && charrect.left < lockrect.right &&
                    charrect.bottom > lockrect.top && charrect.top < lockrect.bottom){
                    lock.style.display = 'none';
                    found_key = -1;
                }
            }else if (found_key == -1){
                key.style.display = 'flex';
                key.style.left = rect.left + rect.width * 0.95 - key.width / 2 + 'px';
                key.style.top = rect.top + rect.height * 0.4 - key.height / 2 + 'px';
                const keyrect = key.getBoundingClientRect();
                if (charrect.right > keyrect.left && charrect.left < keyrect.right &&
                    charrect.bottom > keyrect.top && charrect.top < keyrect.bottom){
                    key.style.display = 'none';
                    found_key = 1;
                }
            }
        default:
            var computer_on = document.getElementById('computer_on');
            computer_on.style.display = 'none';
    }
}

async function checker(x, y){
    const current_obs = obstacle[current_background - 1]; //현재 배경의 장애물 정보 받아옴
    if(!current_obs || current_obs.length === 0){ //만약 장애물이 없다면 그냥 반환 (최적화를 위함이며, 함수 바깥에 무언가 저장, 전달하는 방법 통해서 추가 최적화도 가능할 듯?)
        return;
    }
    console.log(current_obs);
    console.log(current_obs.length);
    for(const obs of current_obs){ //각 장애물마다 확인 (장애물 정보 순회)
        if(x + main_character.width / 2 > obs.x1 && y + main_character.height / 2 > obs.y1 && x - main_character.width / 2 < obs.x2 && y - main_character.height / 2 < obs.y2 ) { //메인캐릭터 크기 고려해서 (직사각형) 비교 (마우스포인터에서 직사각형으로 수정됨)
            let died = document.getElementById('died'); // died 페이지 띄움
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
    window.addEventListener("resize", reload_object);

//추가된 부분 (히트박스 핸들링 위함)
//--------------------------------------------------------------------------------------
    if(check_intv) clearInterval(check_intv); //interval 활용해서 100ms 주기로 확인 (값 변경할듯? 100ms는 너무 긴거같음, interval 관련 함수 등은 좀 더 찾아봐야함 (이해 부족))
    check_intv = setInterval(checker, 30);
//--------------------------------------------------------------------------------------
    
    next_background();
})
