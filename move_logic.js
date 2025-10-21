import { convert_fen_to_array, convert_array_to_fen, increase_halfmove_clock, reset_halfmove_clock, increase_fullmove_number } from './fen_conversion.js';
//import { fen } from './main.js';
// fen = "a";
export async function executeMoveOnArray(fen, pieceArray, colFrom, rowFrom, colTo, rowTo) {
    //addEnPassant(2,3);
    if (!isValid(fen, pieceArray, colFrom, rowFrom, colTo, rowTo)) {
        return false;
    }
    switch (pieceArray[rowFrom][colFrom]){
        case "P":
            if (!whiteWillPromote(pieceArray, colFrom, rowFrom, colTo, rowTo)) {
                if (!whitePawnCase(fen, pieceArray, colFrom, rowFrom, colTo, rowTo)) return false;
            }
            else await doPromotion(fen, pieceArray, colFrom, rowFrom, colTo, rowTo);
            return true;
        case "p":
           if (!blackWillPromote(pieceArray, colFrom, rowFrom, colTo, rowTo)) {
                if (!blackPawnCase(fen, pieceArray, colFrom, rowFrom, colTo, rowTo)) return false;
            }
            else await doPromotion(fen, pieceArray, colFrom, rowFrom, colTo, rowTo);
            return true;
        case "r":
        case "R":
            if (!rookCase(fen, pieceArray, colFrom, rowFrom, colTo, rowTo)) return false;
            return true;
        case "b":
        case "B":
            if (!bishopCase(fen, pieceArray, colFrom, rowFrom, colTo, rowTo)) return false;
            return true;
        case "n":
        case "N":
            if (!knightCase(fen, pieceArray, colFrom, rowFrom, colTo, rowTo)) return false;
            return true;
        case "k":
        case "K":
            if (!kingCase(fen, pieceArray, colFrom, rowFrom, colTo, rowTo)) return false;
            return true;
        case "q":
        case "Q":
            if (!queenCase(fen, pieceArray, colFrom, rowFrom, colTo, rowTo)) return false;
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
    if (activeColor === "w" && pieceFrom === pieceFrom.toLowerCase()) return false;
    if (activeColor === "b" && pieceFrom === pieceFrom.toUpperCase()) return false;
    if (activeColor === "w" && pieceTo === pieceTo.toUpperCase() && pieceTo !== "") return false;
    if (activeColor === "b" && pieceTo === pieceTo.toLowerCase() && pieceTo !== "") return false;
    if (pieceFrom === "") return false;
    return true;
}

function whiteWillPromote(pieceArray, colFrom, rowFrom, colTo, rowTo){
    return (0 === rowFrom - 1 && ((colTo === colFrom && pieceArray[rowTo][colTo] === "") || Math.abs(colFrom - colTo) === 1 && pieceArray[rowTo][colTo] !== ""));
}

function blackWillPromote(pieceArray, colFrom, rowFrom, colTo, rowTo){
    return (7 === rowFrom + 1 && ((colTo === colFrom && pieceArray[rowTo][colTo] === "") || Math.abs(colFrom - colTo) === 1 && pieceArray[rowTo][colTo] !== ""));
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

function doPromotion(fen, pieceArray, colFrom, rowFrom, colTo, rowTo) {
    return new Promise(function(resolve){
        document.getElementById("promotionInput").style.display = "block";
        document.getElementById("promotionButton").style.display = "block";
        document.getElementById("promotionButton").addEventListener('click', handlePromotion);
        function handlePromotion() {
            let promotionPiece = document.getElementById("promotionInput").value;
            movePiece(pieceArray, colFrom, rowFrom, colTo, rowTo);
            
            document.getElementById("promotionInput").style.display = "none";
            document.getElementById("promotionButton").style.display = "none";
            document.getElementById("promotionButton").removeEventListener('click', handlePromotion);

            if (promotionPiece === "k" || promotionPiece === "K") promotionPiece = "n";
            if (fen.split(" ")[1] === "w") pieceArray[rowTo][colTo] = promotionPiece.toUpperCase();
            else pieceArray[rowTo][colTo] = promotionPiece.toLowerCase();
            resolve(true);
        }
    });
}

function rookCase (fen, pieceArray, colFrom, rowFrom, colTo, rowTo){
    if (colFrom !== colTo && rowFrom !== rowTo) return false;
    for (let i = 1; i < Math.abs(colFrom - colTo) + Math.abs(rowFrom - rowTo); i++){
        if (colFrom > colTo && pieceArray[rowFrom][colFrom - i] !== "") return false;
        if (colFrom < colTo && pieceArray[rowFrom][colFrom + i] !== "") return false;
        if (rowFrom > rowTo && pieceArray[rowFrom - i][colFrom] !== "") return false;
        if (rowFrom < rowTo && pieceArray[rowFrom + i][colFrom] !== "") return false;
    }
    movePiece(pieceArray, colFrom, rowFrom, colTo, rowTo);
    return true;
}
function bishopCase(fen, pieceArray, colFrom, rowFrom, colTo, rowTo){
    if (Math.abs(colFrom - colTo) !== Math.abs(rowFrom - rowTo)) {
        console.log("triggered bishop error");
        return false;
    }
    for (let i = 1; i < Math.abs(colFrom - colTo); i++){
        if (colFrom > colTo && rowFrom > rowTo && pieceArray[rowFrom - i][colFrom - i] !== "") return false;//left up
        if (colFrom < colTo && rowFrom > rowTo && pieceArray[rowFrom - i][colFrom + i] !== "") return false;//right up
        if (colFrom > colTo && rowFrom < rowTo && pieceArray[rowFrom + i][colFrom - i] !== "") return false;//left down
        if (colFrom < colTo && rowFrom < rowTo && pieceArray[rowFrom + i][colFrom + i] !== "") return false;//right down
    }
    movePiece(pieceArray, colFrom, rowFrom, colTo, rowTo);
    return true;
}

function knightCase(fen, pieceArray, colFrom, rowFrom, colTo, rowTo){
    if (Math.abs(colFrom - colTo) + Math.abs(rowFrom - rowTo) !== 3) {
        console.log("triggered knight error");
        return false;
    }
    movePiece(pieceArray, colFrom, rowFrom, colTo, rowTo);
    return true;
}

function kingCase(fen, pieceArray, colFrom, rowFrom, colTo, rowTo){
    if (Math.abs(colFrom - colTo) > 1 || Math.abs(rowFrom - rowTo) > 1) {
        console.log("triggered king error");
        return false;
    }
    movePiece(pieceArray, colFrom, rowFrom, colTo, rowTo);
    return true;
}

function queenCase(fen, pieceArray, colFrom, rowFrom, colTo, rowTo){
    if (colFrom !== colTo && rowFrom !== rowTo && Math.abs(colFrom - colTo) !== Math.abs(rowFrom - rowTo)) {
        console.log("triggered queen error");
        return false;
    }
    if ((rowFrom === rowTo && colFrom !== colTo) || (rowFrom !== rowTo && colFrom === colTo)) {
        for (let i = 1; i < Math.abs(colFrom - colTo) + Math.abs(rowFrom - rowTo); i++){
            if (colFrom > colTo && pieceArray[rowFrom][colFrom - i] !== "") return false;
            if (colFrom < colTo && pieceArray[rowFrom][colFrom + i] !== "") return false;
            if (rowFrom > rowTo && pieceArray[rowFrom - i][colFrom] !== "") return false;
            if (rowFrom < rowTo && pieceArray[rowFrom + i][colFrom] !== "") return false;
        }
    }
    else if (Math.abs(colFrom - colTo) === Math.abs(rowFrom - rowTo)) { 
        for (let i = 1; i < Math.abs(colFrom - colTo); i++){
            if (colFrom > colTo && rowFrom > rowTo && pieceArray[rowFrom - i][colFrom - i] !== "") return false;//left up
            if (colFrom < colTo && rowFrom > rowTo && pieceArray[rowFrom - i][colFrom + i] !== "") return false;//right up
            if (colFrom > colTo && rowFrom < rowTo && pieceArray[rowFrom + i][colFrom - i] !== "") return false;//left down
            if (colFrom < colTo && rowFrom < rowTo && pieceArray[rowFrom + i][colFrom + i] !== "") return false;//right down
        }
    }
    movePiece(pieceArray, colFrom, rowFrom, colTo, rowTo);
    return true;
}

function movePiece(pieceArray, colFrom, rowFrom, colTo, rowTo){
    pieceArray[rowTo][colTo] = pieceArray[rowFrom][colFrom];
    pieceArray[rowFrom][colFrom] = "";
}

