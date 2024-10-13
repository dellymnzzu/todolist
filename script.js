let display = document.querySelector('.display'); // 달력 상단에 현재 월과 연도를 표시하는 요소 선택
let preBtn = document.querySelector('.left'); // 이전 달로 이동하는 버튼 선택
let nextBtn = document.querySelector('.right'); // 다음 달로 이동하는 버튼 선택
let days = document.querySelector('.days'); // 달력의 날짜들이 표시되는 요소 선택
let selected = document.querySelector('.selected'); // 선택한 날짜가 표시되는 영역 선택

let today = new Date(); // 오늘의 날짜 정보를 가져오는 Date 객체 생성
let year = today.getFullYear(); // 현재 연도 추출
let month = today.getMonth(); // 현재 월(0~11 범위의 값) 추출
let dayOfMonth = today.getDate(); // 현재 날짜(일) 추출

let todos = {}; // 투두리스트를 저장하는 객체 (날짜별로 할 일 목록 저장)
// 투두리스트 입력 필드와 추가 버튼 선택
const todoInput = document.querySelector('#todoInput'); // 투두리스트 입력 필드 선택
const addTodoBtn = document.querySelector('#addTodo'); // 투두리스트 추가 버튼 선택
const todoList = document.querySelector('#todoList'); // 투두리스트가 표시될 리스트 선택
let selectedDate = null; // 사용자가 선택한 날짜를 저장할 변수 초기화

// 달력을 출력하는 함수
function displayCalendar() {
  days.innerHTML = ''; // 새로운 달력을 그리기 전에 기존의 날짜들 초기화
  const firstDay = new Date(year, month, 1); // 현재 월의 첫 번째 날을 가져옴
  const firstDayIdx = firstDay.getDay(); // 첫 번째 날의 요일(0: 일요일 ~ 6: 토요일) 가져옴
  const lastDay = new Date(year, month + 1, 0); // 현재 월의 마지막 날을 가져옴
  const numberOfDays = lastDay.getDate(); // 현재 월의 마지막 날짜(일)를 가져옴

  // 현재 연도와 월을 'Year Month' 형식으로 변환하여 표시
  let formattedDate = today.toLocaleString('en-US', {
    year: 'numeric',
    month: 'long',
    timeZone: 'Asia/Seoul',
  });
  display.innerHTML = formattedDate; // 상단에 현재 월과 연도 표시

  // 첫 번째 날의 요일에 맞춰 빈칸을 추가하여 달력의 시작 위치 조정
  for (let i = 1; i <= firstDayIdx; i++) {
    let div = document.createElement('div');
    div.innerHTML = ''; // 빈칸을 표시
    days.appendChild(div);  //부모 노드에 자식 노드를 추가하는 메소드
  }

  // 1일부터 마지막 날짜까지 달력에 날짜를 추가
  for (let i = 1; i <= numberOfDays; i++) {
    let div = document.createElement('div');
    let currendDate = new Date(year, month, i); // 각 날짜 객체 생성
    div.dataset.date = currendDate.toDateString(); // 날짜를 data-date 속성으로 저장
    div.innerText = i; // 날짜 숫자 표시
    days.appendChild(div);

    // 오늘 날짜를 확인하고 해당 날짜에 스타일을 적용
    if (
      currendDate.getFullYear() === new Date().getFullYear() &&
      currendDate.getMonth() === new Date().getMonth() &&
      currendDate.getDate() === new Date().getDate()
    ) {
      div.classList.add('current-date'); // 오늘 날짜에 해당하는 스타일 추가
    }
  }

  displaySelected(); // 날짜를 클릭했을 때 투두리스트가 선택되도록 설정
}

// 날짜를 선택했을 때 선택된 날짜에 대한 투두리스트 표시
function displaySelected() {
  const daysEL = document.querySelectorAll('.days div'); // 모든 날짜 요소 선택
  daysEL.forEach((day) => {  //forEach문은 함수를 한번씩 실행하는 기능이다. 
    day.addEventListener('click', (e) => { //day에 클릭 이벤트가 생기면, 
      selectedDate = e.target.dataset.date; // 클릭한 날짜를 selectedDate에 저장
      displayTodos(); // 해당 날짜의 투두리스트를 표시
    });
  });
}

// 투두리스트 추가 버튼 클릭 시 실행되는 함수
addTodoBtn.addEventListener('click', () => {
  if (todoInput.value === '') {
    alert('내용을 입력하지 않았습니다! 입력해주세요.'); // 입력 필드가 빈 경우 경고 메시지
  }
  if (selectedDate && todoInput.value) {
    if (!todos[selectedDate]) {
      todos[selectedDate] = []; // 선택된 날짜에 투두리스트가 없으면 빈 배열 생성
    }
    todos[selectedDate].push(todoInput.value); // 선택된 날짜에 새로운 할 일 추가
    todoInput.value = ''; // 입력 필드 비우기
    displayTodos(); // 투두리스트를 다시 표시
    saveTodos(); // 로컬 스토리지에 저장

    // 투두리스트가 있는 날짜에 스타일 추가
    const dayDivs = document.querySelectorAll('.days div');
    dayDivs.forEach((dayDiv) => {
      if (dayDiv.dataset.date === selectedDate) {
        dayDiv.classList.add('has-todo'); // 투두리스트가 있는 날짜에 스타일 추가
      } else {
        dayDiv.classList.remove('has-todo'); // 투두리스트가 없는 날짜의 스타일 제거
      }
    });
  }
});

// 선택한 날짜의 투두리스트를 화면에 표시하는 함수
function displayTodos() {
  todoList.innerHTML = ''; // 기존 투두리스트 비우기
  let selectedDateHeader = document.createElement('h3'); // 선택된 날짜의 제목 추가
  selectedDateHeader.textContent = `${selectedDate} TODO LIST`; // 날짜 제목 추가
  todoList.appendChild(selectedDateHeader); // 리스트 상단에 날짜 추가

  if (todos[selectedDate]) {
    todos[selectedDate].forEach((todo, index) => {
      const li = document.createElement('li'); // 투두리스트 항목 생성
      li.textContent = todo; // 할 일 내용 추가

      // 투두리스트 항목에 삭제 버튼 추가
      const deleteBtn = document.createElement('button');
      deleteBtn.textContent = '완료'; // 버튼 텍스트 설정
      deleteBtn.addEventListener('click', () => {
        todos[selectedDate].splice(index, 1); // 선택한 할 일 삭제
        displayTodos(); // 업데이트된 리스트 표시
        saveTodos(); // 로컬 스토리지에 저장
        // 할 일이 없는 날짜의 스타일 제거
        if (todos[selectedDate].length === 0) {
          const dayDiv = document.querySelector(
            `.days div[data-date='${selectedDate}']`
          );
          if (dayDiv) {
            dayDiv.classList.remove('has-todo'); // 클래스 제거
          }
        }
      });

      li.appendChild(deleteBtn); // 리스트 항목에 버튼 추가
      todoList.appendChild(li); // 화면에 리스트 항목 표시
    });
  }
}

// 페이지 로드 시 저장된 투두리스트 불러오기
window.addEventListener('load', () => {
  if (localStorage.getItem('todos')) {
    todos = JSON.parse(localStorage.getItem('todos')); // 로컬 스토리지에서 투두리스트 불러오기
  }
  displayCalendar(); // 페이지 로드 시 달력을 그린다.
});

// 투두리스트가 변경될 때마다 로컬 스토리지에 저장하는 함수
function saveTodos() {
  localStorage.setItem('todos', JSON.stringify(todos)); // 로컬 스토리지에 투두리스트 저장
}

// 이전 달로 이동하는 버튼 클릭 시 실행되는 함수
preBtn.addEventListener('click', () => {
  selected.innerHTML = ''; // 선택된 날짜 초기화
  month -= 1; // 이전 달로 이동
  if (month < 0) {
    month = 11;
    year -= 1; // 월이 0보다 작아지면 12월로 설정하고 연도 감소
  }
  today.setMonth(month); // 현재 날짜를 이동한 월로 설정
  displayCalendar(); // 달력을 다시 그린다.
});

// 다음 달로 이동하는 버튼 클릭 시 실행되는 함수
nextBtn.addEventListener('click', () => {
  selected.innerHTML = ''; // 선택된 날짜 초기화
  month += 1; // 다음 달로 이동
  if (month > 11) {
    month = 0;
    year += 1; // 월이 11보다 커지면 1월로 설정하고 연도 증가
  }
  today.setMonth(month); // 현재 날짜를 이동한 월로 설정
  displayCalendar(); // 달력을 다시 그린다.
});