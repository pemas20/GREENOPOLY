let players = [];
let stickyInputs = {};
let audioCtx = null;
let isMusicPlaying = false;
let timerInterval;

const AudioCtx = window.AudioContext || window.webkitAudioContext;

// ================== RETRO 8-BIT SOUND & MUSIC ENGINE (WEB AUDIO API) ==================
function initAudio() {
    if (!audioCtx) {
        audioCtx = new AudioCtx();
    }
    
    if (audioCtx.state === 'suspended') {
        audioCtx.resume();
    }

    if (!isMusicPlaying) {
        startBackgroundMusic();
    }
}

function playVictoryJingle() {
    const notes = [523.25, 659.25, 783.99, 1046.50];
    notes.forEach((freq, i) => {
        const osc = audioCtx.createOscillator();
        const gain = audioCtx.createGain();
        osc.connect(gain); gain.connect(audioCtx.destination);
        osc.frequency.setValueAtTime(freq, audioCtx.currentTime + (i * 0.2));
        gain.gain.setValueAtTime(0.2, audioCtx.currentTime + (i * 0.2));
        gain.gain.exponentialRampToValueAtTime(0.01, audioCtx.currentTime + (i * 0.2) + 0.2);
        osc.start(audioCtx.currentTime + (i * 0.2)); osc.stop(audioCtx.currentTime + (i * 0.2) + 0.2);
    });
}

function startManualTimer() {
    clearInterval(timerInterval);
    let m = parseInt(document.getElementById('timerMin').value) || 0;
    let s = parseInt(document.getElementById('timerSec').value) || 0;
    let totalSeconds = (m * 60) + s;
    const display = document.getElementById('timerDisplay');
    
    timerInterval = setInterval(() => {
        if (totalSeconds <= 0) {
            clearInterval(timerInterval);
            display.innerText = "TIME'S UP!";
            const topPlayer = document.querySelector('.rank-1');
            if (topPlayer) {
                topPlayer.style.animation = "winnerPulse 1s infinite alternate";
                playVictoryJingle(); // Memutar suara kemenangan otomatis
            }
        } else {
            totalSeconds--;
            let mm = Math.floor(totalSeconds / 60);
            let ss = totalSeconds % 60;
            display.innerText = `${mm}:${ss < 10 ? '0' : ''}${ss}`;
        }
    }, 1000);
}

// SUARA KEMENANGAN (VICTORY JINGLE)
function playVictoryJingle() {
    const notes = [523.25, 659.25, 783.99, 1046.50];
    notes.forEach((freq, i) => {
        const osc = audioCtx.createOscillator();
        const gain = audioCtx.createGain();
        osc.connect(gain);
        gain.connect(audioCtx.destination);
        osc.frequency.setValueAtTime(freq, audioCtx.currentTime + (i * 0.2));
        gain.gain.setValueAtTime(0.2, audioCtx.currentTime + (i * 0.2));
        gain.gain.exponentialRampToValueAtTime(0.01, audioCtx.currentTime + (i * 0.2) + 0.2);
        osc.start(audioCtx.currentTime + (i * 0.2));
        osc.stop(audioCtx.currentTime + (i * 0.2) + 0.2);
    });
}

function playArcadeSound(type) {
    try {
        initAudio(); 
        if (!audioCtx || audioCtx.state !== 'running') return;

        const osc = audioCtx.createOscillator();
        const gain = audioCtx.createGain();
        osc.connect(gain);
        gain.connect(audioCtx.destination);

        const now = audioCtx.currentTime;

        if (type === 'click') {
            osc.type = 'square';
            osc.frequency.setValueAtTime(440, now);
            gain.gain.setValueAtTime(0.08, now);
            gain.gain.exponentialRampToValueAtTime(0.01, now + 0.08);
            osc.start(now);
            osc.stop(now + 0.08);
        } 
        else if (type === 'add') {
            osc.type = 'square';
            osc.frequency.setValueAtTime(587.33, now); 
            osc.frequency.setValueAtTime(880, now + 0.08);  
            gain.gain.setValueAtTime(0.12, now);
            gain.gain.exponentialRampToValueAtTime(0.01, now + 0.25);
            osc.start(now);
            osc.stop(now + 0.25);
        } 
        else if (type === 'subtract') {
            osc.type = 'sawtooth';
            osc.frequency.setValueAtTime(300, now);
            osc.frequency.linearRampToValueAtTime(120, now + 0.2);
            gain.gain.setValueAtTime(0.12, now);
            gain.gain.exponentialRampToValueAtTime(0.01, now + 0.2);
            osc.start(now);
            osc.stop(now + 0.2);
        } 
        else if (type === 'reset') {
            osc.type = 'triangle';
            osc.frequency.setValueAtTime(220, now);
            osc.frequency.setValueAtTime(440, now + 0.1);
            gain.gain.setValueAtTime(0.18, now);
            gain.gain.exponentialRampToValueAtTime(0.01, now + 0.3);
            osc.start(now);
            osc.stop(now + 0.3);
        }
    } catch (e) {
        console.log("Kendala Audio Engine:", e);
    }
}

function startBackgroundMusic() {
    try {
        if (!audioCtx) return;
        isMusicPlaying = true;

        const melody = [261.63, 329.63, 392.00, 440.00, 392.00, 329.63, 293.66, 349.23];
        let noteIndex = 0;
        
        setInterval(() => {
            if (audioCtx && audioCtx.state === 'running') {
                const now = audioCtx.currentTime;
                const osc = audioCtx.createOscillator();
                const gain = audioCtx.createGain();
                
                osc.type = 'triangle'; 
                osc.frequency.setValueAtTime(melody[noteIndex], now);
                
                // VOLUME DITINGKATKAN
                gain.gain.setValueAtTime(0.12, now);
                gain.gain.exponentialRampToValueAtTime(0.0001, now + 0.38);
                
                osc.connect(gain);
                gain.connect(audioCtx.destination);
                
                osc.start(now);
                osc.stop(now + 0.38);
                
                noteIndex = (noteIndex + 1) % melody.length;
            }
        }, 400);
    } catch (e) {
        console.log("Gagal memutar musik", e);
    }
}

// ================== FUNGSI TIMER MANUAL ==================
function startManualTimer() {
    clearInterval(timerInterval);
    let m = parseInt(document.getElementById('timerMin').value) || 0;
    let s = parseInt(document.getElementById('timerSec').value) || 0;
    let totalSeconds = (m * 60) + s;
    const display = document.getElementById('timerDisplay');
    
    timerInterval = setInterval(() => {
        if (totalSeconds <= 0) {
            clearInterval(timerInterval);
            display.innerText = "TIME'S UP!";
            const topPlayer = document.querySelector('.rank-1');
            if (topPlayer) {
                topPlayer.style.animation = "winnerPulse 1s infinite alternate";
                playVictoryJingle();
            }
        } else {
            totalSeconds--;
            let mm = Math.floor(totalSeconds / 60);
            let ss = totalSeconds % 60;
            display.innerText = `${mm}:${ss < 10 ? '0' : ''}${ss}`;
        }
    }, 1000);
}

// ================== LAYAR UTAMA & INTERAKSI OPERATOR ==================
window.addEventListener("keydown", function(e) {
    if (e.key === "f" || e.key === "F") {
        playArcadeSound('click');
        if (!document.fullscreenElement) {
            document.documentElement.requestFullscreen().catch(err => {
                console.log(`Gagal Fullscreen: ${err.message}`);
            });
        }
    }
});

function toggleFullscreen() {
    playArcadeSound('click');
    if (!document.fullscreenElement) {
        document.documentElement.requestFullscreen();
    } else {
        document.exitFullscreen();
    }
}

function handleKeyPress(event) {
    if (event.key === "Enter") {
        addNewPlayer();
    }
}

function keepInputValue(id, val) {
    stickyInputs[id] = val;
}

function addLogMessage(message, type = 'info') {
    const logBox = document.getElementById('activityLogBox');
    if (!logBox) return;

    const timestamp = new Date().toLocaleTimeString('id-ID', { hour: '2-digit', minute: '2-digit', second: '2-digit' });
    const logItem = document.createElement('div');
    logItem.className = `log-item ${type}-msg`;
    logItem.innerText = `[${timestamp}] ${message}`;

    logBox.appendChild(logItem);
    // Ini yang membuat riwayat naik secara otomatis ke atas tanpa merubah tinggi box
    logBox.scrollTop = logBox.scrollHeight; 
}

function adjustInputValue(id, amount) {
    playArcadeSound('click');
    const inputEl = document.getElementById(`input-${id}`);
    if (inputEl) {
        let currentVal = parseInt(inputEl.value) || 0;
        let newVal = currentVal + amount;
        inputEl.value = newVal;
        stickyInputs[id] = newVal;
    }
}

function sortPlayers() {
    players.sort((a, b) => {
        if (b.points !== a.points) {
            return b.points - a.points;
        }
        return a.name.localeCompare(b.name);
    });
}

function renderLeaderboard() {
    const podiumContainer = document.getElementById('podiumContainer');
    const listContainer = document.getElementById('listContainer');

    const initialPositions = {};
    const items = document.querySelectorAll('.podium-block, .pixel-row');
    items.forEach(el => {
        const id = el.getAttribute('data-id');
        if (id) {
            initialPositions[id] = el.getBoundingClientRect();
        }
    });

    if (players.length === 0) {
        podiumContainer.innerHTML = `<div class="empty-state">INSERT NAME...<br>SILAKAN MASUKAN NAMA PESERTA DI PANEL KIRI UNTUK MEMULAI GAME! </div>`;
        listContainer.innerHTML = '';
        return;
    }

    sortPlayers();

    podiumContainer.innerHTML = '';
    listContainer.innerHTML = '';

    const topThree = players.slice(0, 3);
    topThree.forEach((player, index) => {
        const rank = index + 1;
        const podiumBlock = document.createElement('div');
        podiumBlock.className = `podium-block rank-${rank}`;
        podiumBlock.setAttribute('data-id', player.id);
        
        const currentVal = stickyInputs[player.id] !== undefined ? stickyInputs[player.id] : '';
        
        podiumBlock.innerHTML = `
            <div class="greenopoly-crown">
                <div class="crown-pixel-shape"></div>
                <div class="crown-particles">
                    <span class="p-leaf">🍃</span>
                    <span class="p-star">✨</span>
                    <span class="p-leaf">🌱</span>
                    <span class="p-star">✨</span>
                </div>
            </div>
            <div class="avatar-pixel">
                <img src="${player.avatar}" alt="${player.name}">
                <div class="rank-tag">RANK-${rank}</div>
            </div>
            <div class="name-row">
                <div class="text-name">${player.name}</div>
            </div>
            <div class="podium-actions">
                <button class="btn-action-retro edit-theme" onclick="editPlayerName(${player.id})">[EDIT]</button>
                <button class="btn-action-retro del-theme" onclick="deletePlayer(${player.id})">[DEL]</button>
            </div>
            <div class="text-pts" id="score-box-${player.id}">${player.points} PTS</div>
            <div class="score-box-retro">
                <button class="btn-stepper-retro" onclick="adjustInputValue(${player.id}, -1)">-</button>
                <input type="number" class="input-score-retro" id="input-${player.id}" value="${currentVal}" placeholder="0" oninput="keepInputValue(${player.id}, this.value)">
                <button class="btn-stepper-retro" onclick="adjustInputValue(${player.id}, 1)">+</button>
                <button class="btn-ok-retro" onclick="submitPoints(${player.id})">OK</button>
            </div>
        `;
        podiumContainer.appendChild(podiumBlock);
    });

    const remaining = players.slice(3);
    remaining.forEach((player, index) => {
        const rank = index + 4;
        const pixelRow = document.createElement('div');
        pixelRow.className = 'pixel-row';
        pixelRow.setAttribute('data-id', player.id);
        
        const currentVal = stickyInputs[player.id] !== undefined ? stickyInputs[player.id] : '';
        
        pixelRow.innerHTML = `
            <div class="pos-idx">RANK-${rank}</div>
            <div class="row-avatar-pixel">
                <img src="${player.avatar}" alt="${player.name}">
            </div>
            <div class="row-name-text">
                <span class="player-name-span">${player.name}</span>
                <div class="row-actions">
                    <button class="btn-action-retro edit-theme" onclick="editPlayerName(${player.id})">[EDIT]</button>
                    <button class="btn-action-retro del-theme" onclick="deletePlayer(${player.id})">[DEL]</button>
                </div>
            </div>
            <div class="row-pts-text" id="score-box-${player.id}">${player.points} PTS</div>
            <div class="score-box-retro">
                <button class="btn-stepper-retro" onclick="adjustInputValue(${player.id}, -1)">-</button>
                <input type="number" class="input-score-retro" id="input-${player.id}" value="${currentVal}" placeholder="0" oninput="keepInputValue(${player.id}, this.value)">
                <button class="btn-stepper-retro" onclick="adjustInputValue(${player.id}, 1)">+</button>
                <button class="btn-ok-retro" onclick="submitPoints(${player.id})">OK</button>
            </div>
        `;
        listContainer.appendChild(pixelRow);
    });

    requestAnimationFrame(() => {
        const currentElements = document.querySelectorAll('.podium-block, .pixel-row');
        currentElements.forEach(el => {
            const id = el.getAttribute('data-id');
            const initialPos = initialPositions[id];
            if (!initialPos) return;

            const finalPos = el.getBoundingClientRect();
            const diffX = initialPos.left - finalPos.left;
            const diffY = initialPos.top - finalPos.top;

            if (diffX !== 0 || diffY !== 0) {
                el.style.transform = `translate(${diffX}px, ${diffY}px)`;
                el.style.transition = 'none';

                requestAnimationFrame(() => {
                    el.style.transition = 'transform 0.6s cubic-bezier(0.25, 1, 0.5, 1)';
                    el.style.transform = '';
                });
            }
        });
    });
}

function submitPoints(playerId) {
    const inputEl = document.getElementById(`input-${playerId}`);
    const value = parseInt(inputEl.value);
    
    if (isNaN(value)) {
        playArcadeSound('subtract');
        alert("INPUT NOMINAL ANGKA!");
        return;
    }

    const player = players.find(p => p.id === playerId);
    if (player) {
        player.points += value;
        
        if (value >= 0) {
            playArcadeSound('add');
            addLogMessage(`${player.name} +${value} PTS`, 'add');
        } else {
            playArcadeSound('subtract');
            addLogMessage(`${player.name} ${value} PTS`, 'sub');
        }

        inputEl.value = "";
        delete stickyInputs[playerId];
        renderLeaderboard();
        
        setTimeout(() => {
            const containerElement = document.getElementById(`score-box-${playerId}`);
            if (containerElement) {
                containerElement.classList.add('score-flash');
                setTimeout(() => containerElement.classList.remove('score-flash'), 600);
            }
        }, 50);
    }
}

function addNewPlayer() {
    playArcadeSound('click');
    const inputName = document.getElementById('newPlayerName');
    const name = inputName.value.trim().toUpperCase();

    if (name === "") {
        playArcadeSound('subtract');
        alert("NAMA TIM TIDAK BOLEH KOSONG!");
        return;
    }

    const newId = players.length > 0 ? Math.max(...players.map(p => p.id)) + 1 : 1;
    players.push({
        id: newId,
        name: name,
        points: 0,
        avatar: `https://api.dicebear.com/7.x/pixel-art/svg?seed=${encodeURIComponent(name)}`
    });

    addLogMessage(`TIM BARU: ${name}`, 'info');
    inputName.value = "";
    renderLeaderboard();
}

function editPlayerName(playerId) {
    playArcadeSound('click');
    const player = players.find(p => p.id === playerId);
    if (player) {
        const replaceName = prompt("EDIT NAMA TIM:", player.name);
        if (replaceName && replaceName.trim() !== "") {
            const oldName = player.name;
            player.name = replaceName.trim().toUpperCase();
            player.avatar = `https://api.dicebear.com/7.x/pixel-art/svg?seed=${encodeURIComponent(player.name)}`;
            addLogMessage(`EDIT: ${oldName} -> ${player.name}`, 'info');
            renderLeaderboard();
        }
    }
}

function deletePlayer(playerId) {
    playArcadeSound('subtract');
    const player = players.find(p => p.id === playerId);
    if (player && confirm(`HAPUS TIM ${player.name} DARI LIVE LEADERBOARD?`)) {
        addLogMessage(`HAPUS: TIM ${player.name}`, 'sub');
        players = players.filter(p => p.id !== playerId);
        delete stickyInputs[playerId];
        renderLeaderboard();
    }
}

function resetAllPoints() {
    if (players.length === 0) {
        playArcadeSound('subtract');
        return;
    }
    
    playArcadeSound('reset');
    if (confirm("APAKAH ANDA YAKIN INGIN MERESET SEMUA POIN TIM MENJADI 0?")) {
        players.forEach(p => p.points = 0);
        stickyInputs = {};
        addLogMessage("RESET: SEMUA POIN KEMBALI KE 0!", "sub");
        renderLeaderboard();
    }
}

function createFallingLeaves() {
    const container = document.getElementById('leaf-container');
    if (!container) return;

    const leafEmojis = ['🍃', '🍂', '🍁'];
    
    setInterval(() => {
        if (document.hidden) return;
        
        const leaf = document.createElement('div');
        leaf.className = 'pixel-leaf';
        leaf.innerText = leafEmojis[Math.floor(Math.random() * leafEmojis.length)];
        
        leaf.style.left = Math.random() * 100 + 'vw';
        leaf.style.fontSize = (Math.random() * 12 + 16) + 'px';
        leaf.style.animationDuration = (Math.random() * 5 + 5) + 's';
        leaf.style.animationDelay = Math.random() * 2 + 's';
        
        container.appendChild(leaf);
        
        setTimeout(() => {
            leaf.remove();
        }, 10000);
    }, 600);
}

document.body.addEventListener('click', function() {
    initAudio();
});

window.onload = () => {
    renderLeaderboard();
    createFallingLeaves();
};