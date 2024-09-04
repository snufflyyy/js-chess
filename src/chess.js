const gameCanvas = document.getElementById("gameCanvas");

const context = gameCanvas.getContext("2d");

// piece types
const Pieces = {
  NONE: "none",
  PAWN: "pawn",
  ROOK: "rook",
  KNIGHT: "knight",
  BISHOP: "bishop",
  QUEEN: "queen",
  KING: "king",
};

// piece textures
const wP = new Image();
wP.src = "assets/pieces/wP.svg";
const wR = new Image();
wR.src = "assets/pieces/wR.svg";
const wN = new Image();
wN.src = "assets/pieces/wN.svg";
const wB = new Image();
wB.src = "assets/pieces/wB.svg";
const wQ = new Image();
wQ.src = "assets/pieces/wQ.svg";
const wK = new Image();
wK.src = "assets/pieces/wK.svg";

const bP = new Image();
bP.src = "assets/pieces/bP.svg";
const bR = new Image();
bR.src = "assets/pieces/bR.svg";
const bN = new Image();
bN.src = "assets/pieces/bN.svg";
const bB = new Image();
bB.src = "assets/pieces/bB.svg";
const bQ = new Image();
bQ.src = "assets/pieces/bQ.svg";
const bK = new Image();
bK.src = "assets/pieces/bK.svg";

// chess board "tiles"
class Tile {
  position = { x: 0, y: 0 };
  piecePosition = { x: 0, y: 0};
  piece = Pieces.NONE;
  pieceColor = false; // false = white | true = black
  color = false; // false = white | true = black

  constructor(x, y, color) {
    this.position.x = x;
    this.position.y = y;

    this.piecePosition.x = x;
    this.piecePosition.y = y; 

    this.color = color;
  }

  drawTile() {
    // tile itself
    context.fillStyle = this.color ? blackTileColor : whiteTileColor;

    context.fillRect(this.position.x, this.position.y, tileSize, tileSize);
  }

  drawPiece() {
    // piece if it has one
    if (this.piece != "none") {
      let pieceImage = new Image();

      if (this.pieceColor == false) {
        // white
        switch (this.piece) {
          case Pieces.PAWN:
            pieceImage = wP;
            break;
          case Pieces.ROOK:
            pieceImage = wR;
            break;
          case Pieces.KNIGHT:
            pieceImage = wN;
            break;
          case Pieces.BISHOP:
            pieceImage = wB;
            break;
          case Pieces.QUEEN:
            pieceImage = wQ;
            break;
          case Pieces.KING:
            pieceImage = wK;
            break;
        }
      } else {
        // black
        switch (this.piece) {
          case Pieces.PAWN:
            pieceImage = bP;
            break;
          case Pieces.ROOK:
            pieceImage = bR;
            break;
          case Pieces.KNIGHT:
            pieceImage = bN;
            break;
          case Pieces.BISHOP:
            pieceImage = bB;
            break;
          case Pieces.QUEEN:
            pieceImage = bQ;
            break;
          case Pieces.KING:
            pieceImage = bK;
            break;
        }
      }

      // draw the piece
      context.drawImage(
        pieceImage,
        this.piecePosition.x,
        this.piecePosition.y,
        tileSize,
        tileSize,
      );
    }
  }
}

let fens = [];
let board = [];

let selectedTileIndex = {x: -1, y: -1};

const boardSize = 8;
const tileSize = gameCanvas.width / boardSize;

const whiteTileColor = "#3f3f3f";
const blackTileColor = "#282828";

let mousePosition = { x: 0, y: 0 };
let mouseDown = false;

let hoveredTileIndex = { x: 0, y: 0 };

// input related stuff below
function getMousePosition(canvas, event) {
  let rect = canvas.getBoundingClientRect();
  let x = event.clientX - rect.left;
  let y = event.clientY - rect.top;

  mousePosition.x = x;
  mousePosition.y = y;
}

gameCanvas.addEventListener("mousemove", function (e) {
  getMousePosition(gameCanvas, e);
});

gameCanvas.addEventListener("mousedown", function (e) {
  mouseDown = true;
});

gameCanvas.addEventListener("mouseup", function (e) {
  mouseDown = false;
});

// decodes the cool fen string and puts it on the game board
function decodeFen() {
  const pieceMap = {
    r: { piece: Pieces.ROOK, color: true },
    n: { piece: Pieces.KNIGHT, color: true },
    b: { piece: Pieces.BISHOP, color: true },
    q: { piece: Pieces.QUEEN, color: true },
    k: { piece: Pieces.KING, color: true },
    p: { piece: Pieces.PAWN, color: true },
    R: { piece: Pieces.ROOK, color: false },
    N: { piece: Pieces.KNIGHT, color: false },
    B: { piece: Pieces.BISHOP, color: false },
    Q: { piece: Pieces.QUEEN, color: false },
    K: { piece: Pieces.KING, color: false },
    P: { piece: Pieces.PAWN, color: false },
  };

  let pos = 0;
  let col = 0;

  for (let i = 0; i < fens[fens.length - 1].length; i++) {
    let char = fens[fens.length - 1].charAt(i);

    if (char == "/" || char == " ") {
      pos++;
      col = 0;
      continue;
    }

    if (pos < boardSize) {
      if (char >= "0" && char <= "9") {
        col += parseInt(char, 10);
        continue;
      } else if (pieceMap[char]) {
        board[col][pos].piece = pieceMap[char].piece;
        board[col][pos].pieceColor = pieceMap[char].color;
        col++;
      }
    }
  }
}

function createBoard() {
  // color of tile of board
  // false = white | true = black
  let color = false;

  for (let x = 0; x < boardSize; x++) {
    board[x] = [];
    for (let y = 0; y < boardSize; y++) {
      color = (x + y) % 2 !== 0;

      board[x].push(new Tile(x * tileSize, y * tileSize, color));
    }
  }

  // starting fen
  fens.push("rnbqkbnr/pppppppp/8/8/8/8/PPPPPPPP/RNBQKBNR w KQkq - 0 1");

  decodeFen();
}

function getCollisionBoard() {
  if (mouseDown) {
  for (let x = 0; x < boardSize; x++) {
    for (let y = 0; y < boardSize; y++) {
      if (
        mousePosition.x >= x * tileSize &&
        mousePosition.x <= x * tileSize + tileSize &&
        mousePosition.y >= y * tileSize &&
        mousePosition.y <= y * tileSize + tileSize
      ) {
        hoveredTileIndex.x = x;
        hoveredTileIndex.y = y;
      }
    }
  }

    // selects piece
    if (board[hoveredTileIndex.x][hoveredTileIndex.y].piece != Pieces.NONE && selectedTileIndex.x == -1 && selectedTileIndex.y == -1) {
      selectedTileIndex.x = hoveredTileIndex.x;
      selectedTileIndex.y = hoveredTileIndex.y;
    }

    // moves piece to mouse position
    if (selectedTileIndex.x != -1 && selectedTileIndex.y != -1) {
      board[selectedTileIndex.x][selectedTileIndex.y].piecePosition.x = mousePosition.x - tileSize / 2;
      board[selectedTileIndex.x][selectedTileIndex.y].piecePosition.y = mousePosition.y - tileSize / 2;
    }
  } else {
    if (selectedTileIndex.x != -1 && selectedTileIndex.y != -1) {
      // place piece on board
      board[hoveredTileIndex.x][hoveredTileIndex.y].piece = board[selectedTileIndex.x][selectedTileIndex.y].piece;
      board[hoveredTileIndex.x][hoveredTileIndex.y].pieceColor = board[selectedTileIndex.x][selectedTileIndex.y].pieceColor;

      if (hoveredTileIndex.x != selectedTileIndex.x && hoveredTileIndex.y != selectedTileIndex.y)
      board[selectedTileIndex.x][selectedTileIndex.y].piece = Pieces.NONE;
      board[selectedTileIndex.x][selectedTileIndex.y].piecePosition.x = board[selectedTileIndex.x][selectedTileIndex.y].position.x;
      board[selectedTileIndex.x][selectedTileIndex.y].piecePosition.y = board[selectedTileIndex.x][selectedTileIndex.y].position.y;
    }

    selectedTileIndex = {x: -1, y: -1};
  }
}

function drawBoard() {
  for (let x = 0; x < boardSize; x++) {
    for (let y = 0; y < boardSize; y++) {
      board[x][y].drawTile();

      if (x != selectedTileIndex.x || y != selectedTileIndex.y) {
        board[x][y].drawPiece();
      }
    }
  }

  // draw selected piece later so it draws above the other pieces
  if (selectedTileIndex.x != -1 && selectedTileIndex.y != -1) {
    board[selectedTileIndex.x][selectedTileIndex.y].drawPiece();
  }
}

function update() {
  setTimeout(() => {
    getCollisionBoard();
    drawBoard();
    update();
  }, 10);
}

createBoard();
update();
