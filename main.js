import { Stack } from './stack.js';
import { convertArrayToFen, convertFenToArray } from './fen_conversion.js';
import { canKingEscapeByMoving, executeMoveOnArray } from './move_logic.js';
import { updateEvalBar } from './send_stockfish_api_request.js';
import { circularLinkedList } from './circular_linked_list.js';
import { saveGame,loadGames } from './data_logic.js';
import { SinglyLinkedList } from './singly_linked_list.js'
import { analyzeBoard } from './move_logic.js';
let fen = "rnbqkbnr/pppppppp/8/8/8/8/PPPPPPPP/RNBQKBNR w KQkq - 0 1";
let backStack = new Stack();
let forwardStack = new Stack();
let isAnalyzing = false;
let myCircularLinkedList = new circularLinkedList();
let myCLLIndex = 0;
let mySinglyLinkedList = new SinglyLinkedList();

export function getFen() {
    return fen;
}
export function setFen(newValue) {
    fen = newValue;
}

function drawBoard(fen) {
    let pieceArray = convertFenToArray(fen);
    let analyzeBoardObject = analyzeBoard(pieceArray, false);
    let targetedSquareArray = analyzeBoardObject.attackedSquares;
    let howManySeeKing = analyzeBoardObject.howManyPiecesSeeKing;
    if (howManySeeKing > 0){
        if (fen.split(" ")[1] === "w") document.getElementById("checkMessage").textContent  = "White is in check";
        else document.getElementById("checkMessage").textContent  = "Black is in check";

        if (howManySeeKing > 1 && !canKingEscapeByMoving(targetedSquareArray, pieceArray)) {
            if (fen.split(" ")[1] === "w") document.getElementById("checkMessage").textContent  = "Checkmate, black wins";
            else document.getElementById("checkMessage").textContent  = "Checkmate, white wins";
        }
        else {
            if (!canKingEscapeByMoving(targetedSquareArray, pieceArray)){

                let defenseArray = analyzeBoard(pieceArray, true).attackedSquares;
                let canHeDefend = false;
                for (let row = 0; row < 8; row++) {
                    for (let col = 0; col < 8; col++) {
                        if (targetedSquareArray[row][col] === "A" && (defenseArray[row][col] === "A" || defenseArray[row][col] === "x")) canHeDefend = true;
                    }
                }
                if (!canHeDefend){
                    if (fen.split(" ")[1] === "w") document.getElementById("checkMessage").textContent  = "Checkmate, black wins";
                    else document.getElementById("checkMessage").textContent  = "Checkmate, white wins";

                }
            }
        }
    }
    else document.getElementById("checkMessage").textContent  = "";

    // console.log(pieceArray);
    // console.log(fen);
    let canvas = document.getElementById("board");
    let canvas_context = canvas.getContext("2d");
    let square_Size = 100;

    for (let row = 0; row < 8; row++) {
        for (let col = 0; col < 8; col++) {
            canvas_context.fillStyle = (row + col) % 2 === 0 ? "rgba(237, 214, 176, 1)" : "rgba(184, 135, 98, 1)";
            if (targetedSquareArray[row][col] === 'x') canvas_context.fillStyle = "rgba(231, 89, 89, 1)";
            if (targetedSquareArray[row][col] === 'A') canvas_context.fillStyle = "rgba(89, 231, 188, 1)";
            canvas_context.fillRect(col * square_Size, row * square_Size, square_Size, square_Size);
            
            let letter = String.fromCharCode(97 + col);
            let rank = 8 - row;
            let square_id = letter + rank;

            canvas_context.font = 15 + "px Merida Unicode";
            canvas_context.fillStyle = (row + col) % 2 === 0 ? "rgba(184, 135, 98, 1)" : "rgba(237, 214, 176, 1)";
            canvas_context.fillText(square_id, col * square_Size + 5, row * square_Size + square_Size - 5);
            canvas_context.fillStyle = "black";

            let piece = pieceArray[row][col];
            if (piece === "P") piece = "♙";
            else if (piece === "R") piece = "♖";
            else if (piece === "N") piece = "♘";
            else if (piece === "B") piece = "♗";
            else if (piece === "Q") piece = "♕";
            else if (piece === "K") piece = "♔";
            else if (piece === "p") piece = "♟";
            else if (piece === "r") piece = "♜";
            else if (piece === "n") piece = "♞";
            else if (piece === "b") piece = "♝";
            else if (piece === "q") piece = "♛";
            else if (piece === "k") piece = "♚";
            else piece = "";
            canvas_context.font = 80 + "px normal";
            canvas_context.fillText(piece, col * square_Size + square_Size/9, row * square_Size + square_Size - square_Size/5);
        }
    }
    
}

async function parseMove() {
    let userText = document.getElementById("userInput").value;
    let pieceArray = convertFenToArray(fen);
    let colFrom = userText.substring(0, 2).charCodeAt(0) - 97;
    let rowFrom = 8 - parseInt(userText.substring(0, 2).charAt(1));
    let colTo = userText.substring(3, 5).charCodeAt(0) - 97;
    let rowTo = 8 - parseInt(userText.substring(3, 5).charAt(1));
    
    if (!(await executeMoveOnArray(pieceArray, colFrom, rowFrom, colTo, rowTo))) {
        document.getElementById("invalidMoveMessage").style.display = "block";
        return;
    }
    document.getElementById("userInput").value = "";
    document.getElementById("invalidMoveMessage").style.display = "none";
    document.getElementById("prevButton").style.display = "inline";

    backStack.push(fen);
    fen = convertArrayToFen(pieceArray, fen);
    drawBoard(fen);
}

function undoMove() {
    document.getElementById("analyzeButton").style.display = "none";
    if (isAnalyzing){
        myCLLIndex--;
        fen = myCircularLinkedList.getElementAt(myCLLIndex).element;
        updateEvalBar(fen);

        document.getElementById("nextButton").style.display = "inline";
        if (myCLLIndex === 0) document.getElementById("prevButton").style.display = "none";
        else document.getElementById("prevButton").style.display = "inline";
    }
    else {
        forwardStack.push(fen);
        fen = backStack.pop();

        document.getElementById("submitButton").style.display = "none";
        document.getElementById("nextButton").style.display = "inline";
        if (backStack.size() === 0) document.getElementById("prevButton").style.display = "none";
        else document.getElementById("prevButton").style.display = "inline";
    }
    //destytojui kad stekai veikia
    // backStack.print();
    // forwardStack.print();
    drawBoard(fen);
}

function redoMove() {
    if (isAnalyzing){
        myCLLIndex++;
        fen = myCircularLinkedList.getElementAt(myCLLIndex).element;
        updateEvalBar(fen);
        
        document.getElementById("prevButton").style.display = "inline";
        if (myCLLIndex === myCircularLinkedList.size() - 1) {
            document.getElementById("nextButton").style.display = "none";
        }
        else document.getElementById("nextButton").style.display = "inline";
    }
    else {
        backStack.push(fen);
        fen = forwardStack.pop();

        document.getElementById("prevButton").style.display = "inline";
        if (forwardStack.size() === 0) {
            document.getElementById("nextButton").style.display = "none";
            document.getElementById("submitButton").style.display = "inline";
            document.getElementById("analyzeButton").style.display = "inline";
        }
        else document.getElementById("nextButton").style.display = "inline";
    }


    //destytojui kad stekai veikia
    // backStack.print();
    // forwardStack.print();
    drawBoard(fen);
}

function analyzeGame() {
    while (!backStack.isEmpty()) forwardStack.push(backStack.pop());
    isAnalyzing = true;

    document.getElementById("userInput").style.display = "none";
    document.getElementById("submitButton").style.display = "none";
    document.getElementById("analyzeButton").style.display = "none";
    document.getElementById("prevButton").style.display = "none";
    document.getElementById("nextButton").style.display = "inline";
    document.getElementById("historyViewerButton").style.display = "inline";
    document.getElementById("historyViewerInput").style.display = "inline";

    while (!forwardStack.isEmpty()){
        myCircularLinkedList.append(forwardStack.pop());
    }
    myCircularLinkedList.append(fen);
    fen = myCircularLinkedList.getElementAt(0).element;
    updateEvalBar(fen);
    saveGame(myCircularLinkedList.toArray());
    let lastGame = JSON.parse(localStorage.getItem('chessSaves') || '[]').pop();
    mySinglyLinkedList.append(lastGame);
    drawBoard(fen);
}

function viewGame(){
    myCLLIndex = 0;
    let index = document.getElementById("historyViewerInput").value;
    let currentGame = mySinglyLinkedList.get(index);
    
    console.log("index", index);
    currentGame = currentGame.board;
    while (!backStack.isEmpty()){
        backStack.pop();
    }
    while (!forwardStack.isEmpty()){
        forwardStack.pop();
    }
    while (!myCircularLinkedList.isEmpty()){
        myCircularLinkedList.removeAt(0);
    }
    for (let i = 0; i < currentGame.length; i++){
        forwardStack.push(currentGame[i]);
        myCircularLinkedList.append(currentGame[i]);
    }
    console.log("Destytojui matyt, kad doubly linked liste zaidimo ejimai: ", myCircularLinkedList.toArray());
    fen = currentGame[0];
    updateEvalBar(fen);
    isAnalyzing = true;
    document.getElementById("analyzeButton").style.display = "none";
    document.getElementById("prevButton").style.display = "none";
    document.getElementById("nextButton").style.display = "inline";
    document.getElementById("historyViewerButton").style.display = "inline";
    document.getElementById("historyViewerInput").style.display = "inline";
    drawBoard(fen);
}

function load(){
    let allGames = loadGames();
    for (let game of allGames){
        mySinglyLinkedList.append(game);
    }
    console.log("Destytojui rodau, kad duomenys single linked list on launch");
    mySinglyLinkedList.print();
}

function reloadWebsite() {
    location.reload();
}

drawBoard(fen);
 
document.getElementById("submitButton").addEventListener("click", parseMove);
document.getElementById("userInput").addEventListener('keyup', (event) => {
    if (event.key === 'Enter') parseMove();
});
document.getElementById("prevButton").addEventListener("click", undoMove);
document.getElementById("nextButton").addEventListener("click", redoMove);
document.getElementById("analyzeButton").addEventListener("click", analyzeGame);
document.getElementById("historyViewerButton").addEventListener("click", viewGame);
document.getElementById("exitGame").addEventListener("click", reloadWebsite);

window.addEventListener('load', load);