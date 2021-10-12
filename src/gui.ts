/**
 * this code will be run from within the tic.html page
 * 
 * it has access to the DOM of the web page
 */

import { Game, initializeGame, Player } from "./game";

console.log("starting")

// getting the GUI elements
const uiText = document.getElementById('instructions')!;
const uiBoard = document.getElementById('board')!;
//put all cells into a 2d array so that they are easy to manipulate
let cells: Element[][] = []
for (let x = 0; x <= 2; x++) {
    let col = []
    for (let y = 0; y <= 2; y++)
        col.push(document.getElementById(`cell${y + 1}${x + 1}`)!)
    cells.push(col)
}


//adding callbacks for buttons (observer pattern)
document.getElementById("undobtn")!.addEventListener("click", undoClicked)
document.getElementById("newgamebtn")!.addEventListener("click", startNewGameClicked)
for (let x = 0; x <= 2; x++)
    for (let y = 0; y <= 2; y++) {
        //bind value to new const variable for closure (i.e. it doesn't change from the loop)
        const xx = x
        const yy = y
        cells[x][y].addEventListener("click", () => clickCell(xx, yy))
    }

// game always holds the current version of the game
// updates on actions and when starting a new game
let game: Game = initializeGame()

function startNewGameClicked() {
    // changing the global game variable (in the outer closure)
    console.log("new game")
    game = initializeGame()
    updatePage()
}

function undoClicked() {
    console.log("undo btn clicked")
    game = game.undo()
    updatePage()
}

function clickCell(x: number, y: number): void {
    console.log(`click cell ${x} ${y}`)
    game = game.play(x, y)
    updatePage()
}

function updatePage() {
    console.log("update page")
    //there are smarter ways to do incremental updates, but I'm just going to rerender everything
    if (game.getWinner() !== null) {
        uiText.innerHTML = `Player ${game.getWinner()} has won.`
    } else {
        uiText.innerHTML = `Next turn: Player ${game.getNextPlayer()}.`
    }
    const board = game.board
    for (let x = 0; x <= 2; x++)
        for (let y = 0; y <= 2; y++) {
            let cellText = ""
            const player = board.getCell(x,y)
            if (player === Player.PlayerX) cellText="X"
            if (player === Player.PlayerO) cellText="O"
            cells[x][y].innerHTML=cellText
            if (player === null) 
                cells[x][y].className="cell playable"
            else
                cells[x][y].className="cell notplayable"

    }
}


//when first loading the page initialize
updatePage()