import { getFen, setFen } from './main.js';

export function convertFenToArray(fen) {
    let array = Array.from({ length: 8 }, () => Array(8).fill(""));
    let fenParts = fen.split(" ");
    let board = fenParts[0].split("/");
    for (let row = 0; row < 8; row++) {
        let fenRow = board[row];
        let colIndex = 0;
        for (let col = 0; col < 8; col++) {
            let char = fenRow[colIndex];
            colIndex++;
            if (!isNaN(char)) {
                for (let j = 0; j < parseInt(char); j++) array[row][col + j] = "";
                col += parseInt(char) - 1;
            } else array[row][col] = char;
        }
    }
    return array;
}

export function convertArrayToFen(array, fen) {
    let fenParts = fen.split(" ");
    if (fenParts[1] === 'w') {
        fenParts[1] = 'b';
        document.getElementById("whoMovesMessage").textContent  = "Black's turn";
    }
    else {
        document.getElementById("whoMovesMessage").textContent  = "White's turn";
        fenParts[1] = 'w';
        fenParts[5]++;
    }
    fenParts[4]++;
    let newFen = "";
    for (let row = 0; row < 8; row++) {
        let emptyCount = 0;
        for (let col = 0; col < 8; col++) {
            if (array[row][col] === "") emptyCount++;
            else {
                if (emptyCount > 0) {
                    newFen += emptyCount;
                    emptyCount = 0;
                }
                newFen += array[row][col];
            }
        }
        if (emptyCount > 0) {
            newFen += emptyCount;
            emptyCount = 0;
        }
        if (row < 7) newFen += "/";
    }
    newFen += " " + fenParts[1] + " " + fenParts[2] + " " + fenParts[3] + " " + fenParts[4] + " " + fenParts[5];
    return newFen;
}

export function addEnPassant(colTo, rowTo){
    let fenParts = getFen().split(" ");
    if (fenParts[1] === 'w') fenParts[3] = String.fromCharCode(96 + colTo + 1) + (rowTo - 1);
    else fenParts[3] = String.fromCharCode(96 + colTo + 1) + (rowTo + 3);
    setFen(fenParts.join(" "));
}


export function resetHalfmoveClock() {
    let fenParts = getFen().split(" ");
    fenParts[4] = 0;
    setFen(fenParts.join(" "));
}
// export function isWhiteTurn() {
//     let fenParts = getFen().split(" ");
//     if (fenParts[1] === 'w') return true;
//     return false;
// }
export function resetEnPassantFen(){
    let fenParts = getFen().split(" ");
    fenParts[3] = "-";
    setFen(fenParts.join(" "));
}

export function isSquareEnPassant(colTo, rowTo){
    let square = getFen().split(" ")[3];
    let colEnPessant = square[0].charCodeAt(0) - 97;
    let rowEnPessant = 8 - parseInt(square[1]);
    return (colTo === colEnPessant && rowTo === rowEnPessant);
}

export function canCastle(pieceArray, colFrom, rowFrom, colTo, rowTo){
    let fenParts = getFen().split(" ");
    let fenCastle = fenParts[2];
    let castleMap = {
        '17': 'Q', '67': 'K', '10': 'q', '60': 'k'
    };
    let key = colTo + "" + rowTo;
    let castleChar = castleMap[key];
    if (castleChar && fenCastle.includes(castleChar)) {
        let modifier = 1;
        if (colTo < colFrom)  modifier = -1;    
        for (let i = 1; i !== Math.abs(colTo - colFrom) + 1; i++){
            if (pieceArray[rowFrom][colFrom  + i * modifier] !== "") return false;
        }
        if (castleChar === "K" || castleChar === "Q"){
            fenCastle = fenCastle.replace("K", "");
            fenCastle = fenCastle.replace("Q", "");
        }
        else if (castleChar === "k" || castleChar === "q"){
            fenCastle = fenCastle.replace("k", "");
            fenCastle = fenCastle.replace("q", "");
        }
        if (fenCastle === "") fenCastle = "-";
        fenParts[2] = fenCastle;
        setFen(fenParts.join(" "));
        return true;
    }
    return false;
}

export function removeFenCastle(pieceArray, colFrom, rowFrom, variation){
    let fenParts = getFen().split(" ");
    let fenCastle = fenParts[2];
    if (variation === 2){
        if (pieceArray[rowFrom][colFrom] === "K" && (fenCastle.includes("K") || fenCastle.includes("Q"))){
        fenCastle = fenCastle.replace("K", "");
        fenCastle = fenCastle.replace("Q", "");
        }
        else if (pieceArray[rowFrom][colFrom] === "k" && (fenCastle.includes("k") || fenCastle.includes("q"))){
            fenCastle = fenCastle.replace("k", "");
            fenCastle = fenCastle.replace("q", "");
        }
    }
    else {
        if (rowFrom === 0 && colFrom === 7){
            fenCastle = fenCastle.replace("k", "");
        }
        if (rowFrom === 0 && colFrom === 0){
            fenCastle = fenCastle.replace("q", "");
        }
        if (rowFrom === 7 && colFrom === 0){
            fenCastle = fenCastle.replace("Q", "");
        }
        if (rowFrom === 7 && colFrom === 7){
            fenCastle = fenCastle.replace("K", "");
        }
    }
    fenParts[2] = fenCastle;
    setFen(fenParts.join(" "));
}