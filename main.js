import { Stack } from './stack.js';
import { convert_fen_to_array, convert_array_to_fen, increase_halfmove_clock, reset_halfmove_clock, increase_fullmove_number } from './fen_conversion.js';
import { executeMoveOnArray, isValidMove } from './move_logic.js';
import { sendStockfishApiRequest } from './send_stockfish_api_request.js';
import { circularLinkedList, Node } from './circular_linked_list.js';


let fen = "rnbqkbnp/pppppppp/8/8/8/8/PPPPPPPP/RNBQKBNR w KQkq - 0 1";
let backStack = new Stack();
let forwardStack = new Stack();
let isAnalyzing = false;
let myCircularLinkedList = new circularLinkedList();
let myCLLIndex = 0;

function drawBoard(fen) {
    console.log(fen);
    let pieceArray = convert_fen_to_array(fen);
    let canvas = document.getElementById("board");
    let canvas_context = canvas.getContext("2d");
    let square_Size = 100;

    for (let row = 0; row < 8; row++) {
        for (let col = 0; col < 8; col++) {
            canvas_context.fillStyle = (row + col) % 2 === 0 ? "rgba(237, 214, 176, 1)" : "rgba(184, 135, 98, 1)";
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

function saveInput() {
    let inputValue = document.getElementById("userInput").value;
    let userText = inputValue;
    let moveFrom = userText.substring(0, 2);
    let moveTo = userText.substring(3, 5);
    parseMove(moveFrom, moveTo);
}

function parseMove(moveFrom, moveTo) {
    document.getElementById("prevButton").style.display = "inline";
    
    let pieceArray = convert_fen_to_array(fen);
    let colFrom = moveFrom.charCodeAt(0) - 97;
    let rowFrom = 8 - parseInt(moveFrom.charAt(1));
    let colTo = moveTo.charCodeAt(0) - 97;
    let rowTo = 8 - parseInt(moveTo.charAt(1));

    if (!isValidMove(fen, pieceArray, colFrom, rowFrom, colTo, rowTo)) {
        document.getElementById("invalidMoveMessage").style.display = "block";
        return;
    }
    document.getElementById("invalidMoveMessage").style.display = "none";
    executeMoveOnArray(fen, pieceArray, colFrom, rowFrom, colTo, rowTo);
    backStack.push(fen);
    fen = convert_array_to_fen(pieceArray, fen);
    drawBoard(fen);
}

    // sendStockfishApiRequest(fen).then(response => {
    //     if (response && response.bestMove) {
    //         console.log("Best move from Stockfish API:", response.bestMove);
    //     }
    // });
function undoMove() {
    if (isAnalyzing){
        myCLLIndex--;
        document.getElementById("nextButton").style.display = "inline";
        fen = myCircularLinkedList.getElementAt(myCLLIndex).element;
        if (myCLLIndex === 0) {
            document.getElementById("prevButton").style.display = "none";
        }
        else document.getElementById("prevButton").style.display = "inline";
    }
    else {
        document.getElementById("submitButton").style.display = "none";
        document.getElementById("nextButton").style.display = "inline";
        forwardStack.push(fen);
        if (backStack.size() === 1) document.getElementById("prevButton").style.display = "none";
        else document.getElementById("prevButton").style.display = "inline";
        fen = backStack.pop();
    }
    
    drawBoard(fen);
}

function redoMove() {
    if (isAnalyzing){
        myCLLIndex++;
        document.getElementById("prevButton").style.display = "inline";
        fen = myCircularLinkedList.getElementAt(myCLLIndex).element;
        if (myCLLIndex === myCircularLinkedList.size() - 1) {
            document.getElementById("nextButton").style.display = "none";
        }
        else document.getElementById("nextButton").style.display = "inline";
    }
    else {
        document.getElementById("prevButton").style.display = "inline";
        backStack.push(fen);
        if (forwardStack.size() === 1) {
            document.getElementById("nextButton").style.display = "none";
            document.getElementById("submitButton").style.display = "inline";
        }
        else document.getElementById("nextButton").style.display = "inline";
        fen = forwardStack.pop();
    }
    drawBoard(fen);
}

function analyzeGame() {
    console.log("backstack");
    backStack.print();
    isAnalyzing = true;
    document.getElementById("analyzeButton").style.display = "none";
    document.getElementById("prevButton").style.display = "none";
    document.getElementById("nextButton").style.display = "inline";
    myCircularLinkedList.insert(fen,0);
    myCircularLinkedList.insert(fen,0); //mano pavyzdys turi bugu tai tenka taip
    while (!backStack.isEmpty()){
        myCircularLinkedList.insert(backStack.pop(),0);
    }
    console.log("my list" + myCircularLinkedList.toArray());
    fen = myCircularLinkedList.getElementAt(0).element;
    drawBoard(fen);
}

let list = new circularLinkedList();
list.insert(1,0);
list.insert(1,0);
list.insert(2,0);
list.insert(3,0);
console.log(list.toArray());

drawBoard(fen);
 
document.getElementById("invalidMoveMessage").style.display = "none";
document.getElementById("submitButton").addEventListener("click", saveInput);
document.getElementById("prevButton").addEventListener("click", undoMove);
document.getElementById("nextButton").addEventListener("click", redoMove);
document.getElementById("analyzeButton").addEventListener("click", analyzeGame);