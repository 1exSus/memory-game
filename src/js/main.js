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

const cardValues = [
    '🍎',
    '🍌',
    '🍇',
    '🍉',
    '🍓',
    '🍒',
    '🥝',
    '🍍',
];

const cards = [...cardValues, ...cardValues];

let firstCard = null;
let secondCard = null;
let moves = 0;
let foundPairs = 0;
let isChecking = false;
let mismatchTimer = null;

function shuffleCards(cardList) {
    const shuffledCards = [...cardList];

    for (let index = shuffledCards.length - 1; index > 0; index -= 1) {
        const randomIndex = Math.floor(Math.random() * (index + 1));

        [shuffledCards[index], shuffledCards[randomIndex]] = [
            shuffledCards[randomIndex],
            shuffledCards[index],
        ];
    }

    return shuffledCards;
}

function updateStats() {
    movesValue.textContent = String(moves);
    pairsValue.textContent = `${foundPairs} / 8`;
}

function openCard(card) {
    card.classList.add('card-open');

    const cardBack = card.querySelector('.card-back');
    const cardValue = card.querySelector('.card-value');

    cardBack.hidden = true;
    cardValue.hidden = false;
}

function closeCard(card) {
    card.classList.remove('card-open');

    const cardBack = card.querySelector('.card-back');
    const cardValue = card.querySelector('.card-value');

    cardBack.hidden = false;
    cardValue.hidden = true;
}

function getCardValue(card) {
    return card.dataset.value;
}

function handleCardClick(event) {
    const card = event.currentTarget;

    if (isChecking) {
        return;
    }

    if (card.classList.contains('card-open')) {
        return;
    }

    if (card.classList.contains('card-found')) {
        return;
    }

    openCard(card);

    if (!firstCard) {
        firstCard = card;
        return;
    }

    secondCard = card;
    moves += 1;
    updateStats();

    const firstValue = getCardValue(firstCard);
    const secondValue = getCardValue(secondCard);

    if (firstValue === secondValue) {
        firstCard.classList.add('card-found');
        secondCard.classList.add('card-found');

        foundPairs += 1;
        updateStats();

        firstCard = null;
        secondCard = null;

        return;
    }

    isChecking = true;

    mismatchTimer = setTimeout(() => {
        closeCard(firstCard);
        closeCard(secondCard);

        firstCard = null;
        secondCard = null;
        isChecking = false;
        mismatchTimer = null;
    }, 1000);
}

function createCards() {
    gameBoard.replaceChildren();

    firstCard = null;
    secondCard = null;
    isChecking = false;

    const shuffledCards = shuffleCards(cards);

    shuffledCards.forEach((value, index) => {
        const card = document.createElement('button');

        card.classList.add('card');
        card.type = 'button';
        card.setAttribute('aria-label', `Card ${index + 1}`);
        card.dataset.value = value;

        const cardInner = document.createElement('span');
        cardInner.classList.add('card-inner');

        const cardBack = document.createElement('span');
        cardBack.classList.add('card-back');
        cardBack.textContent = '?';

        const cardValue = document.createElement('span');
        cardValue.classList.add('card-value');
        cardValue.textContent = value;
        cardValue.hidden = true;

        cardInner.append(cardBack, cardValue);
        card.append(cardInner);
        gameBoard.append(card);

        card.addEventListener('click', handleCardClick);
    });
}

function startNewGame() {
    if (mismatchTimer !== null) {
        clearTimeout(mismatchTimer);
        mismatchTimer = null;
    }

    moves = 0;
    foundPairs = 0;
    firstCard = null;
    secondCard = null;
    isChecking = false;

    updateStats();
    createCards();
}

newGameButton.addEventListener('click', startNewGame);

main.append(stats, gameBoard);
app.append(header, main);

document.body.append(app);

createCards();