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
let isGameFinished = false;
let resultSaved = false;

const LEADERBOARD_KEY = 'memory-game-leaderboard';
const MAX_LEADERBOARD_RESULTS = 10;

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

function getLeaderboard() {
    const savedResults = localStorage.getItem(LEADERBOARD_KEY);

    if (!savedResults) {
        return [];
    }

    try {
        const results = JSON.parse(savedResults);

        if (!Array.isArray(results)) {
            return [];
        }

        return results;
    } catch {
        return [];
    }
}

function saveLeaderboard(results) {
    localStorage.setItem(LEADERBOARD_KEY, JSON.stringify(results));
}

function formatDate(date) {
    const day = String(date.getDate()).padStart(2, '0');
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const year = date.getFullYear();

    return `${day}.${month}.${year}`;
}

function addLeaderboardResult() {
    if (resultSaved) {
        return;
    }

    const results = getLeaderboard();

    const result = {
        moves,
        date: formatDate(new Date()),
        timestamp: Date.now(),
    };

    results.push(result);

    results.sort((firstResult, secondResult) => {
        if (firstResult.moves !== secondResult.moves) {
            return firstResult.moves - secondResult.moves;
        }

        return firstResult.timestamp - secondResult.timestamp;
    });

    const topResults = results.slice(0, MAX_LEADERBOARD_RESULTS);

    saveLeaderboard(topResults);

    resultSaved = true;
}

function createModal() {
    const overlay = document.createElement('div');
    overlay.classList.add('modal-overlay');

    const modal = document.createElement('div');
    modal.classList.add('modal');
    modal.setAttribute('role', 'dialog');
    modal.setAttribute('aria-modal', 'true');

    overlay.append(modal);

    return {
        overlay,
        content: modal,
    };
}

function closeModal() {
    const modalOverlay = document.querySelector('.modal-overlay');

    if (!modalOverlay) {
        return;
    }

    modalOverlay.remove();
    document.body.classList.remove('modal-open');
    document.removeEventListener('keydown', handleModalKeydown);
}

function handleModalKeydown(event) {
    if (event.key === 'Escape') {
        closeModal();
    }
}

function showVictoryModal() {
    const modal = createModal();

    const title = document.createElement('h2');
    title.classList.add('modal-title');
    title.textContent = 'You win!';

    const text = document.createElement('p');
    text.classList.add('modal-text');
    text.textContent = `You completed the game in ${moves} moves.`;

    const actions = document.createElement('div');
    actions.classList.add('modal-actions');

    const newGameModalButton = document.createElement('button');
    newGameModalButton.classList.add('button');
    newGameModalButton.type = 'button';
    newGameModalButton.textContent = 'New Game';

    const closeButton = document.createElement('button');
    closeButton.classList.add('button');
    closeButton.type = 'button';
    closeButton.textContent = 'Close';

    newGameModalButton.addEventListener('click', startNewGame);
    closeButton.addEventListener('click', closeModal);

    actions.append(newGameModalButton, closeButton);

    modal.content.append(title, text, actions);

    document.body.append(modal.overlay);
    document.body.classList.add('modal-open');

    modal.overlay.addEventListener('click', (event) => {
        if (event.target === modal.overlay) {
            closeModal();
        }
    });

    document.addEventListener('keydown', handleModalKeydown);
}

function showLeaderboardModal() {
    const modal = createModal();

    const title = document.createElement('h2');
    title.classList.add('modal-title');
    title.textContent = 'Leaderboard';

    const content = document.createElement('div');
    content.classList.add('leaderboard');

    const results = getLeaderboard();

    if (results.length === 0) {
        const emptyMessage = document.createElement('p');
        emptyMessage.classList.add('leaderboard-empty');
        emptyMessage.textContent = 'No results yet.';

        content.append(emptyMessage);
    } else {
        const list = document.createElement('ol');
        list.classList.add('leaderboard-list');

        results.forEach((result) => {
            const item = document.createElement('li');
            item.classList.add('leaderboard-item');

            const movesText = document.createElement('span');
            movesText.textContent = `${result.moves} moves`;

            const dateText = document.createElement('span');
            dateText.textContent = result.date;

            item.append(movesText, dateText);
            list.append(item);
        });

        content.append(list);
    }

    const actions = document.createElement('div');
    actions.classList.add('modal-actions');

    const closeButton = document.createElement('button');
    closeButton.classList.add('button');
    closeButton.type = 'button';
    closeButton.textContent = 'Close';

    closeButton.addEventListener('click', closeModal);

    actions.append(closeButton);

    modal.content.append(title, content, actions);

    document.body.append(modal.overlay);
    document.body.classList.add('modal-open');

    modal.overlay.addEventListener('click', (event) => {
        if (event.target === modal.overlay) {
            closeModal();
        }
    });

    document.addEventListener('keydown', handleModalKeydown);
}

function handleCardClick(event) {
    const card = event.currentTarget;

    if (isChecking || isGameFinished) {
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

        if (foundPairs === cardValues.length) {
            isGameFinished = true;

            addLeaderboardResult();
            showVictoryModal();
        }

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
    closeModal();

    if (mismatchTimer !== null) {
        clearTimeout(mismatchTimer);
        mismatchTimer = null;
    }

    moves = 0;
    foundPairs = 0;
    firstCard = null;
    secondCard = null;
    isChecking = false;
    isGameFinished = false;
    resultSaved = false;

    updateStats();
    createCards();
}

newGameButton.addEventListener('click', startNewGame);
leaderboardButton.addEventListener('click', showLeaderboardModal);

main.append(stats, gameBoard);
app.append(header, main);

document.body.append(app);

createCards();