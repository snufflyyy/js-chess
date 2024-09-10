import Piece from "./piece.js";

class Tile {
    position = { x: 0, y: 0 };
    color = false; // false = white | true = black

    static whiteTileColor = "#3f3f3f";
    static blackTileColor = "#282828";

    constructor(x, y, color) {
        this.position.x = x;
        this.position.y = y;
        this.color = color;

        this.piece = null;
    }

    drawTile(context, tileSize) {
        context.fillStyle = this.color ? Tile.blackTileColor : Tile.whiteTileColor;
        context.fillRect(this.position.x, this.position.y, tileSize, tileSize);
    }
}

export default Tile;