const app = document.createElement('div');
app.classList.add('app');

const header = document.createElement('header');
header.classList.add('header');

const title = document.createElement('h1');
title.classList.add('title');
title.textContent = 'Memory Game';

const headerActions = document.createElement('div');
headerActions.classList.add('header-actions');

const newGameButton = document.createElement('button');
newGameButton.classList.add('button', 'button-new-game');
newGameButton.type = 'button';
newGameButton.textContent = 'New Game';

const leaderboardButton = document.createElement('button');
leaderboardButton.classList.add('button', 'button-leaderboard');
leaderboardButton.type = 'button';
leaderboardButton.textContent = 'Leaderboard';

headerActions.append(newGameButton, leaderboardButton);
header.append(title, headerActions);

const main = document.createElement('main');
main.classList.add('main');

const stats = document.createElement('section');
stats.classList.add('stats');

const movesContainer = document.createElement('div');
movesContainer.classList.add('stat');

const movesLabel = document.createElement('span');
movesLabel.classList.add('stat-label');
movesLabel.textContent = 'Moves';

const movesValue = document.createElement('span');
movesValue.classList.add('stat-value');
movesValue.textContent = '0';

movesContainer.append(movesLabel, movesValue);

const pairsContainer = document.createElement('div');
pairsContainer.classList.add('stat');

const pairsLabel = document.createElement('span');
pairsLabel.classList.add('stat-label');
pairsLabel.textContent = 'Pairs';

const pairsValue = document.createElement('span');
pairsValue.classList.add('stat-value');
pairsValue.textContent = '0 / 8';

pairsContainer.append(pairsLabel, pairsValue);

stats.append(movesContainer, pairsContainer);

const gameBoard = document.createElement('section');
gameBoard.classList.add('game-board');
gameBoard.setAttribute('aria-label', 'Memory game board');

for (let index = 0; index < 16; index += 1) {
    const card = document.createElement('button');

    card.classList.add('card');
    card.type = 'button';
    card.setAttribute('aria-label', `Card ${index + 1}`);

    const cardInner = document.createElement('span');
    cardInner.classList.add('card-inner');

    const cardBack = document.createElement('span');
    cardBack.classList.add('card-back');
    cardBack.textContent = '?';

    cardInner.append(cardBack);
    card.append(cardInner);
    gameBoard.append(card);
}

main.append(stats, gameBoard);
app.append(header, main);

document.body.append(app);