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

    // Reset UI states
    document.getElementById('left-side').classList.remove('winner', 'loser');
    document.getElementById('right-side').classList.remove('winner', 'loser');
    document.getElementById('left-stats').classList.remove('reveal');
    document.getElementById('right-stats').classList.remove('reveal');
    
    // Get two unique cards
    let card1 = getRandomCard();
    let card2 = getRandomCard();
    while (card1.id === card2.id) {
        card2 = getRandomCard();
    }

    currentMatch = { left: card1, right: card2 };

    // Update Left UI
    document.getElementById('left-img').src = card1.imageUrl;
    document.getElementById('left-bg').style.backgroundImage = `url(${card1.imageUrl})`;
    document.getElementById('left-set').innerText = card1.setName;
    document.getElementById('left-number').innerText = `CARD #${card1.num}`;

    // Update Right UI
    document.getElementById('right-img').src = card2.imageUrl;
    document.getElementById('right-bg').style.backgroundImage = `url(${card2.imageUrl})`;
    document.getElementById('right-set').innerText = card2.setName;
    document.getElementById('right-number').innerText = `CARD #${card2.num}`;
}

// --- Voting Logic ---
function getStats() {
    return JSON.parse(localStorage.getItem('pokeClashStats')) || {};
}

function saveStats(statsObj) {
    localStorage.setItem('pokeClashStats', JSON.stringify(statsObj));
}

// Generates a realistic fake history based on actual Pokemon numbering rules & Nostalgia
function seedFakeStats(card, db) {
    if (db[card.id]) return; // Already exists, skip

    const set = ALL_SETS.find(s => s.id === card.setId);
    const isGalleryCard = !!set.prefix;
    const pureNum = parseInt(card.num.replace(/\D/g, ''));
    
    // Arrays defining the vintage WotC era sets where Holos are at the beginning
    const vintageSets = ['base1', 'base2', 'base3', 'base4', 'base5', 'gym1', 'gym2', 'neo1', 'neo2', 'neo3', 'neo4'];
    
    // Identify sets that get the massive Original 151 Bump
    const isOriginal151 = set.id === 'base1' || set.id === 'sv3pt5';
    const isVintage = vintageSets.includes(set.id);
    
    let targetWinRate;

    // RULE 1: Ultimate Chase Cards (SIRs, Golds, Alt Arts)
    if (!isVintage && pureNum >= (set.count * 0.94)) {
        targetWinRate = Math.random() * (0.99 - 0.90) + 0.90; // 90% to 99%
    }
    // RULE 2: Vintage Holos (Cards #1 through #16 in early sets)
    else if (isVintage && pureNum <= 16) {
        targetWinRate = Math.random() * (0.98 - 0.85) + 0.85; // 85% to 98%
    }
    // RULE 3: Trainer Galleries / Galarian Galleries
    else if (isGalleryCard) {
        targetWinRate = Math.random() * (0.90 - 0.75) + 0.75; // 75% to 90%
    } 
    // RULE 4: Standard Secret Rares & IRs (Top 15% of modern sets)
    else if (!isVintage && pureNum >= (set.count * 0.85)) {
        targetWinRate = Math.random() * (0.85 - 0.70) + 0.70; // 70% to 85%
    }
    // RULE 5: The "Original 151" God-Tier Bulk (Base Set & modern 151 set)
    else if (isOriginal151) {
        targetWinRate = Math.random() * (0.85 - 0.60) + 0.60; // 60% to 85%
    }
    // RULE 6: Standard Vintage Bulk (Jungle, Fossil, Neo, etc.)
    else if (isVintage) {
        targetWinRate = Math.random() * (0.70 - 0.50) + 0.50; // 50% to 70%
    }
    // RULE 7: Modern Standard Rares / Holos / V / ex 
    else if (pureNum >= (set.count * 0.70)) {
        targetWinRate = Math.random() * (0.60 - 0.40) + 0.40; // 40% to 60%
    } 
    // RULE 8: Modern Bulk (Commons, Uncommons)
    else {
        targetWinRate = Math.random() * (0.35 - 0.15) + 0.15; // 15% to 35%
    }

    // Generate a believable baseline of matches (between 150 and 350)
    const matches = Math.floor(Math.random() * (350 - 150 + 1)) + 150; 
    const wins = Math.round(matches * targetWinRate);

    db[card.id] = { wins: wins, matches: matches };
}

function updateUIStats(side, stats) {
    const winPercent = stats.matches === 0 ? 0 : Math.round((stats.wins / stats.matches) * 100);
    // Updated HTML structure to support large number on top, label on bottom
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

    // Visual feedback
    document.getElementById(`${chosenSide}-side`).classList.add('winner');
    const otherSide = chosenSide === 'left' ? 'right' : 'left';
    document.getElementById(`${otherSide}-side`).classList.add('loser');

    // Update LocalStorage Stats
    let db = getStats();
    
    // Seed realistic data if the card has never been voted on before
    seedFakeStats(winner, db);
    seedFakeStats(loser, db);

    // Record the actual user vote
    db[winner.id].matches += 1;
    db[winner.id].wins += 1;
    db[loser.id].matches += 1;
    saveStats(db);

    // Reveal stats to user
    updateUIStats('left', db[currentMatch.left.id]);
    updateUIStats('right', db[currentMatch.right.id]);

    // Next match delay
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
    if (!window.matchMedia('(display-mode: standalone)').matches) {
        if (installAppBtn) installAppBtn.style.display = 'block'; 
    }
});

if (installAppBtn) {
    installAppBtn.addEventListener('click', async () => {
        if (deferredPrompt) {
            deferredPrompt.prompt();
            const { outcome } = await deferredPrompt.userChoice;
            if (outcome === 'accepted') deferredPrompt = null;
        } else {
            settingsModal.classList.remove('active');
            installInstructionsModal.classList.add('active');
        }
    });
}

// Hide install button completely if running in standalone PWA mode
if (window.matchMedia('(display-mode: standalone)').matches || window.navigator.standalone === true) {
    if (installAppBtn) installAppBtn.style.display = 'none';
}

// Start game
window.onload = loadNewMatchup;