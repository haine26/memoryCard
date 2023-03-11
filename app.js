const startGameEl = document.querySelector("#game-start");
const gameNameEl = document.querySelector("#game-name");
const gameInEl = document.querySelector("#game-in");
const endGameEl = document.querySelector("#game-end");

const levelOptionEl = document.querySelector("#level-option");
const timeOptionEl = document.querySelector("#time-option");
const cardImageEl = document.querySelector(".memory-card");

const resultEl = document.querySelector(".result");

const btnStartGame = document.querySelector("#btn-start-game");
const btnGameAgain = document.querySelector("#btn-game-again");
const btnQuitGame = document.querySelector("#btn-quit-game");

const timeEl = document.querySelector("#time");
const stepEl = document.querySelector("#step");

// Khai báo biến
let level;
let lockBoard = false; // Khóa không cho ấn
let firstCard = null; // Chứa phần tử DOM CARD khi mở lần 1
let secondCard = null; // Chứa phần tử DOM CARD khi mở lần 2
let score = 0;
let time = 0;
let step = 0;
let interval;

let sizes = {
  2: {
    row: 2,
    col: 2,
  },
  4: {
    row: 2,
    col: 4,
  },
  6: {
    row: 3,
    col: 4,
  },
};

let listCards = [
  {
    url: "./image/card_1.png",
    name: "1",
  },
  {
    url: "./image/card_2.png",
    name: "2",
  },
  {
    url: "./image/card_3.png",
    name: "3",
  },
  {
    url: "./image/card_4.png",
    name: "4",
  },
  {
    url: "./image/card_5.png",
    name: "5",
  },
  {
    url: "./image/card_6.png",
    name: "6",
  },
  {
    url: "./image/card_7.png",
    name: "7",
  },
  {
    url: "./image/card_8.png",
    name: "8",
  },
  {
    url: "./image/card_9.png",
    name: "9",
  },
  {
    url: "./image/card_10.png",
    name: "10",
  },
  {
    url: "./image/card_11.png",
    name: "11",
  },
  {
    url: "./image/card_12.png",
    name: "12",
  },
  {
    url: "./image/card_13.png",
    name: "13",
  },
  {
    url: "./image/card_14.png",
    name: "14",
  },
  {
    url: "./image/card_15.png",
    name: "15",
  },
  {
    url: "./image/card_16.png",
    name: "16",
  },
  {
    url: "./image/card_17.png",
    name: "17",
  },
  {
    url: "./image/card_18.png",
    name: "18",
  },
  {
    url: "./image/card_19.png",
    name: "19",
  },
  {
    url: "./image/card_20.png",
    name: "20",
  },
  {
    url: "./image/card_21.png",
    name: "21",
  },
];

function renderCards(level) {
  listCards = shuffle(listCards);
  let cardsSlice = listCards.slice(0, level);
  cards = [...cardsSlice, ...cardsSlice];
  cards = shuffle(cards);
  let size = sizes[level];
  cardImageEl.style.gridTemplateColumns = `repeat(${size.col},150px)`;
  cardImageEl.style.gridTemplateRows = `repeat(${size.row},175px)`;
  cardImageEl.innerHTML = "";
  for (let i = 0; i < cards.length; i++) {
    const c = cards[i];
    cardImageEl.innerHTML += `
              <div
                  class="card-img style="width:150px;""
                  data-name="${c.name}"
                onclick="flipCard(this)"
              >
                  <img class="card-front" src="${c.url}" alt="${c.name}">
                  <img class="card-back" src="./image/card.png"
                      alt="card-back">
              </div>
          `;
  }
}
btnStartGame.addEventListener("click", function () {
  level = Number(levelOptionEl.value);
  time = Number(timeOptionEl.value) * Number(levelOptionEl.value);
  console.log(time);

  startGameEl.style.display = "none";
  gameNameEl.style.display = "none";
  gameInEl.style.display = "flex";

  renderCards(level);
  convertTime(time);
  interval = setInterval(updateTime, 1000);
});

function updateTime() {
  time--;
  timeEl.innerText = convertTime(time);
  if (time <= 0) {
    checkResult();
    resultEl.innerHTML = "GAME OVER";
  }
}

function convertTime(time) {
  let minute = `0${Math.floor(time / 60)}`.slice(-2);
  let second = `0${time % 60}`.slice(-2);

  return `${minute}:${second}s`;
}

function shuffle(arr) {
  return arr.sort(function () {
    return 0.5 - Math.random();
  });
}

function flipCard(card) {
  if (lockBoard) {
    return;
  }

  if (card === firstCard) {
    return;
  }

  card.classList.toggle("flip");

  // Khi click CARD đầu tiên
  if (!firstCard) {
    firstCard = card;
    return;
  }

  // Khi click CARD thứ 2
  secondCard = card;
  checkForMatch();

  // Update step
  updateStep();
}

function checkForMatch() {
  // Kiểm tra xem NAME của 2 CARD có giống nhau không?
  let isMatch = firstCard.dataset.name === secondCard.dataset.name;

  // isMatch = true => xóa sự kiện click ở 2 CARD đó
  // isMatch = false => úp CARD xuống
  isMatch ? disableCards() : unflipCards();
}

function unflipCards() {
  lockBoard = true;

  setTimeout(() => {
    firstCard.classList.remove("flip");
    secondCard.classList.remove("flip");

    resetBoard();
  }, 1000);
}

function disableCards() {
  firstCard.removeEventListener("click", flipCard);
  secondCard.removeEventListener("click", flipCard);

  resetBoard();

  score++;
  checkResult();
  resultEl.innerHTML = "WIN!!!";
}
function resetBoard() {
  lockBoard = false;
  firstCard = null;
  secondCard = null;
}

function checkResult() {
  if (score == level || time <= 0) {
    clearInterval(interval);

    setTimeout(() => {
      gameInEl.style.display = "none";
      endGameEl.style.display = "flex";
    }, 1200);
  }
}

function updateStep() {
  step++;
  stepEl.innerText = `${step} moves`;
}

btnGameAgain.addEventListener("click", function () {
  score = 0;
  step = 0;
  time = Number(timeOptionEl.value) * Number(levelOptionEl.value);
  timeEl.innerText = convertTime(time);
  stepEl.innerText = `${step} moves`;

  // Chạy thời gian
  interval = setInterval(updateTime, 1000);

  // Dựa vào level đã có => khởi tạo game
  renderCards(level);

  // Ẩn END => show GAME
  endGameEl.style.display = "none";
  gameInEl.style.display = "flex";
});

btnQuitGame.addEventListener("click", function () {
  window.location.reload();
});
