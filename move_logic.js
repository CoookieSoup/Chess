export async function executeMoveOnArray(fen, pieceArray, colFrom, rowFrom, colTo, rowTo) {
    
    if (!isValid(fen, pieceArray, colFrom, rowFrom, colTo, rowTo)) {
        return false;
    }
    switch (pieceArray[rowFrom][colFrom]){
        case "P":
            if (!whiteWillPromote(fen, pieceArray, colFrom, rowFrom, colTo, rowTo)) {
                if (!whitePawnCase(fen, pieceArray, colFrom, rowFrom, colTo, rowTo)) {
                    console.log("bad");
                    return false;
                }
            }
            else {
                await doPromotion(fen, pieceArray, colFrom, rowFrom, colTo, rowTo);
            }
            return true;
        case "p":
            if (!(await blackPawnCase(fen, pieceArray, colFrom, rowFrom, colTo, rowTo))) return false;
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
    if (activeColor === "w" && pieceFrom === pieceFrom.toLowerCase()) return false; //white moves a black piece
    if (activeColor === "b" && pieceFrom === pieceFrom.toUpperCase()) return false; //black moves a white piece
    if (activeColor === "w" && pieceTo === pieceTo.toUpperCase() && pieceTo !== "") return false; //white takes white //last statement needed
    if (activeColor === "b" && pieceTo === pieceTo.toLowerCase() && pieceTo !== "") return false; //black takes black //last statement needed
    if (pieceFrom === "") return false; //tries to move an empty square
    return true;
}

function whiteWillPromote(fen, pieceArray, colFrom, rowFrom, colTo, rowTo){
    let toPiece = pieceArray[rowTo][colTo];
    if (rowTo === rowFrom - 1 ) {
        if ((colTo === colFrom && toPiece === "") || Math.abs(colFrom - colTo) === 1 && toPiece !== ""){
            if (rowTo === 0) {
                console.log(6);
                return true;
            } 
        }
    }
    return false;
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

// function promotionCase(fen, pieceArray, colTo, rowTo, promotionPiece){
//     let fenParts = fen.split(" ");
//     console.log(promotionPiece);
//     let a = promotionPiece;
//     if (fenParts[1] === "w"){
//         pieceArray[rowTo][colTo] = a;
//     }
//     else pieceArray[rowTo][colTo] = a.toLowerCase();
//     console.log(pieceArray[rowTo][colTo]);
    
//     document.getElementById("promotionInput").style.display = "none";
// }

function rookCase (fen, pieceArray, colFrom, rowFrom, colTo, rowTo){
    if (colFrom !== colTo && rowFrom !== rowTo) return false;
    let pieceInPath = false;
    if (colFrom !== colTo) {
        for (let i = 1; i < Math.abs(colFrom - colTo); i++){
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
        for (let i = 1; i < Math.abs(rowFrom - rowTo); i++){
            if (rowFrom > rowTo){
                if (pieceArray[rowFrom - i][colFrom] !== ""){
                    pieceInPath = true;
                    break;
                }
            }
            if (rowFrom < rowTo){
                if (pieceArray[rowFrom + i][colFrom] !== ""){
                    pieceInPath = true;
                    break;
                }
            }
        }
    }
    if (pieceInPath) return false;
    movePiece(pieceArray, colFrom, rowFrom, colTo, rowTo);
    return true;
}
function bishopCase(fen, pieceArray, colFrom, rowFrom, colTo, rowTo){
    if (Math.abs(colFrom - colTo) !== Math.abs(rowFrom - rowTo)) {
        console.log("triggered bishop error");
        return false;
    }
    let pieceInPath = false;
    if (rowFrom > rowTo) { //up
        for (let i = 1; i < Math.abs(colFrom - colTo) - 1; i++){
            if (colFrom > colTo){ //left
                if (pieceArray[rowFrom - i][colFrom - i] !== ""){
                    pieceInPath = true;
                    break;
                }
            }
            else { //right
                if (pieceArray[rowFrom - i][colFrom + i] !== ""){
                    pieceInPath = true;
                    break;
                }
            }
        }
    }
    else { //down
        for (let i = 1; i < Math.abs(colFrom - colTo) - 1; i++){
            if (colFrom > colTo){ //left
                if (pieceArray[rowFrom + i][colFrom - i] !== ""){
                    pieceInPath = true;
                    break;
                }
            }
            else { //right
                if (pieceArray[rowFrom + i][colFrom + i] !== ""){
                    pieceInPath = true;
                    break;
                }
            }
        }
    }
    if (pieceInPath) return false;
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
    let pieceInPath = false;
    if (rowFrom == rowTo) {
        for (let i = 1; i < Math.abs(colFrom - colTo); i++){
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
    else if (colFrom === colTo)  {
        for (let i = 1; i < Math.abs(rowFrom - rowTo); i++){
            if (rowFrom > rowTo){
                if (pieceArray[rowFrom - i][colFrom] !== ""){
                    pieceInPath = true;
                    break;
                }
            }
            if (rowFrom < rowTo){
                if (pieceArray[rowFrom + i][colFrom] !== ""){
                    pieceInPath = true;
                    break;
                }
            }
        }
    }
    else if (rowFrom > rowTo) { //up
        for (let i = 1; i < Math.abs(colFrom - colTo) - 1; i++){
            if (colFrom > colTo){ //left
                if (pieceArray[rowFrom - i][colFrom - i] !== ""){
                    pieceInPath = true;
                    break;
                }
            }
            else { //right
                if (pieceArray[rowFrom - i][colFrom + i] !== ""){
                    pieceInPath = true;
                    break;
                }
            }
        }
    }
    else { //down
        console.log("down");
        for (let i = 1; i < Math.abs(colFrom - colTo) - 1; i++){
            if (colFrom > colTo){ //left
                if (pieceArray[rowFrom + i][colFrom - i] !== ""){
                    pieceInPath = true;
                    break;
                }
            }
            else { //right
                if (pieceArray[rowFrom + i][colFrom + i] !== ""){
                    pieceInPath = true;
                    break;
                }
            }
        }
    }
    if (pieceInPath) return false;
    movePiece(pieceArray, colFrom, rowFrom, colTo, rowTo);
    return true;
}

function movePiece(pieceArray, colFrom, rowFrom, colTo, rowTo){
    pieceArray[rowTo][colTo] = pieceArray[rowFrom][colFrom];
    pieceArray[rowFrom][colFrom] = "";
}

