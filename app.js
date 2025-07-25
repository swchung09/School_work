let current_background = 0;
let background = [], relative = [], main_character, placeholder, button, found_code = 0, found_phone = 0, found_key = 0, temp;
const obstacle = [
    [
        {x1: 0.159, y1: 0.249, x2: 0.340, y2: 0.396},
        {x1: 0.161, y1: 0.434, x2: 0.342, y2: 0.580},
        {x1: 0.154, y1: 0.635, x2: 0.332, y2: 0.778},
        {x1: 0.154, y1: 0.823, x2: 0.333, y2: 0.968},
        {x1: 0.430, y1: 0.250, x2: 0.612, y2: 0.419},
        {x1: 0.663, y1: 0.247, x2: 0.844, y2: 0.394},
        {x1: 0.664, y1: 0.435, x2: 0.845, y2: 0.582},
        {x1: 0.661, y1: 0.630, x2: 0.843, y2: 0.777}
    ],
    [],
    [
        { x1: 0.159, y1: 0.234, x2: 0.433, y2: 0.395 },
        { x1: 0.160, y1: 0.400, x2: 0.433, y2: 0.579 },
        { x1: 0.152, y1: 0.597, x2: 0.426, y2: 0.776 },
        { x1: 0.154, y1: 0.800, x2: 0.428, y2: 0.979 },
        { x1: 0.573, y1: 0.217, x2: 0.847, y2: 0.396 },
        { x1: 0.576, y1: 0.398, x2: 0.849, y2: 0.577 },
        { x1: 0.571, y1: 0.561, x2: 0.844, y2: 0.773 },
        { x1: 0.574, y1: 0.793, x2: 0.847, y2: 0.972 }
    ],
    [],
    [
        {x1: 0.114, y1: 0.204, x2: 0.473, y2: 0.315},
        {x1: 0.549, y1: 0.206, x2: 0.718, y2: 0.314},
        {x1: 0.115, y1: 0.388, x2: 0.282, y2: 0.495},
        {x1: 0.368, y1: 0.385, x2: 0.718, y2: 0.493},
        {x1: 0.112, y1: 0.597, x2: 0.199, y2: 0.704},
        {x1: 0.304, y1: 0.597, x2: 0.504, y2: 0.704},
        {x1: 0.523, y1: 0.508, x2: 0.536, y2: 0.706},
        {x1: 0.553, y1: 0.598, x2: 0.720, y2: 0.706},
        {x1: 0.113, y1: 0.815, x2: 0.284, y2: 0.924},
        {x1: 0.360, y1: 0.813, x2: 0.530, y2: 0.920},
        {x1: 0.562, y1: 0.738, x2: 0.577, y2: 0.934},
        {x1: 0.605, y1: 0.816, x2: 0.719, y2: 0.921}
    ]
]; // [n번째 배경][m번째 장애물] = {x1: val, y1: val, x2: val, y2: val} 과 같이 배경-장애물 부분은 배열로, 왼쪽위-오른쪽아래 좌표는 dictionary로 저장

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
    
    // 1. 절대 좌표 계산 (화면 표시용)
    let abs_x = event.clientX - charrect.width / 2; // 케릭터 중앙으로 위치 조정
    let abs_y = event.clientY - charrect.height; // 케릭터 아래로 위치 조정

    // 화면 밖으로 나가지 않도록 보정
    if (abs_x < rect.left) abs_x = rect.left;
    if (abs_x > rect.right - charrect.width) abs_x = rect.right - charrect.width;
    if (abs_y < rect.top) abs_y = rect.top;
    if (abs_y > rect.bottom - charrect.height) abs_y = rect.bottom - charrect.height;
    
    main_character.style.left = abs_x + 'px';
    main_character.style.top = abs_y + 'px';

    // 2. 상대 좌표 계산 (게임 로직용)
    let char_rel = {
        x: (abs_x - rect.left) / rect.width,
        y: (abs_y - rect.top) / rect.height,
        width: charrect.width / rect.width,
        height: charrect.height / rect.height
    };
    
    // 3. 충돌 검사 및 오브젝트 상호작용
    await checker(char_rel);
    await reload_object(char_rel);

    // 4. 배경 전환 로직 (마우스 포인터 기준)
    let mouse_rel_x = (event.clientX - rect.left) / rect.width;
    let mouse_rel_y = (event.clientY - rect.top) / rect.height;

    switch (current_background){
        case 1:
            if (0.93 < mouse_rel_x && 0.71 < mouse_rel_y){
                next_background();
            }
            break;
        case 2:
            if (mouse_rel_x < 0.05 && 0.6 < mouse_rel_y){
                next_background();
            }
            break;
        case 3:
            if (mouse_rel_x < 0.07 && mouse_rel_y < 0.5){// && found_code
                next_background();
            }
            break;
        case 4:
            if (0.83 < mouse_rel_x && 0.74 < mouse_rel_y){
                next_background();
            }else if (0.6 > mouse_rel_x){
                let x_abs = mouse_rel_x * background[current_background - 1].naturalWidth;
                let y_abs = mouse_rel_y * background[current_background - 1].naturalHeight;
                if (y_abs > (800 / 1649) * x_abs + 780){
                    let died = document.getElementById('died'); // 사망 처리
                    clearInterval(check_intv);
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
                            let x = (event.clientX - rect.left) / rect.width;
                            let y = (event.clientY - rect.top) / rect.height;
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
            if (0.83 < mouse_rel_x && 0.74 < mouse_rel_y && found_phone && found_key == 1){
                next_background();
            }
            break;
        case 6:
            if (0.45 < mouse_rel_x && mouse_rel_x < 0.6 && mouse_rel_y < 0.1){
                next_background();
            }
            break;
        case 7:
            if (0.35 < mouse_rel_x && mouse_rel_x < 0.6 && 0.9 < mouse_rel_y){
                next_background();
            }
            break;
        case 8:
            if (mouse_rel_y < 0.7){
                next_background();
            }
            break;
    }
}
function key_event_handler(event) {
    next_background();
}
async function reload_object(char_rel = null) {
    if (!char_rel) return; // char_rel이 없으면 (예: next_background에서 호출) 아무것도 안함

    var rect = background[current_background - 1].getBoundingClientRect();
    switch (current_background){
        case 3: // 컴퓨터 랜덤 위치
            if (!temp){
                var list = [
                    [0.205, 0.25], [0.297, 0.25], [0.387, 0.25],
                    [0.205, 0.433], [0.297, 0.433], [0.387, 0.433],
                    [0.199, 0.631], [0.29, 0.631], [0.38, 0.631],
                    [0.2, 0.833], [0.292, 0.833], [0.382, 0.833],
                    [0.62, 0.25], [0.711, 0.25], [0.801, 0.25],
                    [0.623, 0.431], [0.715, 0.431], [0.804, 0.431],
                    [0.618, 0.627], [0.709, 0.627], [0.798, 0.627],
                    [0.62, 0.826], [0.712, 0.826], [0.803, 0.826],
                ]
                temp = list[Math.floor(Math.random() * list.length)]; // 랜덤 위치 설정
            }
            var computer_on = document.getElementById('computer_on'); // 컴퓨터 켜짐 이미지
            var computer_on_rect = computer_on.getBoundingClientRect();
            var left = rect.left + rect.width * temp[0] - computer_on_rect.width / 2;
            var top = rect.top + rect.height * temp[1] - computer_on_rect.height / 2;
            computer_on.style.display = 'flex';
            computer_on.style.left = left + 'px'; // 컴퓨터 위치 설정
            computer_on.style.top = top + 'px'; // 컴퓨터 위치 설정

            if (found_code == 0){ // 컴퓨터에 닿은 적이 없을때
                const computer_rel = { // 컴퓨터 상대 좌표 계산
                    x: (left - rect.left) / rect.width,
                    y: (top - rect.top) / rect.height,
                    width: computer_on_rect.width / rect.width,
                    height: computer_on_rect.height / rect.height
                };

                if (char_rel.x < computer_rel.x + computer_rel.width && char_rel.x + char_rel.width > computer_rel.x &&
                    char_rel.y < computer_rel.y + computer_rel.height && char_rel.y + char_rel.height > computer_rel.y) {
                    // 메인 캐릭터가 컴퓨터에 닿았을 때
                    document.removeEventListener('mousemove', mouse_event_handler);
                    document.removeEventListener('keydown', key_event_handler);
                    computer_on.style.display = 'none';
                    main_character.style.display = 'none';
                    placeholder.style.display = 'flex';
                    background[2].style.display = 'none';
                    relative[2].style.display = 'none';
                    const chars = 'abcdefghijklmnopqrstuvwxyz'; // 문자 리스트
                    var password = '', answer = [];
                    for (let i = 0; i < 5; i++) { // 5글자 비밀번호 생성
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
                    for (let i = 0; i < 4; i++) { // 정답 계산
                        answer[i] = Math.abs(password.charCodeAt(i + 1) - password.charCodeAt(i));
                    }
                    console.log(answer);
                    await new Promise((resolve) => { // 비밀번호 입력 완료까지 대기
                        const handler = (event) => {
                            var pw1, pw2, pw3, pw4;
                            pw1 = document.getElementById('pw1').value;
                            pw2 = document.getElementById('pw2').value;
                            pw3 = document.getElementById('pw3').value;
                            pw4 = document.getElementById('pw4').value;
                            console.log(pw1, pw2, pw3, pw4);
                            if (pw1 == answer[0] && pw2 == answer[1] && pw3 == answer[2] && pw4 == answer[3]){
                                // 입력값이 정답이랑 같을 때
                                found_code = 1;
                                placeholder.style.display = 'none';
                                main_character.style.display = 'flex';
                                computer_on.style.display = 'flex';
                                background[2].style.display = 'flex';
                                relative[2].style.display = 'flex';
                                document.removeEventListener("click", handler);
                                document.addEventListener("keydown", key_event_handler);
                                document.addEventListener("mousemove", mouse_event_handler);
                                // 이후 죽을 때 처리를 위한 기존 placeholder 내용 복구
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
                                    next_background();
                                })
                            }else {
                                document.getElementById('prompt').innerText = '틀렸습니다. 다시 입력해주세요.';
                            }
                        }
                        document.getElementById('submit').addEventListener('click', handler)
                    });
                }
            }
            break;
        case 5:
            var phone = document.getElementById('phone');
            var lock = document.getElementById('lock');
            var key = document.getElementById('key');
            if (!temp){ // 핸드폰 랜덤 위치 설정
                var list = [
                    [0.728, 0.26], [0.07, 0.45],
                    [0.728, 0.64], [0.07, 0.86],
                ]
                temp = [list[Math.floor(Math.random() * list.length)]];
            }

            if (!found_phone){ // 핸드폰을 찾지 못했을 때
                phone.style.display = 'flex';
                let phone_rect = phone.getBoundingClientRect();
                let phone_abs_left = rect.left + rect.width * temp[0][0] - phone_rect.width / 2;
                let phone_abs_top = rect.top + rect.height * temp[0][1] - phone_rect.height / 2;
                phone.style.left = phone_abs_left + 'px';
                phone.style.top = phone_abs_top + 'px';

                const phone_rel = {
                    x: (phone_abs_left - rect.left) / rect.width,
                    y: (phone_abs_top - rect.top) / rect.height,
                    width: phone_rect.width / rect.width,
                    height: phone_rect.height / rect.height
                };

                if (char_rel.x < phone_rel.x + phone_rel.width && char_rel.x + char_rel.width > phone_rel.x &&
                    char_rel.y < phone_rel.y + phone_rel.height && char_rel.y + char_rel.height > phone_rel.y) {
                    // 핸드폰에 닿았을 때
                    phone.style.display = 'none';
                    found_phone = 1;
                }
            } else {
                phone.style.display = 'none';
            }

            if (!found_key){ // 키를 찾지 못했을 때
                lock.style.display = 'flex';
                let lock_rect = lock.getBoundingClientRect();
                let lock_abs_left = rect.left + rect.width * 0.91 - lock_rect.width / 2;
                let lock_abs_top = rect.top + rect.height * 0.14 - lock_rect.height / 2;
                lock.style.left = lock_abs_left + 'px';
                lock.style.top = lock_abs_top + 'px';

                const lock_rel = {
                    x: (lock_abs_left - rect.left) / rect.width,
                    y: (lock_abs_top - rect.top) / rect.height,
                    width: lock_rect.width / rect.width,
                    height: lock_rect.height / rect.height
                };

                if (char_rel.x < lock_rel.x + lock_rel.width && char_rel.x + char_rel.width > lock_rel.x &&
                    char_rel.y < lock_rel.y + lock_rel.height && char_rel.y + char_rel.height > lock_rel.y) {
                    // 메인 캐릭터가 자물쇠에 닿았을 때
                    lock.style.display = 'none';
                    found_key = -1;
                }
            } else if (found_key == -1){ // 자물쇠에 닿았지만 키에 닿지 않았을 때
                key.style.display = 'flex';
                let key_rect = key.getBoundingClientRect();
                let key_abs_left = rect.left + rect.width * 0.95 - key_rect.width / 2;
                let key_abs_top = rect.top + rect.height * 0.4 - key_rect.height / 2;
                key.style.left = key_abs_left + 'px';
                key.style.top = key_abs_top + 'px';

                const key_rel = {
                    x: (key_abs_left - rect.left) / rect.width,
                    y: (key_abs_top - rect.top) / rect.height,
                    width: key_rect.width / rect.width,
                    height: key_rect.height / rect.height
                };

                if (char_rel.x < key_rel.x + key_rel.width && char_rel.x + char_rel.width > key_rel.x &&
                    char_rel.y < key_rel.y + key_rel.height && char_rel.y + char_rel.height > key_rel.y) {
                    // 키에 닿았다면
                    key.style.display = 'none';
                    found_key = 1; // 키를 찾았음
                }
            }
            break;
        default:
            var computer_on = document.getElementById('computer_on');
            if(computer_on) computer_on.style.display = 'none';
    }
}

async function checker(char_rel){
    const current_obs = obstacle[current_background-1]; //현재 배경의 장애물 정보 받아옴
    if(!current_obs || current_obs.length === 0){ //만약 장애물이 없다면 그냥 반환
        return;
    }
    for(const obs of current_obs){ //각 장애물마다 확인 (장애물 정보 순회)
        if (char_rel.x < obs.x2 && char_rel.x + char_rel.width > obs.x1 &&
            char_rel.y < obs.y2 && char_rel.y + char_rel.height > obs.y1) { //메인캐릭터 크기 고려해서 (직사각형) 비교
            let died = document.getElementById('died'); // died 페이지 띄움
            clearInterval(check_intv);
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
                    let x = (event.clientX - rect.left) / rect.width;
                    let y = (event.clientY - rect.top) / rect.height;
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
            console.log('died');
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
    next_background();
})
