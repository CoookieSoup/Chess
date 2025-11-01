import { resetHalfmoveClock, addEnPassant, resetEnPassantFen, isSquareEnPassant, canCastle, removeFenCastle } from './fen_conversion.js';
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
    else if (rowTo === rowFrom - 2 && rowFrom === 6 && pieceArray[5][colFrom] === ""){
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
    else if (rowTo === rowFrom + 2 && rowFrom === 1 && pieceArray[2][colFrom] === ""){
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
    if ((rowFrom === 0 && colFrom === 7) || (rowFrom === 0 && colFrom === 0) || (rowFrom === 7 && colFrom === 7) || (rowFrom === 7 && colFrom === 0)){
        removeFenCastle(pieceArray, colFrom, rowFrom, 1);
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
    removeFenCastle(pieceArray, colFrom, rowFrom, 2);
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

export function analyzeBoard(pieceArray, needReverse) {
    let fen = getFen();
    let toMove = fen.split(' ')[1];
    let opponent;
    if (toMove === "w") opponent = "b";
    else opponent = "w";
    if (needReverse){
        let temp = toMove;
        toMove = opponent;
        opponent = temp;
    }
    let attackedSquares = Array(8).fill().map(() => Array(8).fill(''));
    
    let directions = {
        'p': toMove === 'w' ? [[1, -1], [1, 1]] : [[-1, -1], [-1, 1]],
        'n': [[2, 1], [2, -1], [-2, 1], [-2, -1], [1, 2], [1, -2], [-1, 2], [-1, -2]],
        'b': [[1, 1], [1, -1], [-1, 1], [-1, -1]],
        'r': [[1, 0], [-1, 0], [0, 1], [0, -1]],
        'q': [[1, 0], [-1, 0], [0, 1], [0, -1], [1, 1], [1, -1], [-1, 1], [-1, -1]],
        'k': [[1, 0], [-1, 0], [0, 1], [0, -1], [1, 1], [1, -1], [-1, 1], [-1, -1]]
    };
    
    
    
    let howManyPiecesSeeKing = 0;

    for (let row = 0; row < 8; row++) {
        for (let col = 0; col < 8; col++) {
            let piece = pieceArray[row][col];
            if (piece === "") continue;
            
            let pieceColor;
            if (piece === piece.toLowerCase()) pieceColor = "b";
            else pieceColor = "w";

            if (pieceColor !== opponent) continue;

            let pieceType = piece.toLowerCase();
            let pieceDirs = directions[pieceType];
            let temp = false;
            for (let [directionRow, directionCol] of pieceDirs) {
                let newRow = row + directionRow;
                let newCol = col + directionCol;
                if (pieceType === "n" && isInBounds(newRow, newCol) && attackedSquares[newRow][newCol] !== "A") attackedSquares[newRow][newCol] = "x";
                else if (pieceType === "p" && isInBounds(newRow, newCol) && attackedSquares[newRow][newCol] !== "A") {
                    if (!(needReverse && pieceArray[newRow][newCol] === "")) attackedSquares[newRow][newCol] = "x";
                }
                else if (pieceType === "k" && isInBounds(newRow, newCol) && attackedSquares[newRow][newCol] !== "A") {
                    if (!needReverse) attackedSquares[newRow][newCol] = "x";
                }
                else { 
                    while (isInBounds(newRow, newCol)) {
                        if (attackedSquares[newRow][newCol] !== "A") attackedSquares[newRow][newCol] = "x";
                        if (pieceArray[newRow][newCol] === "k" && pieceColor === "w") howManyPiecesSeeKing++;
                        if (pieceArray[newRow][newCol] === "K" && pieceColor === "b") howManyPiecesSeeKing++;
                        if (howManyPiecesSeeKing > 0 && (pieceArray[newRow][newCol] === "K" || pieceArray[newRow][newCol] === "k" )) {
                            newRow -= directionRow;
                            newCol -= directionCol;
                            while (isInBounds(newRow, newCol)) {
                                if (pieceArray[newRow][newCol] !== "") {
                                    attackedSquares[newRow][newCol] = "A";
                                    break;
                                }
                                attackedSquares[newRow][newCol] = "A";
                                newRow -= directionRow;
                                newCol -= directionCol;
                            }
                        }
                        if (pieceArray[newRow][newCol] !== "") break;
                        newRow += directionRow;
                        newCol += directionCol;
                    }
                }
                if (isInBounds(newRow, newCol) && !temp && attackedSquares[5][6] === 'x' && needReverse) {
                    console.log(newRow, newCol, pieceType);
                     temp = true;
                }
            }   
        }
    }
    if (howManyPiecesSeeKing > 0 ) console.log("this many pieces see king", howManyPiecesSeeKing);
    return {attackedSquares, howManyPiecesSeeKing};
}

function isInBounds(row, col) {
        return (row >= 0 && row < 8 && col >= 0 && col < 8);
}

export function canKingEscapeByMoving(attackedSquares, pieceArray){
    let squareColor = getFen().split(" ")[1];
    let kingRow = -1;
    let kingCol;
    for (let row = 0; row < 8; row++) {
        for (let col = 0; col < 8; col++) {
            if (pieceArray[row][col] === "k" && squareColor === "b"){
                kingRow = row;
                kingCol = col;
                break;
            }
            if (pieceArray[row][col] === "K" && squareColor === "w"){
                kingRow = row;
                kingCol = col;
                break;
            }
        }
        if (kingRow !== -1) break;
    }
    let kingMoveDirections = [[-1,-1], [-1,0], [-1,1],
                         [0,-1],          [0,1], 
                         [1,-1], [1,0], [1,1]];
    for (let [directionRow, directionCol] of kingMoveDirections){
        let newRow = kingRow + directionRow;
        let newCol = kingCol + directionCol;
        if (squareColor === "w")
            if (isInBounds(newRow,newCol) && attackedSquares[newRow][newCol] !== "x" && attackedSquares[newRow][newCol] !== "A")
                if (pieceArray[newRow][newCol] === "" || pieceArray[newRow][newCol].toUpperCase() !== pieceArray[newRow][newCol]) return true;
        if (squareColor === "b")
            if (isInBounds(newRow,newCol) && attackedSquares[newRow][newCol] !== "x" && attackedSquares[newRow][newCol] !== "A")
                if (pieceArray[newRow][newCol] === "" || pieceArray[newRow][newCol].toLowerCase() !== pieceArray[newRow][newCol]) return true;
    }
    return false;
}