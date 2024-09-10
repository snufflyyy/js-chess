class Piece {
    static textures = {
        white: {
        pawn: new Image(),
        rook: new Image(),
        knight: new Image(),
        bishop: new Image(),
        queen: new Image(),
        king: new Image()
        },
        black: {
        pawn: new Image(),
        rook: new Image(),
        knight: new Image(),
        bishop: new Image(),
        queen: new Image(),
        king: new Image(),
        }
    };

    static types = {
        NONE:   "none",
        PAWN:   "pawn",
        ROOK:   "rook",
        KNIGHT: "knight",
        BISHOP: "bishop",
        QUEEN:  "queen",
        KING:   "king",
    };

    position = { x: 0, y: 0 };
    color = false; // false = white | black = true
    moves = 0;

    constructor(x, y, color, type) {
        this.position.x = x;
        this.position.y = y;
        this.color = color;

        this.type = type;
    }

    static initTextures() {
        Piece.textures.white.pawn.src   = "assets/pieces/wP.svg";
        Piece.textures.white.rook.src   = "assets/pieces/wr.svg";
        Piece.textures.white.knight.src = "assets/pieces/wN.svg";
        Piece.textures.white.bishop.src = "assets/pieces/wB.svg";
        Piece.textures.white.queen.src  = "assets/pieces/wQ.svg";
        Piece.textures.white.king.src   = "assets/pieces/wK.svg";

        Piece.textures.black.pawn.src   = "assets/pieces/bP.svg";
        Piece.textures.black.rook.src   = "assets/pieces/bR.svg";
        Piece.textures.black.knight.src = "assets/pieces/bN.svg";
        Piece.textures.black.bishop.src = "assets/pieces/bB.svg";
        Piece.textures.black.queen.src  = "assets/pieces/bQ.svg";
        Piece.textures.black.king.src   = "assets/pieces/bK.svg";
    }

    drawPiece(context, tileSize) {
        let pieceImage = new Image();

        switch (this.type) { 
        case Piece.types.PAWN:
            pieceImage = this.color ? Piece.textures.black.pawn   : Piece.textures.white.pawn; 
            break;
        case Piece.types.ROOK:
            pieceImage = this.color ? Piece.textures.black.rook   : Piece.textures.white.rook; 
            break;
        case Piece.types.KNIGHT: 
            pieceImage = this.color ? Piece.textures.black.knight : Piece.textures.white.knight; 
            break;
        case Piece.types.BISHOP: 
            pieceImage = this.color ? Piece.textures.black.bishop : Piece.textures.white.bishop; 
            break;
        case Piece.types.QUEEN:  
            pieceImage = this.color ? Piece.textures.black.queen  : Piece.textures.white.queen; 
            break;
        case Piece.types.KING:   
            pieceImage = this.color ? Piece.textures.black.king   : Piece.textures.white.king; 
            break;
        }

        // draw the piece
        context.drawImage(
            pieceImage,
            this.position.x,
            this.position.y,
            tileSize,
            tileSize,
        );
    }
}

export default Piece