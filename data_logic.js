import { getFen, setFen, } from './main.js';
export function saveGame(myCircularLinkedListArray) {
    let gameData = {
        board: myCircularLinkedListArray
    };
    let existingGames = JSON.parse(localStorage.getItem('chessSaves') || '[]');
    
    existingGames.push(gameData);
    
    localStorage.setItem('chessSaves', JSON.stringify(existingGames));
    console.log('Game saved! Total saves:', existingGames.length);
}

export function loadGames() {
    let saved = localStorage.getItem('chessSaves');
    if (saved) {
        let allGames = JSON.parse(saved);
        console.log('Found', allGames.length, 'saved games:');
        // allGames.forEach((game) => {
        //     console.log(game);
        // });
        //return just the array without json
        return allGames;
    }
    return [];
}