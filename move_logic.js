import { resetHalfmoveClock, addEnPassant, resetEnPassantFen, isSquareEnPassant, canCastle } from './fen_conversion.js';
import { getFen, setFen, } from './main.js';

export async function executeMoveOnArray(pieceArray, colFrom, rowFrom, colTo, rowTo) {
    if (!isValid(pieceArray, colFrom, rowFrom, colTo, rowTo)) {
        return false;
    }
    switch (pieceArray[rowFrom][colFrom]){
        case "P":
            if (!whiteWillPromote(pieceArray, colFrom, rowFrom, colTo, rowTo)) {
                if (!whitePawnCase(pieceArray, colFrom, rowFrom, colTo, rowTo)) return false;
            }
            else await doPromotion(pieceArray, colFrom, rowFrom, colTo, rowTo);
            return true;
        case "p":
           if (!blackWillPromote(pieceArray, colFrom, rowFrom, colTo, rowTo)) {
                if (!blackPawnCase(pieceArray, colFrom, rowFrom, colTo, rowTo)) return false;
            }
            else await doPromotion(pieceArray, colFrom, rowFrom, colTo, rowTo);
            return true;
        case "r":
        case "R":
            if (!rookCase(pieceArray, colFrom, rowFrom, colTo, rowTo)) return false;
            return true;
        case "b":
        case "B":
            if (!bishopCase(pieceArray, colFrom, rowFrom, colTo, rowTo)) return false;
            return true;
        case "n":
        case "N":
            if (!knightCase(pieceArray, colFrom, rowFrom, colTo, rowTo)) return false;
            return true;
        case "k":
        case "K":
            if (!kingCase(pieceArray, colFrom, rowFrom, colTo, rowTo)) return false;
            return true;
        case "q":
        case "Q":
            if (!queenCase(pieceArray, colFrom, rowFrom, colTo, rowTo)) return false;
            return true;
        default:
            console.log("Unknown piece type");
            return true;
    }
}

function isValid(pieceArray, colFrom, rowFrom, colTo, rowTo) {
    let fenParts = getFen().split(" ");
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

function whitePawnCase(pieceArray, colFrom, rowFrom, colTo, rowTo) {
    let toPiece = pieceArray[rowTo][colTo];
    if (rowTo === rowFrom - 1 ) {
        if ((colTo === colFrom && toPiece === "") || Math.abs(colFrom - colTo) === 1 && toPiece !== ""){
            movePiece(pieceArray, colFrom, rowFrom, colTo, rowTo);
            return true;
        }
        else if (Math.abs(colFrom - colTo) === 1 && isSquareEnPassant(colTo, rowTo)){
            movePiece(pieceArray, colFrom, rowFrom, colTo, rowTo);
            pieceArray[rowTo + 1][colTo] = "";
            return true;
        }
    }
    else if (rowTo === rowFrom - 2 && rowFrom === 6 && pieceArray[5][rowFrom] === ""){
        movePiece(pieceArray, colFrom, rowFrom, colTo, rowTo);
        addEnPassant(colTo, rowTo);
        return true;
    }
    return false;
}

function blackPawnCase(pieceArray, colFrom, rowFrom, colTo, rowTo) {
    let toPiece = pieceArray[rowTo][colTo];
    if (rowTo === rowFrom + 1 ) {
        if ((colTo === colFrom && toPiece === "") || Math.abs(colFrom - colTo) === 1 && toPiece !== ""){
            movePiece(pieceArray, colFrom, rowFrom, colTo, rowTo);
            return true;
        }
        else if (Math.abs(colFrom - colTo) === 1 && isSquareEnPassant(colTo, rowTo)){
            movePiece(pieceArray, colFrom, rowFrom, colTo, rowTo);
            pieceArray[rowTo - 1][colTo] = "";

            return true;
        }
    }
    else if (rowTo === rowFrom + 2 && rowFrom === 1 && pieceArray[2][rowFrom] === ""){
        movePiece(pieceArray, colFrom, rowFrom, colTo, rowTo);
        addEnPassant(colTo, rowTo);
        return true;
    }
    return false;
}

function doPromotion(pieceArray, colFrom, rowFrom, colTo, rowTo) {
    return new Promise(function(resolve){
        document.getElementById("promotionInput").style.display = "block";
        document.getElementById("promotionButton").style.display = "block";
        document.getElementById("promotionButton").addEventListener('click', handlePromotion);
        function handlePromotion() {
            console.log ("promotion");
            let promotionPiece = document.getElementById("promotionInput").value.toLowerCase();

            if (promotionPiece.toLowerCase() === "k") promotionPiece = "n";
            if (promotionPiece !== "n" && promotionPiece !== "q" && promotionPiece !== "b" && promotionPiece !== "r") {
                document.getElementById("invalidMoveMessage").style.display = "block";
                return;
            }
            
            document.getElementById("promotionInput").style.display = "none";
            document.getElementById("promotionButton").style.display = "none";
            document.getElementById("promotionButton").removeEventListener('click', handlePromotion);
            if (getFen().split(" ")[1] === "w") {
                pieceArray[rowTo][colTo] = promotionPiece.toUpperCase();
            } else {
                pieceArray[rowTo][colTo] = promotionPiece.toLowerCase();
            }
            
            pieceArray[rowFrom][colFrom] = "";
            document.getElementById("promotionInput").value = "";
            resolve(true);
        }
    });
}

function rookCase (pieceArray, colFrom, rowFrom, colTo, rowTo){
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
function bishopCase(pieceArray, colFrom, rowFrom, colTo, rowTo){
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

function knightCase(pieceArray, colFrom, rowFrom, colTo, rowTo){
    if (Math.abs(colFrom - colTo) + Math.abs(rowFrom - rowTo) !== 3) {
        console.log("triggered knight error");
        return false;
    }
    movePiece(pieceArray, colFrom, rowFrom, colTo, rowTo);
    return true;
}

function kingCase(pieceArray, colFrom, rowFrom, colTo, rowTo){
    if (Math.abs(colFrom - colTo) > 1 || Math.abs(rowFrom - rowTo) > 1) {
        if ((colTo + "" + rowTo === '17' || colTo + "" + rowTo ===  '67' || colTo + "" + rowTo ===  '10' || colTo + "" + rowTo ===  '60') && canCastle(pieceArray, colFrom, rowFrom, colTo, rowTo)){
            console.log("castle time");
            castleMove(pieceArray, colFrom, rowFrom, colTo, rowTo);
            return true;
        }
        console.log("triggered king error");
        return false;
    }
    movePiece(pieceArray, colFrom, rowFrom, colTo, rowTo);
    return true;
}

function queenCase(pieceArray, colFrom, rowFrom, colTo, rowTo){
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
            if (colFrom > colTo && rowFrom > rowTo && pieceArray[rowFrom - i][colFrom - i] !== "") return false;
            if (colFrom < colTo && rowFrom > rowTo && pieceArray[rowFrom - i][colFrom + i] !== "") return false;
            if (colFrom > colTo && rowFrom < rowTo && pieceArray[rowFrom + i][colFrom - i] !== "") return false;
            if (colFrom < colTo && rowFrom < rowTo && pieceArray[rowFrom + i][colFrom + i] !== "") return false;
        }
    }
    movePiece(pieceArray, colFrom, rowFrom, colTo, rowTo);
    return true;
}

function movePiece(pieceArray, colFrom, rowFrom, colTo, rowTo){
    if (pieceArray[rowTo][colTo] !== "" || pieceArray[rowFrom][colFrom].toLowerCase() === "p") resetHalfmoveClock();
    resetEnPassantFen();
    pieceArray[rowTo][colTo] = pieceArray[rowFrom][colFrom];
    pieceArray[rowFrom][colFrom] = "";
}

function castleMove(pieceArray, colFrom, rowFrom, colTo, rowTo){
    resetEnPassantFen();
    pieceArray[rowTo][colTo] = pieceArray[rowFrom][colFrom];
    pieceArray[rowFrom][colFrom] = "";
    let key = colTo + "" + rowTo;
    switch(key){
        case "17":
            pieceArray[7][2] = "R";
            pieceArray[7][0] = "";
            break;
        case "67":
            pieceArray[7][5] = "R";
            pieceArray[7][7] = "";
            break;
        case "10":
            pieceArray[0][2] = "r";
            pieceArray[0][0] = "";
            break;
        case "60":
            pieceArray[0][5] = "r";
            pieceArray[0][7] = "";
            break;
        default:
            console.log("blogai");
    }
}

