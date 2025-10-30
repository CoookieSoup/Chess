function sendStockfishApiRequest(fen) {
    const url = 'https://stockfish.online/api/s/v2.php' + '?fen=' + fen + '&depth=6';
    return fetch(url, {
        method: 'GET',
    })
    .then(response => response.json())
    .catch(error => {
        console.error('Error:', error);
    });
}

export function updateEvalBar (fen) {
    document.getElementById("evaluation").textContent = "Evaluation loading...";
    sendStockfishApiRequest(fen).then(response => {
    if (response && response.success) {
        // console.log("Evaluation:", response.evaluation);
        // console.log("Best move:", response.bestmove);
        // console.log("Continuation:", response.continuation);
        if (response.mate) {
            document.getElementById("evaluation").textContent = "Mate in " + response.mate + " moves";
        } else {
            document.getElementById("evaluation").innerHTML = response.evaluation + '<br>' + "Best move: " + response.bestmove;
        }
    }
    });
}
