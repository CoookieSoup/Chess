export function executeMoveOnArray(fen, pieceArray, colFrom, rowFrom, colTo, rowTo) {
    
    if (!isValid(fen, pieceArray, colFrom, rowFrom, colTo, rowTo)) {
        return false;
    }
    switch (pieceArray[rowFrom][colFrom]){
        case "P":
            if (!whitePawnCase(fen, pieceArray, colFrom, rowFrom, colTo, rowTo)) return false;
            return true;
        case "p":
            if (!blackPawnCase(fen, pieceArray, colFrom, rowFrom, colTo, rowTo)) return false;
            return true;
        case "r":
        case "R":
            if (!rookCase(fen, pieceArray, colFrom, rowFrom, colTo, rowTo)) return false;
            return true;
        
        default:
            movePiece(pieceArray, colFrom, rowFrom, colTo, rowTo);
            return true;
    }
}


function isValid(fen, pieceArray, colFrom, rowFrom, colTo, rowTo) {
    let fenParts = fen.split(" ");
    let activeColor = fenParts[1];
    let pieceFrom = pieceArray[rowFrom][colFrom];
    let pieceTo = pieceArray[rowTo][colTo];
    if (activeColor === "w" && pieceFrom === pieceFrom.toLowerCase()) return false; //white moves a black piece
    if (activeColor === "b" && pieceFrom === pieceFrom.toUpperCase()) return false; //black moves a white piece
    if (activeColor === "w" && pieceTo === pieceTo.toUpperCase() && pieceTo !== "") return false; //white takes white //last statement needed
    if (activeColor === "b" && pieceTo === pieceTo.toLowerCase() && pieceTo !== "") return false; //black takes black //last statement needed
    if (pieceFrom === "") return false; //tries to move an empty square
    return true;
}

function whitePawnCase(fen, pieceArray, colFrom, rowFrom, colTo, rowTo) {
    let toPiece = pieceArray[rowTo][colTo];
    if (rowTo === rowFrom - 1 ) {
        if ((colTo === colFrom && toPiece === "") || Math.abs(colFrom - colTo) === 1 && toPiece !== ""){
            movePiece(pieceArray, colFrom, rowFrom, colTo, rowTo);
            return true;
        }
    }
    else if (rowTo === rowFrom - 2 && rowFrom === 6 && pieceArray[5][rowFrom] === ""){
        movePiece(pieceArray, colFrom, rowFrom, colTo, rowTo);
        return true;
    }
    return false;
}

function blackPawnCase(fen, pieceArray, colFrom, rowFrom, colTo, rowTo) {
    let toPiece = pieceArray[rowTo][colTo];
    if (rowTo === rowFrom + 1 ) {
        if ((colTo === colFrom && toPiece === "") || Math.abs(colFrom - colTo) === 1 && toPiece !== ""){
            movePiece(pieceArray, colFrom, rowFrom, colTo, rowTo);
            return true;
        }
    }
    else if (rowTo === rowFrom + 2 && rowFrom === 1 && pieceArray[2][rowFrom] === ""){
        movePiece(pieceArray, colFrom, rowFrom, colTo, rowTo);
        return true;
    }
    return false;
}

function rookCase (fen, pieceArray, colFrom, rowFrom, colTo, rowTo){
    if (colFrom !== colTo && rowFrom !== rowTo) return false;
    let pieceInPath = false;
    if (colFrom !== colTo) {
        for (let i = 1; i < Math.abs(colFrom - colTo) - 1; i++){
            if (colFrom > colTo){
                if (pieceArray[rowFrom][colFrom - i] !== ""){
                    pieceInPath = true;
                    break;
                }
            }
            if (colFrom < colTo){
                if (pieceArray[rowFrom][colFrom + i] !== ""){
                    pieceInPath = true;
                    break;
                }
            }
        }
    }
    else {
        for (let i = 1; i < Math.abs(rowFrom - rowTo) - 1; i++){
            if (colFrom > colTo){
                if (pieceArray[rowFrom - i][colFrom] !== ""){
                    pieceInPath = true;
                    break;
                }
            }
            if (colFrom < colTo){
                if (pieceArray[rowFrom + i][colFrom] !== ""){
                    pieceInPath = true;
                    break;
                }
            }
        }
    }
    if (pieceInPath) return false;
    else {
        movePiece(pieceArray, colFrom, rowFrom, colTo, rowTo);
        return true;
    }
}

function movePiece(pieceArray, colFrom, rowFrom, colTo, rowTo){
    pieceArray[rowTo][colTo] = pieceArray[rowFrom][colFrom];
    pieceArray[rowFrom][colFrom] = "";
}