import { mousePosition, mouseDown, getMousePosition, handleMouseDown, handleMouseUp } from "./input.js";

import Piece from "./piece.js";
import Tile  from "./tile.js";

// canvas related stuff
const gameCanvas = document.getElementById("gameCanvas");
const context = gameCanvas.getContext("2d");

// board related stuff
const boardSize = 8;
const tileSize = gameCanvas.width / boardSize;
let moves = 0;
let activeColor = false; // false = white | true = black
let fens = ["rnbqkbnr/pppppppp/8/8/8/8/PPPPPPPP/RNBQKBNR w KQkq - 0 1"]; // starting positions
let pgn = "";
let board = [];
let validMovesBoard = [];

let hasSelectedTile = false;
let selected = { x: -1, y: -1 }; // selected tile index
let hovered = { x: 0, y: 0 }; // hovered tile index

// input stuff
gameCanvas.addEventListener("mousemove", function (e) {
  getMousePosition(gameCanvas, e);
});
gameCanvas.addEventListener("mousedown", handleMouseDown);
gameCanvas.addEventListener("mouseup", handleMouseUp);

function createBoard() {
  Piece.initTextures();

  let color = false;

  for (let x = 0; x < boardSize; x++) {
    board[x] = [];
    validMovesBoard[x] = [];
    for (let y = 0; y < boardSize; y++) {
      color = (x + y) % 2 !== 0;

      board[x].push(new Tile(x * tileSize, y * tileSize, color));
      validMovesBoard[x].push(false);
    }
  }

  decodeFen();
}

// decodes the fen string and puts it on the game board
function decodeFen() {
  const pieceMap = {
    // white
    P: { piece: Piece.types.PAWN,   color: false },
    R: { piece: Piece.types.ROOK,   color: false },
    N: { piece: Piece.types.KNIGHT, color: false },
    B: { piece: Piece.types.BISHOP, color: false },
    Q: { piece: Piece.types.QUEEN,  color: false },
    K: { piece: Piece.types.KING,   color: false },

    // black
    p: { piece: Piece.types.PAWN,   color: true },
    r: { piece: Piece.types.ROOK,   color: true },
    n: { piece: Piece.types.KNIGHT, color: true },
    b: { piece: Piece.types.BISHOP, color: true },
    q: { piece: Piece.types.QUEEN,  color: true },
    k: { piece: Piece.types.KING,   color: true },
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
        board[col][pos].piece = new Piece(board[col][pos].position.x, board[col][pos].position.y, pieceMap[char].color, pieceMap[char].piece);
        col++;
      }
    }
  }
}

function encodeFen() {
  let newFen = "";
  let emptySpaces = 0;

  for (let y = 0; y < boardSize; y++) {
    for (let x = 0; x < boardSize; x++) {
      if (board[x][y].piece != null) {
        if (emptySpaces > 0) {
          newFen += emptySpaces.toString();
        }
        
        // reset empty spaces
        emptySpaces = 0;

        switch (board[x][y].piece.type) {
          case Piece.types.PAWN:   newFen += board[x][y].piece.color ? "p" : "P"; break;
          case Piece.types.ROOK:   newFen += board[x][y].piece.color ? "r" : "R"; break;
          case Piece.types.KNIGHT: newFen += board[x][y].piece.color ? "n" : "N"; break;
          case Piece.types.BISHOP: newFen += board[x][y].piece.color ? "b" : "B"; break;
          case Piece.types.QUEEN:  newFen += board[x][y].piece.color ? "q" : "Q"; break;
          case Piece.types.KING:   newFen += board[x][y].piece.color ? "k" : "K"; break;
        }
      } else {
        emptySpaces++;
      }
    }
    
    if (emptySpaces > 0) {
      newFen += emptySpaces.toString();
    }

    emptySpaces = 0;
    if (y != 7) {
      newFen += "/";
    } else {
      newFen += " ";
    }
  }

  newFen += activeColor ? "b" : "w";

  console.log(newFen);
}

function addMoveToPgn() {

}

function getCollisionBoard() {
  if (mouseDown) {
    // gets mouse position and finds which tile the mouse is over
    for (let x = 0; x < boardSize; x++) {
      for (let y = 0; y < boardSize; y++) {
        if (
          mousePosition.x >= x * tileSize &&
          mousePosition.x <= x * tileSize + tileSize &&
          mousePosition.y >= y * tileSize &&
          mousePosition.y <= y * tileSize + tileSize
        ) {
          hovered.x = x;
          hovered.y = y;
        }
      }
    }

    // selects piece
    if (board[hovered.x][hovered.y].piece != null && !hasSelectedTile) {
      selected.x = hovered.x;
      selected.y = hovered.y;

      hasSelectedTile = true;
    }

    // moves piece to mouse position
    if (hasSelectedTile) {
      board[selected.x][selected.y].piece.position.x =
        mousePosition.x - tileSize / 2;
      board[selected.x][selected.y].piece.position.y =
        mousePosition.y - tileSize / 2;
    }
  } else {
    if (hasSelectedTile) {
      const tempPiece = board[selected.x][selected.y].piece;
      board[selected.x][selected.y].piece = null;

      // place piece on board
      board[hovered.x][hovered.y].piece = tempPiece;  
      board[hovered.x][hovered.y].piece.position.x = board[hovered.x][hovered.y].position.x;
      board[hovered.x][hovered.y].piece.position.y = board[hovered.x][hovered.y].position.y;

      activeColor = !activeColor;

      encodeFen();
      addMoveToPgn();
    }

    hasSelectedTile = false;
    selected = { x: -1, y: -1};
  }
}

function drawBoard() {
  for (let x = 0; x < boardSize; x++) {
    for (let y = 0; y < boardSize; y++) {
      board[x][y].drawTile(context, tileSize);

      if ((x != selected.x || y != selected.y) && board[x][y].piece != null) {
        board[x][y].piece.drawPiece(context, tileSize);
      }
    }
  }

  // draw selected piece later so it draws above the other pieces
  if (hasSelectedTile) {
    board[selected.x][selected.y].piece.drawPiece(context, tileSize);
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