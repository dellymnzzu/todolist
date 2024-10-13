let display = document.querySelector('.display');
let preBtn = document.querySelector('.left');
let nextBtn = document.querySelector('.right');
let days = document.querySelector('.days');
let selected = document.querySelector('.selected');

let today = new Date();
let year = today.getFullYear(); // 년도 지정
let month = today.getMonth(); //월 지정
let dayOfMonth = today.getDate(); // 일지정

let todos = {}; // 투두리스트 저장할 객체
// 투두 입력 필드와 버튼
const todoInput = document.querySelector('#todoInput');
const addTodoBtn = document.querySelector('#addTodo');
const todoList = document.querySelector('#todoList');
let selectedDate = null; // 선택된 날짜를 저장하는 변수

function displayCalendar() {
  days.innerHTML = ''; // 달력을 그리기 전 기존 내용을 지움
  const firstDay = new Date(year, month, 1); // 첫째 날 알기
  const firstDayIdx = firstDay.getDay(); //요일 지정
  const lastDay = new Date(year, month + 1, 0); // 현재 월의 마지막 날
  const numberOfDays = lastDay.getDate(); // 현재 월의 마지막 날이 며칠인지 알려주기

  let formattedDate = today.toLocaleString('en-US', {
    year: 'numeric',
    month: 'long',
    timeZone: 'Asia/Seoul',
  });
  display.innerHTML = formattedDate;

  // 날짜 빈칸 부분출력
  for (let i = 1; i <= firstDayIdx; i++) {
    let div = document.createElement('div');
    div.innerHTML = ''; // 빈칸을 넣음
    days.appendChild(div);
  }

  // 날짜 부분 출력
  for (let i = 1; i <= numberOfDays; i++) {
    let div = document.createElement('div');
    let currendDate = new Date(year, month, i);
    div.dataset.date = currendDate.toDateString();
    div.innerText = i;
    days.appendChild(div);

    //오늘 날짜 확인
    if (
      currendDate.getFullYear() === new Date().getFullYear() &&
      currendDate.getMonth() === new Date().getMonth() &&
      currendDate.getDate() === new Date().getDate()
    ) {
      div.classList.add('current-date');
    }
  }

  displaySelected(); // 달력 출력 후 날짜 선택 기능 설정
}

function displaySelected() {
  const daysEL = document.querySelectorAll('.days div');
  daysEL.forEach((day) => {
    day.addEventListener('click', (e) => {
      selectedDate = e.target.dataset.date;

      displayTodos(); // 선택한 날짜의 투두 리스트 표시
    });
  });
}

// 투두 리스트 추가 버튼 클릭 시 실행
addTodoBtn.addEventListener('click', () => {
  if (todoInput.value === '') {
    alert('내용을 입력하지 않았습니다! 입력해주세요.');
  }
  if (selectedDate && todoInput.value) {
    if (!todos[selectedDate]) {
      todos[selectedDate] = [];
    }
    todos[selectedDate].push(todoInput.value);
    todoInput.value = ''; // 입력 필드 비우기
    displayTodos(); // 투두 리스트 업데이트
    saveTodos(); // 변경사항 저장
    // 투두 리스트가 있는 날짜에 스타일을 추가하기 위해 해당 날짜에 클래스 추가
    const dayDivs = document.querySelectorAll('.days div');
    dayDivs.forEach((dayDiv) => {
      if (dayDiv.dataset.date === selectedDate) {
        dayDiv.classList.add('has-todo'); // 클래스 추가
      } else {
        dayDiv.classList.remove('has-todo'); // 투두가 없으면 클래스 제거
      }
    });
  }
});

// 선택한 날짜의 투두 리스트를 화면에 표시
function displayTodos() {
  todoList.innerHTML = ''; // 기존 리스트 비우기
  // 선택한 날짜를 투두 리스트 영역에 표시
  let selectedDateHeader = document.createElement('h3');
  selectedDateHeader.textContent = ` ${selectedDate} TODO LIST`;
  todoList.appendChild(selectedDateHeader);
  if (todos[selectedDate]) {
    todos[selectedDate].forEach((todo, index) => {
      const li = document.createElement('li');
      li.textContent = todo;

      // 삭제 버튼 추가
      const deleteBtn = document.createElement('button');
      deleteBtn.textContent = '완료';
      deleteBtn.addEventListener('click', () => {
        todos[selectedDate].splice(index, 1); // 해당 투두 삭제
        displayTodos(); // 리스트 다시 표시
        saveTodos(); // 삭제 후 저장
        if (todos[selectedDate].length === 0) {
          const dayDiv = document.querySelector(
            `.days div[data-date='${selectedDate}']`
          );
          if (dayDiv) {
            dayDiv.classList.remove('has-todo'); // 클래스 제거
          }
        }
      });

      li.appendChild(deleteBtn);
      todoList.appendChild(li);
    });
  }
}

// 페이지 로드 시 저장된 투두 리스트 불러오기
window.addEventListener('load', () => {
  if (localStorage.getItem('todos')) {
    todos = JSON.parse(localStorage.getItem('todos'));
  }
  displayCalendar(); // 페이지 로드 시 달력을 그린다.
});

// 투두 리스트가 변경될 때마다 로컬 저장소에 저장
function saveTodos() {
  localStorage.setItem('todos', JSON.stringify(todos));
}

// 이전 달로 이동
preBtn.addEventListener('click', () => {
  selected.innerHTML = ''; // 선택된 날짜 부분 초기화
  month -= 1;
  if (month < 0) {
    month = 11;
    year -= 1;
  }
  today.setMonth(month);
  displayCalendar(); // 달력을 다시 그린다.
});

// 다음 달로 이동
nextBtn.addEventListener('click', () => {
  selected.innerHTML = ''; // 선택된 날짜 부분 초기화
  month += 1;
  if (month > 11) {
    month = 0;
    year += 1;
  }
  today.setMonth(month);
  displayCalendar(); // 달력을 다시 그린다.
});
