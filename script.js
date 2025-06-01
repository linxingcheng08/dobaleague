// 問題データ（直接埋め込み形式）
const allQuestions = [
  { question: "富士山の高さは？", left: "3776m", right: "8848m", correct: "left", difficulty: 1 },
  { question: "日本の首都は？", left: "大阪", right: "東京", correct: "right", difficulty: 1 },
  { question: "世界最大の砂漠は？", left: "サハラ砂漠", right: "ゴビ砂漠", correct: "left", difficulty: 3 },
  { question: "人体で最も大きい臓器は？", left: "肝臓", right: "心臓", correct: "left", difficulty: 2 },
  { question: "地球から月までの距離は？", left: "約38万km", right: "約4万km", correct: "left", difficulty: 4 },
];

let currentQuestionIndex = 0;
let questions = [];
let countdownInterval;
let selectedDifficulties = new Set();

const openingVideo = document.getElementById("opening-video");
const fadeOverlay = document.getElementById("fade-overlay");
const mainContent = document.getElementById("main-content");
const startButton = document.getElementById("start-btn");

const quizContainer = document.getElementById("quiz-container");
const questionEl = document.getElementById("question");
const leftBtn = document.getElementById("left-btn");
const rightBtn = document.getElementById("right-btn");
const resultEl = document.getElementById("result");
const countdownEl = document.getElementById("countdown");
const timerSound = document.getElementById("timer-sound");

// オープニング終了後、フェード処理してメイン表示
openingVideo.addEventListener("ended", () => {
  fadeOverlay.classList.add("fade-in");

  setTimeout(() => {
    openingVideo.style.display = "none";
    mainContent.classList.remove("hidden");
    fadeOverlay.classList.remove("fade-in");
    fadeOverlay.classList.add("fade-out");
  }, 1000);
});

// 難易度選択ボタンの切替（クリック時）
document.querySelectorAll(".difficulty-btn").forEach(btn => {
  btn.addEventListener("click", () => {
    const level = parseInt(btn.getAttribute("data-level"));
    if (selectedDifficulties.has(level)) {
      selectedDifficulties.delete(level);
      btn.classList.remove("selected");
    } else {
      selectedDifficulties.add(level);
      btn.classList.add("selected");
    }
    // スタートボタン表示切替
    startButton.classList.toggle("hidden", selectedDifficulties.size === 0);
  });
});

// スタートボタン押下でクイズ開始
startButton.addEventListener("click", () => {
  // 音声再生許可のために一度再生して停止
  timerSound.play().then(() => {
    timerSound.pause();
    timerSound.currentTime = 0;

    const selectedLevels = Array.from(selectedDifficulties);
    questions = allQuestions.filter(q => selectedLevels.includes(q.difficulty));

    if (questions.length === 0) {
      alert("選んだ難易度に対応する問題がありません。");
      return;
    }

    // 難易度昇順に並べ替え
    questions.sort((a,b) => a.difficulty - b.difficulty);

    // UI切り替え
    document.getElementById("difficulty-selection").style.display = "none";
    quizContainer.style.display = "block";

    currentQuestionIndex = 0;
    enableButtons();
    showQuestion();
  }).catch(err => {
    console.error("初回再生エラー:", err);
  });
});

// 問題表示＋タイマー開始
function showQuestion() {
  if (currentQuestionIndex >= questions.length) {
    resultEl.textContent = "クリア！おめでとう！";
    clearInterval(countdownInterval);
    disableButtons();
    timerSound.pause();  // 最後は音も止める
    return;
  }

  const q = questions[currentQuestionIndex];
  questionEl.textContent = q.question;
  leftBtn.textContent = q.left;
  rightBtn.textContent = q.right;
  resultEl.textContent = "";

  enableButtons();
  startCountdown(10);

  // タイマー音を再生（選択時は止めるのでここで再スタート）
  timerSound.currentTime = 0;
  timerSound.play().catch(err => {
    console.warn("音声再生に失敗しました:", err);
  });
}

// カウントダウンタイマー処理
function startCountdown(seconds) {
  clearInterval(countdownInterval);
  let timeLeft = seconds;
  countdownEl.textContent = timeLeft;

  countdownInterval = setInterval(() => {
    timeLeft--;
    countdownEl.textContent = timeLeft;
    if (timeLeft <= 0) {
      clearInterval(countdownInterval);
      timerSound.pause();  // タイムアップで音も止める
      resultEl.textContent = "TIME OVER";
      disableButtons();
    }
  }, 1000);
}

// ボタン操作制御
function disableButtons() {
  leftBtn.disabled = true;
  rightBtn.disabled = true;
}

function enableButtons() {
  leftBtn.disabled = false;
  rightBtn.disabled = false;
}

// 回答チェック
function checkAnswer(choice) {
  clearInterval(countdownInterval);
  timerSound.pause();  // 選択時は音を止める
  resultEl.textContent = "";

  const q = questions[currentQuestionIndex];
  disableButtons();

  if (choice === q.correct) {
    resultEl.textContent = "正解！";
    currentQuestionIndex++;

    setTimeout(() => {
      showQuestion();
    }, 1500);
  } else {
    resultEl.textContent = "GAME OVER";
  }
}

// 左右の回答ボタンにイベント付与
leftBtn.addEventListener("click", () => {
  checkAnswer("left");
});
rightBtn.addEventListener("click", () => {
  checkAnswer("right");
});