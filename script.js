const boardWidth = 160; // ゲームボードの幅のセルの数
const boardHeight = 100; // ゲームボードの高さのセルの数
let gameBoard = createBoard(boardWidth, boardHeight);
let intervalId = null;

// ゲームボードの初期化と中心付近にランダムな生きているセルの生成
function createBoard(width, height) {
  const board = [];
  const centerX = width / 2;
  const centerY = height / 2;
  const radius = Math.min(width, height) / 5; // 中心からの距離で生きているセルを生成する範囲

  for (let i = 0; i < height; i++) {
    const row = [];
    for (let j = 0; j < width; j++) {
      // 中心からのユークリッド距離を計算
      const distance = Math.sqrt(
        Math.pow(i - centerY, 2) + Math.pow(j - centerX, 2)
      );
      // 中心付近の範囲内であればランダムに生きているセルを生成
      if (distance < radius) {
        row.push(Math.random() > 0.8); // 中心付近では50%の確率で生きているセルを生成
      } else {
        row.push(false); // 中心付近以外は死んでいるセル
      }
    }
    board.push(row);
  }
  return board;
}

// ゲームボードの描画
function drawBoard() {
  const gameBoardDiv = document.getElementById("gameBoard");
  gameBoardDiv.innerHTML = "";
  gameBoardDiv.style.gridTemplateColumns = `repeat(${boardWidth}, 10px)`; // セルの幅を設定
  gameBoard.forEach((row, i) => {
    row.forEach((cell, j) => {
      const cellDiv = document.createElement("div");
      cellDiv.classList.add("cell");
      if (cell) {
        cellDiv.classList.add("alive");
      }
      cellDiv.addEventListener("mousedown", () => {
        gameBoard[i][j] = !gameBoard[i][j];
        drawBoard();
      });
      gameBoardDiv.appendChild(cellDiv);
    });
  });
}

// ゲームの状態を更新
function updateGame() {
  const newBoard = [];
  for (let i = 0; i < boardHeight; i++) {
    const newRow = [];
    for (let j = 0; j < boardWidth; j++) {
      const aliveNeighbours = countNeighbours(i, j);
      if (gameBoard[i][j]) {
        // 生きているセルは、2つまたは3つの隣接する生きているセルがある場合に生存
        newRow.push(aliveNeighbours === 2 || aliveNeighbours === 3);
      } else {
        // 死んでいるセルは、ちょうど3つの隣接する生きているセルがある場合に生命が誕生
        newRow.push(aliveNeighbours === 3);
      }
    }
    newBoard.push(newRow);
  }
  gameBoard = newBoard;
  drawBoard();
}

// 隣接する生きているセルの数を数える
function countNeighbours(row, col) {
  let count = 0;
  for (let i = -1; i <= 1; i++) {
    for (let j = -1; j <= 1; j++) {
      if (i === 0 && j === 0) continue; // 自身のセルはカウントしない
      const x = col + j;
      const y = row + i;
      // ボードの範囲内かつ生きているセルの場合にカウント
      if (x >= 0 && x < boardWidth && y >= 0 && y < boardHeight) {
        count += gameBoard[y][x] ? 1 : 0;
      }
    }
  }
  return count;
}

// トグルボタンのイベントリスナー
document.getElementById("toggleButton").addEventListener("change", function () {
  if (this.checked) {
    if (!intervalId) {
      intervalId = setInterval(updateGame, 100);
    }
  } else {
    if (intervalId) {
      clearInterval(intervalId);
      intervalId = null;
    }
  }
});

// // ページが読み込まれたらゲームを開始
// window.onload = () => {
//   drawBoard();
//   intervalId = setInterval(updateGame, 100);
// };

// マウスが離されたとき、またはドラッグが終了したときのイベント
document.addEventListener("mouseup", () => {
  isDragging = false;
});

drawBoard();
