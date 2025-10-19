export function sendStockfishApiRequest(fen) {
    const url = 'https://stockfish.online/api/s/v2.php' + '?fen=' + fen + '&depth=12';
    return fetch(url, {
        method: 'GET',
    })
    .then(response => response.json())
    .catch(error => {
        console.error('Error:', error);
    });
}