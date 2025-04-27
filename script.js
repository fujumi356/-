// script.js
const SIZE = 8;
const MAX_MOVES = 18;

// クイズ問題と正解をここで設定
const quizQuestion = "王の座は50\n馬の座は100\n歩の座は？";
const quizAnswer   = "400";

let moveCount = 0;
let stock     = 1;
let pos        = { r: 0, c: 0 }; // スタートは左上

// DOM取得
const gridEl       = document.getElementById('grid');
const counterEl    = document.getElementById('counter');
const messageEl    = document.getElementById('message');
const quizEl       = document.getElementById('quiz');
const quizTextEl   = document.getElementById('quiz-text');
const quizInputEl  = document.getElementById('quiz-answer');
const quizSubmitEl = document.getElementById('quiz-submit');
const clearEl      = document.getElementById('clear-screen');

// 素数判定
function isPrime(n) {
  if (n < 2) return false;
  for (let i = 2; i * i <= n; i++) {
    if (n % i === 0) return false;
  }
  return true;
}

// グリッド生成
const cells = [];
for (let r = 0; r < SIZE; r++) {
  for (let c = 0; c < SIZE; c++) {
    const cell = document.createElement('div');
    cell.className = 'cell';
    cell.textContent = (r + 1) * (c + 1);
    gridEl.appendChild(cell);
    cells.push(cell);
  }
}

// 現在地表示更新
function updateGrid() {
  cells.forEach((cell, idx) => {
    const r = Math.floor(idx / SIZE), c = idx % SIZE;
    cell.classList.toggle('current', r === pos.r && c === pos.c);
  });
}
updateGrid();

// リセット処理
function resetGame(reason) {
  messageEl.textContent = reason + ' スタート地点にリセットします。';
  hideQuiz();
  pos = { r: 0, c: 0 };
  moveCount = 0;
  stock = 1;
  counterEl.textContent = '移動回数: ' + moveCount.toString(9);
  updateGrid();
}

// クイズ表示
function showQuiz() {
  // ビュー切り替え
  quizTextEl.textContent = quizQuestion;
  quizInputEl.value = "";
  quizEl.classList.remove('hidden');
  gridEl.classList.add('hidden');
  document.getElementById('controls').classList.add('hidden');
  messageEl.textContent = 'クイズに答えてください！';
}

// クイズ非表示
function hideQuiz() {
  quizEl.classList.add('hidden');
  gridEl.classList.remove('hidden');
  document.getElementById('controls').classList.remove('hidden');
}

// ゲームクリア表示
function showClear() {
  clearEl.classList.remove('hidden');
  messageEl.textContent = '';
  gridEl.classList.add('hidden');
  document.getElementById('controls').classList.add('hidden');
}

// 移動処理
function move(dr, dc) {
  const nr = pos.r + dr, nc = pos.c + dc;
  // 壁チェック
  if (nr < 0 || nr >= SIZE || nc < 0 || nc >= SIZE) {
    messageEl.textContent = 'そこには移動できません。';
    return;
  }
  
  pos = { r: nr, c: nc };
  moveCount++;
  counterEl.textContent = '移動回数: ' + moveCount.toString(9);
  messageEl.textContent = '';
  
  // 回数オーバー
  if (moveCount > MAX_MOVES) {
    resetGame('移動回数が20回を超えました。');
    return;
  }

  const val = (nr + 1) * (nc + 1);
  const sum = stock + val;

  // 素数チェック
  if (sum > 1000 || !isPrime(sum)) {
    resetGame(`２つめの失敗条件を満たしました。`);
    return;
  }
  stock = sum;

  // 36マス到達 → クイズ
  if (val === 36) {
    showQuiz();
    return;
  }
  // 64マス到達 → クリア
  if (val === 64) {
    messageEl.textContent = '葉のマスに到達。\nここと１を除くもう一つの一つしかない到達可能な部屋へ行け。\nはじを知ることが重要だ。';
  }

  updateGrid();
}

// 矢印ボタン
document.getElementById('up')   .addEventListener('click', () => move(-1,  0));
document.getElementById('down') .addEventListener('click', () => move( 1,  0));
document.getElementById('left') .addEventListener('click', () => move( 0, -1));
document.getElementById('right').addEventListener('click', () => move( 0,  1));

// クイズ回答処理
quizSubmitEl.addEventListener('click', () => {
  const answer = quizInputEl.value.trim();
  if (answer === quizAnswer) {
    showClear();
  } else {
    resetGame('不正解です。');
  }
});
