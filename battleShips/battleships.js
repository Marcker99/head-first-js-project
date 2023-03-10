
//VIEW

let view = {
    displayMessage(msg) {
        let messageArea = document.getElementById("messageArea")
        messageArea.innerHTML = msg
    },
    displayHit(location) {
        let cell = document.getElementById(location)
        cell.setAttribute("class", "hit")
    },
    displayMiss(location) {
        let cell = document.getElementById(location)
        cell.setAttribute("class", "miss")
    }
}

//MODEL

let model = {
    boardSize: 7,
    numShips: 3,
    shipLength: 3,
    shipsSunk: 0,

    ships: [{ locations: [0, 0, 0], hits: ["", "", ""] },
    { locations: [0, 0, 0], hits: ["", "", ""] },
    { locations: [0, 0, 0], hits: ["", "", ""] }],

    fire(guess) {
        for (let i = 0; i < this.numShips; i++) {
            let ship = this.ships[i];
            let index = ship.locations.indexOf(guess)
            if (index >= 0) {
                ship.hits[index] = 'hit'
                view.displayHit(guess)
                view.displayMessage("HIT")
                if (this.isSunk(ship)) {
                    view.displayMessage("You sank my buttleship")
                    this.shipsSunk++
                }
                return true;
            }
        }
        view.displayMiss(guess);
        view.displayMessage("You missed.");
        return false
    },
    isSunk(ship) {
        for (let i = 0; i < this.shipLength; i++) {
            if (ship.hits[i] !== "hit") {
                return false
            }
        }
        return true
    },
    generateShipLocations() {  //функція яка керує функціями=)
        let locations;
        for (let i = 0; i < this.numShips; i++) {
            do {
                locations = this.generateShip();
            } while (this.collision(locations));
            this.ships[i].locations = locations;
        }
    },
    generateShip() {
        let direction = Math.floor(Math.random() * 2);
        let row, col;
        if (direction === 1) {
            row = Math.floor(Math.random() * this.boardSize);
            col = Math.floor(Math.random() * (this.boardSize - this.shipLength));
        } else {
            row = Math.floor(Math.random() * (this.boardSize - this.shipLength));
            col = Math.floor(Math.random() * this.boardSize)
        }
        let newShipLocations = [];
        for (let i = 0; i < this.shipLength; i++) {
            if (direction === 1) {
                newShipLocations.push(row + "" + (col + i));
            } else {
                newShipLocations.push((row + i) + "" + col);
            }
        }
        return newShipLocations;
    },
    collision: function (locations) {
        for (let i = 0; i < this.numShips; i++) {
            let ship = model.ships[i];
            for (let j = 0; j < locations.length; j++) {
                if (ship.locations.indexOf(locations[j]) >= 0) {
                    return true; //якщо місця співпадають цикл повториться щоб знайти не заняті місця
                }
            }
        }
        return false;
    }
}



//Controller


let controller = {
    guesses: 0,
    processGuess(guess) {
        let location = parseGuess(guess)  //<-запускає функцію 
        if (location) {
            this.guesses++
            let hit = model.fire(location)
            if (hit && model.shipsSunk === model.numShips) {
                view.displayMessage("You sank all my battleships, in " +
                    this.guesses + " guesses");
            }
        }
    }

}


function parseGuess(guess) {
    let alphabet = ["A", "B", "C", "D", "E", "F", "G"]
    if (guess === null || guess.length !== 2) {
        alert("Oops, please enter a letter and a number on the board.");
    } else {
        firstChar = guess.charAt(0)
        let row = alphabet.indexOf(firstChar);
        let column = guess.charAt(1);
        if (isNaN(row) || isNaN(column)) {
            alert("Oops, that isn't on the board.");
        } else if (row < 0 || row >= model.boardSize ||
            column < 0 || column >= model.boardSize) {
            alert("Oops, that's off the board!");
        } else {
            return row + column;
        }
    }
    return null
}


function init() {
    let fireButton = document.getElementById("FireButton");
    fireButton.onclick = handleFireButton;  //url to button яка виконує при нажатті функцію нижче.
    let guessInput = document.getElementById("quessInput");
    guessInput.onkeydown = handleKeyPress;
    model.generateShipLocations() // для запуску рандомного розташування.
}
function handleFireButton() {
    let guessInput = document.getElementById("quessInput")
    let guess = guessInput.value;
    controller.processGuess(guess)
    guessInput.value = "";  //команда для авточистки форми, щоб не видаляти вручну.

}


function handleKeyPress(e) {
    var fireButton = document.getElementById("FireButton");
    if (e.keyCode === 13) {
        fireButton.click();
        return false; //false -для того щоб форма не робила нічого лишнього.
    }
}

window.onload = init;