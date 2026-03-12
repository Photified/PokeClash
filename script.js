const ALL_SETS = [
    { id: 'base1', name: 'Base Set', count: 102 }, { id: 'base2', name: 'Jungle', count: 64 }, { id: 'base3', name: 'Fossil', count: 62 }, { id: 'base4', name: 'Base 2', count: 130 }, { id: 'base5', name: 'Team Rocket', count: 83 },
    { id: 'gym1', name: 'Gym Heroes', count: 132 }, { id: 'gym2', name: 'Gym Challenge', count: 132 }, { id: 'neo1', name: 'Neo Genesis', count: 111 }, { id: 'neo2', name: 'Neo Discovery', count: 75 },
    { id: 'neo3', name: 'Neo Revelation', count: 66 }, { id: 'neo4', name: 'Neo Destiny', count: 113 }, { id: 'ecard1', name: 'Expedition', count: 165 }, { id: 'ex1', name: 'Ruby & Sapphire', count: 109 },
    { id: 'ex3', name: 'Dragon', count: 100 }, { id: 'ex6', name: 'Team Magma vs Team Aqua', count: 97 }, { id: 'ex14', name: 'Crystal Guardians', count: 100 }, { id: 'ex15', name: 'Dragon Frontiers', count: 101 },
    { id: 'dp1', name: 'Diamond & Pearl', count: 130 }, { id: 'pl1', name: 'Platinum', count: 130 }, { id: 'bw1', name: 'Black & White', count: 115 }, { id: 'xy1', name: 'XY', count: 146 },
    { id: 'xy7', name: 'Ancient Origins', count: 100 }, { id: 'xy12', name: 'Evolutions', count: 113 }, 
    { id: 'sm1', name: 'Sun & Moon', count: 173 }, { id: 'sm4', name: 'Crimson Invasion', count: 126 },
    { id: 'sm9', name: 'Team Up', count: 196 }, { id: 'sm11', name: 'Unified Minds', count: 258 }, { id: 'sm12', name: 'Cosmic Eclipse', count: 271 }, 
    { id: 'swsh1', name: 'Sword & Shield', count: 216 }, { id: 'swsh4', name: 'Vivid Voltage', count: 203 }, { id: 'swsh45', name: 'Shining Fates', count: 73 }, 
    { id: 'swsh7', name: 'Evolving Skies', count: 237 }, { id: 'swsh8', name: 'Fusion Strike', count: 284 }, { id: 'swsh9', name: 'Brilliant Stars', count: 186 }, 
    { id: 'swsh10', name: 'Astral Radiance', count: 216 }, { id: 'swsh11', name: 'Lost Origin', count: 216 }, { id: 'swsh12', name: 'Silver Tempest', count: 215 },
    { id: 'swsh12tg', name: 'Silver Tempest TG', count: 30, prefix: 'TG' }, 
    { id: 'swsh12pt5gg', name: 'Crown Zenith GG', count: 70, prefix: 'GG' }, 
    { id: 'sv1', name: 'Scarlet & Violet', count: 258 }, { id: 'sv2', name: 'Paldea Evolved', count: 269 },
    { id: 'sv3', name: 'Obsidian Flames', count: 230 }, { id: 'sv3pt5', name: '151', count: 210 }, { id: 'sv4', name: 'Paradox Rift', count: 266 }, 
    { id: 'sv4pt5', name: 'Paldean Fates', count: 245 }, { id: 'sv5', name: 'Temporal Forces', count: 218 }, { id: 'sv6', name: 'Twilight Masquerade', count: 226 }, 
    { id: 'sv7', name: 'Stellar Crown', count: 175 }, { id: 'sv8', name: 'Surging Sparks', count: 252 }, { id: 'sv8pt5', name: 'Prismatic Evolutions', count: 175 }
];

let currentMatch = { left: null, right: null };
let isVotingLocked = false; 

// --- Oracle Mode State ---
let isOracleMode = false;
let currentStreak = 0;
let bestStreak = 0;

function initApp() {
    const savedConfig = JSON.parse(localStorage.getItem('pokeClashConfig')) || { isOracleMode: false, currentStreak: 0, bestStreak: 0 };
    isOracleMode = savedConfig.isOracleMode;
    currentStreak = savedConfig.currentStreak || 0;
    bestStreak = savedConfig.bestStreak || 0;

    document.getElementById('oracle-toggle').checked = isOracleMode;
    updateStreakUI();
    loadNewMatchup();
}

function saveConfig() {
    localStorage.setItem('pokeClashConfig', JSON.stringify({ isOracleMode, currentStreak, bestStreak }));
}

function toggleOracleMode() {
    isOracleMode = document.getElementById('oracle-toggle').checked;
    if (!isOracleMode) {
        currentStreak = 0; 
    }
    saveConfig();
    updateStreakUI();
}

function updateStreakUI() {
    const streakContainer = document.getElementById('streak-container');
    const highScoreDisplay = document.getElementById('high-score-display');

    if (isOracleMode) {
        streakContainer.style.display = 'flex';
        highScoreDisplay.style.display = 'block';
        document.getElementById('streak-num').innerText = currentStreak;
        document.getElementById('best-streak-num').innerText = bestStreak;
    } else {
        streakContainer.style.display = 'none';
        highScoreDisplay.style.display = 'none';
    }
}

function getRandomCard() {
    const set = ALL_SETS[Math.floor(Math.random() * ALL_SETS.length)];
    const num = Math.floor(Math.random() * set.count) + 1; 
    let formattedNum = set.prefix ? set.prefix + num.toString().padStart(2, '0') : num.toString();
    return {
        id: `${set.id}-${formattedNum}`,
        setId: set.id,
        setName: set.name,
        num: formattedNum,
        imageUrl: `https://images.pokemontcg.io/${set.id}/${formattedNum}_hires.png`
    };
}

function loadNewMatchup() {
    isVotingLocked = false;

    document.getElementById('left-side').classList.remove('winner', 'loser');
    document.getElementById('right-side').classList.remove('winner', 'loser');
    document.getElementById('left-stats').classList.remove('reveal');
    document.getElementById('right-stats').classList.remove('reveal');
    
    let card1 = getRandomCard();
    let card2 = getRandomCard();
    while (card1.id === card2.id) {
        card2 = getRandomCard();
    }

    currentMatch = { left: card1, right: card2 };

    document.getElementById('left-img').src = card1.imageUrl;
    document.getElementById('left-bg').style.backgroundImage = `url(${card1.imageUrl})`;
    document.getElementById('left-set').innerText = card1.setName;
    document.getElementById('left-number').innerText = `CARD #${card1.num}`;

    document.getElementById('right-img').src = card2.imageUrl;
    document.getElementById('right-bg').style.backgroundImage = `url(${card2.imageUrl})`;
    document.getElementById('right-set').innerText = card2.setName;
    document.getElementById('right-number').innerText = `CARD #${card2.num}`;
}

function getStats() {
    return JSON.parse(localStorage.getItem('pokeClashStats')) || {};
}

function saveStats(statsObj) {
    localStorage.setItem('pokeClashStats', JSON.stringify(statsObj));
}

function seedFakeStats(card, db) {
    if (db[card.id]) return; 

    const set = ALL_SETS.find(s => s.id === card.setId);
    const isGalleryCard = !!set.prefix;
    const pureNum = parseInt(card.num.replace(/\D/g, ''));
    
    const vintageSets = ['base1', 'base2', 'base3', 'base4', 'base5', 'gym1', 'gym2', 'neo1', 'neo2', 'neo3', 'neo4'];
    const isOriginal151 = set.id === 'base1' || set.id === 'sv3pt5';
    const isVintage = vintageSets.includes(set.id);
    
    let targetWinRate;

    if (!isVintage && pureNum >= (set.count * 0.94)) { targetWinRate = Math.random() * (0.99 - 0.90) + 0.90; }
    else if (isVintage && pureNum <= 16) { targetWinRate = Math.random() * (0.98 - 0.85) + 0.85; }
    else if (isGalleryCard) { targetWinRate = Math.random() * (0.90 - 0.75) + 0.75; } 
    else if (!isVintage && pureNum >= (set.count * 0.85)) { targetWinRate = Math.random() * (0.85 - 0.70) + 0.70; }
    else if (isOriginal151) { targetWinRate = Math.random() * (0.85 - 0.60) + 0.60; }
    else if (isVintage) { targetWinRate = Math.random() * (0.70 - 0.50) + 0.50; }
    else if (pureNum >= (set.count * 0.70)) { targetWinRate = Math.random() * (0.60 - 0.40) + 0.40; } 
    else { targetWinRate = Math.random() * (0.35 - 0.15) + 0.15; }

    const matches = Math.floor(Math.random() * (350 - 150 + 1)) + 150; 
    const wins = Math.round(matches * targetWinRate);

    db[card.id] = { wins: wins, matches: matches };
}

function updateUIStats(side, stats) {
    const winPercent = stats.matches === 0 ? 0 : Math.round((stats.wins / stats.matches) * 100);
    document.getElementById(`${side}-percent`).innerHTML = `
        <div class="pct-num">${winPercent}%</div>
        <div class="pct-lbl">WIN RATE</div>
    `;
    document.getElementById(`${side}-stats`).classList.add('reveal');
}

function castVote(chosenSide) {
    if (isVotingLocked) return;
    isVotingLocked = true; 

    const winner = chosenSide === 'left' ? currentMatch.left : currentMatch.right;
    const loser = chosenSide === 'left' ? currentMatch.right : currentMatch.left;

    document.getElementById(`${chosenSide}-side`).classList.add('winner');
    const otherSide = chosenSide === 'left' ? 'right' : 'left';
    document.getElementById(`${otherSide}-side`).classList.add('loser');

    let db = getStats();
    
    seedFakeStats(winner, db);
    seedFakeStats(loser, db);

    if (isOracleMode) {
        const chosenWinRate = db[winner.id].matches === 0 ? 0 : (db[winner.id].wins / db[winner.id].matches);
        const unchosenWinRate = db[loser.id].matches === 0 ? 0 : (db[loser.id].wins / db[loser.id].matches);

        if (chosenWinRate >= unchosenWinRate) {
            currentStreak++;
            if (currentStreak > bestStreak) {
                bestStreak = currentStreak;
            }
        } else {
            currentStreak = 0;
        }
        
        saveConfig();
        updateStreakUI();
    }

    db[winner.id].matches += 1;
    db[winner.id].wins += 1;
    db[loser.id].matches += 1;
    saveStats(db);

    updateUIStats('left', db[currentMatch.left.id]);
    updateUIStats('right', db[currentMatch.right.id]);

    setTimeout(() => {
        loadNewMatchup();
    }, 1500);
}

// --- Modals & Install Logic ---
const settingsModal = document.getElementById('settings-modal');
const installInstructionsModal = document.getElementById('install-instructions-modal');
const installAppBtn = document.getElementById('install-app-btn');

function toggleSettings() {
    settingsModal.classList.toggle('active');
}

function closeInstallInstructions() {
    installInstructionsModal.classList.remove('active');
}

let deferredPrompt;

window.addEventListener('beforeinstallprompt', (e) => {
    e.preventDefault();
    deferredPrompt = e;
});

if (installAppBtn) {
    installAppBtn.addEventListener('click', async () => {
        if (deferredPrompt) {
            deferredPrompt.prompt();
            const { outcome } = await deferredPrompt.userChoice;
            if (outcome === 'accepted') {
                deferredPrompt = null;
            }
            settingsModal.classList.remove('active');
        } else {
            settingsModal.classList.remove('active');
            installInstructionsModal.classList.add('active');
        }
    });
}

if (window.matchMedia('(display-mode: standalone)').matches || window.navigator.standalone === true) {
    if (installAppBtn) installAppBtn.style.display = 'none';
}

window.onload = initApp;