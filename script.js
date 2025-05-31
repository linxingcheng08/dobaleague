// 初期設定：HTML要素の取得
const introVideo = document.getElementById('intro-video');
const bgVideo = document.getElementById('bg-video');
const mainContent = document.getElementById('main-content');
const difficultyButtons = document.querySelectorAll('.difficulty-btn');
const quizContainer = document.getElementById('quiz-container');
const difficultySelection = document.getElementById('difficulty-selection');
const questionElem = document.getElementById('question');
const leftBtn = document.getElementById('left-btn');
const rightBtn = document.getElementById('right-btn');
const resultElem = document.getElementById('result');
const countdownElem = document.getElementById('countdown');

// クイズデータ
const allQuestions = [
  {
    difficulty: 1,
    genre: "国語",
    question: "これは何の漢字？",
    left: "犬",
    right: "猫",
    answer: "left"
  },
  {
    difficulty: 2,
    genre: "算数",
    question: "2 + 2 = ?",
    left: "3",
    right: "4",
    answer: "right"
  },
  {
    difficulty: 3,
    genre: "理科",
    question: "水は何度で沸騰する？",
    left: "90℃",
    right: "100℃",
    answer: "right"
  }
  // 必要に応じて追加してください
];

let questions = [];
let currentQuestionIndex = 0;
let countdownInterval;
let selectedDifficulty = null;

// ▼ ロゴ動画終了時に背景＋UI表示
introVideo.addEventListener('ended', () => {
  introVideo.classList.add('hidden');
  bgVideo.classList.remove('hidden');
  mainContent.classList.remove('hidden');
});

// ▼ 難易度選択時の処理
difficultyButtons.forEach(btn => {
  btn.addEventListener('click', function () {
    selectedDifficulty = parseInt(this.dataset.level);
    difficultyButtons.forEach(b => b.classList.remove('selected'));
    this.classList.add('selected');

    questions = allQuestions.filter(q => q.difficulty <= selectedDifficulty);
    if (questions.length === 0) {
      alert("この難易度の問題がありません。");
      return;
    }

    questions.sort((a, b) => a.difficulty - b.difficulty);
    difficultySelection.style.display = 'none';
    quizContainer.style.display = 'block';
    currentQuestionIndex = 0;
    showQuestion();
  });
});

// ▼ クイズを表示
function showQuestion() {
  clearInterval(countdownInterval);

  if (currentQuestionIndex >= questions.length) {
    resultElem.innerText = "クイズ終了！";
    return;
  }

  const q = questions[currentQuestionIndex];
  questionElem.innerText = q.question;
  leftBtn.innerText = q.left;
  rightBtn.innerText = q.right;
  resultElem.innerText = "";

  let timeLeft = 10;
  countdownElem.innerText = timeLeft;

  countdownInterval = setInterval(() => {
    timeLeft--;
    countdownElem.innerText = timeLeft;
    if (timeLeft <= 0) {
      clearInterval(countdownInterval);
      resultElem.innerText = "GAME OVER";
    }
  }, 1000);
}

// ▼ ボタンのイベント処理
leftBtn.addEventListener('click', () => checkAnswer('left'));
rightBtn.addEventListener('click', () => checkAnswer('right'));

// ▼ 正誤判定
function checkAnswer(answer) {
  clearInterval(countdownInterval);
  const correct = questions[currentQuestionIndex].answer === answer;
  resultElem.innerText = correct ? "正解！" : "GAME OVER";

  if (correct) {
    currentQuestionIndex++;
    setTimeout(showQuestion, 2000);
  }
}
