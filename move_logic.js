export function executeMoveOnArray(fen, pieceArray, colFrom, rowFrom, colTo, rowTo) {
    let isValidMove = true;
    if (pieceArray[rowFrom][colFrom] === "P") {
        whitePawnCase(fen, pieceArray, colFrom, rowFrom, colTo, rowTo, isValidMove);
    }
    pieceArray[rowTo][colTo] = pieceArray[rowFrom][colFrom];
    pieceArray[rowFrom][colFrom] = "";

    
}


export function isValidMove(fen, pieceArray, colFrom, rowFrom, colTo, rowTo) {
    let fenParts = fen.split(" ");
    let activeColor = fenParts[1];
    let pieceFrom = pieceArray[rowFrom][colFrom];
    let pieceTo = pieceArray[rowTo][colTo];
    if (activeColor === "w" && pieceFrom === pieceFrom.toLowerCase()) return false; //white moves a black piece
    if (activeColor === "b" && pieceFrom === pieceFrom.toUpperCase()) return false; //black moves a white piece
    if (activeColor == "w" && pieceTo === pieceTo.toUpperCase() && pieceFrom === pieceFrom.toUpperCase()) return false; //white takes white
    if (activeColor == "b" && pieceTo === pieceTo.toLowerCase() && pieceFrom === pieceFrom.toLowerCase()) return false; //black takes black
    if (pieceFrom === "") return false; //tries to move an empty square
    return true;
}

function whitePawnCase (fen, pieceArray, colFrom, rowFrom, colTo, rowTo, isValidMove) { //not done
    let fromPiece = pieceArray[colFrom][rowFrom];
    let toPiece = pieceArray[colTo][rowTo];
    if (rowTo === rowFrom + 1 ) {
        if (colTo === colFrom && toPiece === ""){

        }
        else if (1 === Math.abs(colFrom - colTo) && toPiece !== "" && toPiece.toUpperCase !== toPiece){

        }
    }
}