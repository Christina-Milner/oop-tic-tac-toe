class Player {
        constructor(name, type, symbol) {
            this.name = name
            this.type = type
            this.symbol = symbol
        }
}


class Game {
    constructor(gameType) {
        const once = {once: true}
        this.gameType = gameType
        this.boxes = document.querySelectorAll('div div')
        this.boxes.forEach(e => {
            e.addEventListener('click', () => this.playMove(event), once)
            e.innerText = ""
        })
        this.boxValues = Array.from(this.boxes).map(e => e.innerText)
        this.getPlayers(this.gameType)
        this.activePlayer = this.player1
    }
    getPlayers(gameType) {
        if (gameType == 'vsAI') {
            const playerName = prompt('Please enter your name.')
            document.querySelector('h2').innerText = 'Tossing a coin...'
            let toss = Math.random()
            if (toss < 0.5) {
                document.querySelector('h2').innerText = 'Computer goes first!'
                this.player1 = new Player("Computer", "AI", "X")
                this.player2 = new Player (playerName, "human", "O")
            }
            else {
                document.querySelector('h2').innerText = 'You go first!'
                this.player1 = new Player (playerName, "human", "X")
                this.player2 = new Player("Computer", "AI", "O")
            }
        }
        else {
            const playerName = prompt('Please enter one player\'s name.')
            const playerName2 = prompt('Please enter the other player\'s name.')
            document.querySelector('h2').innerText = 'Tossing a coin...'
            let toss = Math.random()
            if (toss < 0.5) {
                document.querySelector('h2').innerText = `${playerName} goes first!`
                this.player1 = new Player (playerName, "human", "X")
                this.player2 = new Player (playerName2, "human", "O")
            }
            else {
                document.querySelector('h2').innerText = `${playerName2} goes first!`
                this.player1 = new Player (playerName2, "human", "X")
                this.player2 = new Player (playerName, "human", "O")
            }
        }
        setTimeout(() => {
            document.querySelector('h2').innerText = `${this.player1.name}'s turn`
            if (this.player1.type == 'AI') {this.computerMove()}
        }, 2000)
    }

    checkIfWon(symbol) {
        const rows = [[this.boxValues[0], this.boxValues[1], this.boxValues[2]],
                    [this.boxValues[3], this.boxValues[4], this.boxValues[5]],
                    [this.boxValues[6], this.boxValues[7], this.boxValues[8]]]
        const columns = [[this.boxValues[0], this.boxValues[3], this.boxValues[6]],
                    [this.boxValues[1], this.boxValues[4], this.boxValues[7]],
                    [this.boxValues[2], this.boxValues[5], this.boxValues[8]]]
        const diagonals = [[this.boxValues[0], this.boxValues[4], this.boxValues[8]],
                        [this.boxValues[2], this.boxValues[4], this.boxValues[6]]]
        const equalsSymbol = (arr, symbol) => arr.every(e => e == symbol)
        return rows.some(e => equalsSymbol(e, symbol)) || columns.some(e => equalsSymbol(e, symbol)) || diagonals.some(e => equalsSymbol(e, symbol))
    }

    playMove(event) {
        const idx = Array.prototype.indexOf.call(this.boxes, event.target)
        const symbol = this.activePlayer.symbol
        event.target.innerText = symbol
        this.boxValues[idx] = symbol
        if (this.checkOutcome(symbol)) {return}
        this.activePlayer = this.activePlayer.name == this.player1.name ? this.player2 : this.player1
        document.querySelector('h2').innerText = `${this.activePlayer.name}'s turn`
        if (this.activePlayer.type == 'AI') {this.computerMove()}
    }

    computerMove() {            
        const symbol = this.activePlayer.symbol
        setTimeout(() => {
            let hasMadeAMove = false
            while (!hasMadeAMove) {
                for (let i = 0; i < this.boxValues.length; i++) {
                if (this.boxValues[i]) {continue}
                let random = Math.random()
                if (random >= 0.5) {
                    this.boxValues[i] = symbol
                    this.boxes[i].innerText = symbol
                    hasMadeAMove = true
                    break
                    }
                }
            }
            if (this.checkOutcome(symbol)) {return}
            this.activePlayer = this.activePlayer.name == this.player1.name ? this.player2 : this.player1
            document.querySelector('h2').innerText = `${this.activePlayer.name}'s turn`
        }, 2000) 
    }

    checkOutcome(symbol) {
        if (this.checkIfWon(symbol)) {
            this.gameOver()
            return true
        }
        if (this.checkForDraw()) {
            this.draw()
            return true
        }
        return false
    }

    gameOver() {
        document.querySelector('h2').innerText = `${this.activePlayer.name} wins!`
        document.querySelectorAll('button').forEach(e => e.classList.remove('hidden'))
    }

    checkForDraw() {
        return (!this.boxValues.includes(""))
    }

    draw() {
        document.querySelector('h2').innerText = `It's a draw!`
        document.querySelectorAll('button').forEach(e => e.classList.remove('hidden'))
    }

}

document.querySelector('#vsAI').addEventListener('click', playVsAI)
document.querySelector('#pvp').addEventListener('click', playPvP)

function playVsAI() {
    let game = new Game('vsAI')
    document.querySelectorAll('button').forEach(e => e.classList.add('hidden'))
}

function playPvP() {
    let game = new Game('pvp')
    document.querySelectorAll('button').forEach(e => e.classList.add('hidden'))
}