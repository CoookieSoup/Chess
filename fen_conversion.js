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
    if (fenParts[1] == 'w') fenParts[1] = 'b';
    else {
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
    setFen(fenParts[0] + " " + fenParts[1] + " " + fenParts[2] + " " + fenParts[3] + " " + fenParts[4] + " " + fenParts[5]);
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
    console.log(colTo === colEnPessant && rowTo === rowEnPessant);
    return (colTo === colEnPessant && rowTo === rowEnPessant);
}