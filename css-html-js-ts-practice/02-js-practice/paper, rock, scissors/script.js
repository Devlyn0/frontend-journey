let computerScore = 0;
let playerScore = 0;

function getPlayerChoice() {
    return prompt('Камень, ножницы или бумага?').toLowerCase();
}

function getComputerChoice() {
    let randomNumber = Math.random();

    switch (true) {
        case (randomNumber <= 0.33): 
            return 'камень';
        case (randomNumber > 0.33 && randomNumber <= 0.66):
            return 'ножницы';
        case (randomNumber > 0.66 && randomNumber <= 1):
            return 'бумага'
    }
}

function concludeRound(winner, numberOfRound, playerChoice, computerChoice) {
    alert(`${winner} победил в ${numberOfRound}м раунде \nХод игрока - ${playerChoice}  \nХод компьютера - ${computerChoice} 
        \nСчет игрока - ${playerScore} \nСчет компьютера - ${computerScore}`);
}

function playRound(numberOfRound) {
    let playerChoice = getPlayerChoice();
    let computerChoice = getComputerChoice();

    if (playerChoice === 'камень' && computerChoice === 'ножницы') {
        playerScore+=1;
        concludeRound('Игрок', numberOfRound, playerChoice, computerChoice);
    }   
    else if (playerChoice === 'ножницы' && computerChoice === 'бумага') {
        playerScore+=1;
        concludeRound('Игрок', numberOfRound, playerChoice, computerChoice);
    }
    else if (playerChoice === 'бумага' && computerChoice === 'камень') {
        playerScore+=1;
        concludeRound('Игрок', numberOfRound, playerChoice, computerChoice);
    }
    else if (playerChoice === computerChoice) {
         concludeRound('Ничья', numberOfRound, playerChoice, computerChoice);
    }
    else {
        computerScore+=1;
        concludeRound('Компьютер', numberOfRound, playerChoice, computerChoice)
    }
}

function playGame() {
    for (let i = 0; i < 5; i++){
        playRound(i+1);
    }
}

playGame();