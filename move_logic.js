export function executeMoveOnArray(fen, pieceArray, colFrom, rowFrom, colTo, rowTo) {

    pieceArray[rowTo][colTo] = pieceArray[rowFrom][colFrom];
    pieceArray[rowFrom][colFrom] = "";

    
}


export function isValidMove(fen, pieceArray, colFrom, rowFrom, colTo, rowTo) {
    let fenParts = fen.split(" ");
    let activeColor = fenParts[1];
    let piece = pieceArray[rowFrom][colFrom];
    if (activeColor === "w" && piece === piece.toLowerCase()) return false;
    if (activeColor === "b" && piece === piece.toUpperCase()) return false;
    return true; // Placeholder: always returns true
}