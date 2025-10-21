export function convert_fen_to_array(fen) {
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

export function convert_array_to_fen(array, fen) {
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

// export function addEnPassant(fen, col, row){
//     let fenParts = fen.split(" ");
//     fenParts[3] = String.fromCharCode(64 + col) + row;
//     console.log("en pessant square:" + fenParts[3]);
// }


export function increase_halfmove_clock(fen) {
    let fenParts = fen.split(" ");
    fenParts[4]++;
    return fenParts.join(" ");
}
export function reset_halfmove_clock(fen) {
    let fenParts = fen.split(" ");
    fenParts[4] = 0;
    return fenParts.join(" ");
}
export function increase_fullmove_number(fen) {
    let fenParts = fen.split(" ");
    if (fenParts[1] === 'b') fenParts[5]++;
    return fenParts.join(" ");
}