// ============================================
// SORTEO - Lógica Principal (Multiplayer)
// ============================================

// Variables globales
const TOTAL_NUMBERS = 90;
let markedNumbers = new Set();
let playerId = localStorage.getItem('playerId') || generatePlayerId();
let sessionId = getSessionIdFromURL() || generateSessionId();
let playerName = localStorage.getItem('playerName') || `Jugador ${Math.floor(Math.random() * 1000)}`;
let allMarkedNumbers = {}; // { playerId: Set de números }
let participantCount = 0;

// Guardar playerId en localStorage
localStorage.setItem('playerId', playerId);
localStorage.setItem('playerName', playerName);

// Elementos del DOM
const numbersGrid = document.getElementById('numbersGrid');
const resetBtn = document.getElementById('resetBtn');
const exportBtn = document.getElementById('exportBtn');
const markedCountSpan = document.querySelector('.marked-count');
const sessionCodeSpan = document.getElementById('sessionCode');
const copyBtn = document.getElementById('copyBtn');
const participantCountSpan = document.getElementById('participantCount');
const playerInfoDiv = document.getElementById('playerInfo');
const liveIndicator = document.getElementById('liveIndicator');

// ============================================
// INICIALIZACIÓN
// ============================================

function init() {
    sessionCodeSpan.textContent = sessionId;
    createGrid();
    loadFromLocalStorage();
    updateCounter();
    attachEventListeners();
    
    // Conectar a Firebase
    connectToFirebase();
}

// ============================================
// GENERAR IDs ÚNICOS
// ============================================

function generatePlayerId() {
    return 'player_' + Date.now() + '_' + Math.random().toString(36).substr(2, 9);
}

function generateSessionId() {
    const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
    let result = '';
    for (let i = 0; i < 6; i++) {
        result += chars.charAt(Math.floor(Math.random() * chars.length));
    }
    return result;
}

function getSessionIdFromURL() {
    const params = new URLSearchParams(window.location.search);
    return params.get('session');
}

// ============================================
// CONECTAR A FIREBASE
// ============================================

function connectToFirebase() {
    if (typeof firebase === 'undefined') {
        console.warn('Firebase no configurado. Usando modo local.');
        return;
    }

    const sessionRef = database.ref(`sessions/${sessionId}`);
    const playerRef = database.ref(`sessions/${sessionId}/players/${playerId}`);

    // Registrar el jugador
    playerRef.set({
        name: playerName,
        joinedAt: firebase.database.ServerValue.TIMESTAMP,
        lastSeen: firebase.database.ServerValue.TIMESTAMP
    });

    // Escuchar cambios de números marcados
    sessionRef.child('markedNumbers').on('value', (snapshot) => {
        const data = snapshot.val();
        if (data) {
            allMarkedNumbers = data;
            updateGridFromFirebase();
        }
    });

    // Escuchar participantes
    sessionRef.child('players').on('value', (snapshot) => {
        const players = snapshot.val();
        participantCount = players ? Object.keys(players).length : 0;
        participantCountSpan.textContent = participantCount;
    });

    // Actualizar lastSeen cada 5 segundos
    setInterval(() => {
        playerRef.child('lastSeen').set(firebase.database.ServerValue.TIMESTAMP);
    }, 5000);
}

// ============================================
// CREAR GRID DE NÚMEROS
// ============================================

function createGrid() {
    numbersGrid.innerHTML = '';
    for (let i = 1; i <= TOTAL_NUMBERS; i++) {
        const numberItem = document.createElement('div');
        numberItem.classList.add('number-item');
        numberItem.textContent = i;
        numberItem.dataset.number = i;
        numberItem.setAttribute('title', `Número ${i}`);
        
        // Marcar si está en el conjunto local
        if (markedNumbers.has(i)) {
            numberItem.classList.add('marked');
        }
        
        numberItem.addEventListener('click', () => toggleNumber(i, numberItem));
        numbersGrid.appendChild(numberItem);
    }
}

// ============================================
// ALTERNAR MARCADO DE NÚMERO
// ============================================

function toggleNumber(number, element) {
    if (markedNumbers.has(number)) {
        markedNumbers.delete(number);
        element.classList.remove('marked');
    } else {
        markedNumbers.add(number);
        element.classList.add('marked');
    }
    
    updateCounter();
    saveToLocalStorage();
    syncToFirebase(number);
}

// ============================================
// SINCRONIZAR CON FIREBASE
// ============================================

function syncToFirebase(number) {
    if (typeof firebase === 'undefined') return;

    const marked = markedNumbers.has(number);
    const numberRef = database.ref(`sessions/${sessionId}/markedNumbers/${number}/${playerId}`);
    
    if (marked) {
        numberRef.set({
            playerName: playerName,
            markedAt: firebase.database.ServerValue.TIMESTAMP
        });
    } else {
        numberRef.remove();
    }
}

// ============================================
// ACTUALIZAR GRID DESDE FIREBASE
// ============================================

function updateGridFromFirebase() {
    const items = document.querySelectorAll('.number-item');
    
    items.forEach(item => {
        const number = parseInt(item.dataset.number);
        const hasMarks = allMarkedNumbers[number] && Object.keys(allMarkedNumbers[number]).length > 0;
        
        if (hasMarks) {
            item.classList.add('marked-by-others');
            
            // Mostrar quién marcó este número
            const players = Object.keys(allMarkedNumbers[number]);
            const playerNames = players.map(pid => {
                const player = allMarkedNumbers[number][pid];
                return player.playerName || 'Anónimo';
            }).join(', ');
            
            item.setAttribute('title', `Marcado por: ${playerNames}`);
        } else {
            item.classList.remove('marked-by-others');
        }
    });
}

// ============================================
// ACTUALIZAR CONTADOR
// ============================================

function updateCounter() {
    markedCountSpan.textContent = markedNumbers.size;
}

// ============================================
// REINICIAR TODOS LOS NÚMEROS
// ============================================

function reset() {
    if (confirm('¿Deseas reiniciar todos tus números marcados?')) {
        markedNumbers.clear();
        createGrid();
        updateCounter();
        saveToLocalStorage();
        
        // Limpiar en Firebase
        if (typeof firebase !== 'undefined') {
            database.ref(`sessions/${sessionId}/markedNumbers`).once('value', (snapshot) => {
                const data = snapshot.val();
                if (data) {
                    Object.keys(data).forEach(number => {
                        database.ref(`sessions/${sessionId}/markedNumbers/${number}/${playerId}`).remove();
                    });
                }
            });
        }
    }
}

// ============================================
// DESCARGAR COMO IMAGEN PNG
// ============================================

function exportAsImage() {
    const canvas = document.createElement('canvas');
    const ctx = canvas.getContext('2d');
    
    const padding = 40;
    const itemSize = 60;
    const cols = 10;
    const rows = Math.ceil(TOTAL_NUMBERS / cols);
    
    canvas.width = cols * itemSize + padding * 2;
    canvas.height = rows * itemSize + padding * 3 + 100;
    
    // Fondo blanco
    ctx.fillStyle = '#ffffff';
    ctx.fillRect(0, 0, canvas.width, canvas.height);
    
    // Título
    ctx.fillStyle = '#667eea';
    ctx.font = 'bold 32px Arial';
    ctx.textAlign = 'center';
    ctx.fillText('🎰 SORTEO - Números Marcados', canvas.width / 2, 40);
    
    // Información
    ctx.fillStyle = '#666';
    ctx.font = '18px Arial';
    ctx.fillText(`${playerName} - Marcados: ${markedNumbers.size} de ${TOTAL_NUMBERS}`, canvas.width / 2, 70);
    
    // Línea decorativa
    ctx.strokeStyle = '#667eea';
    ctx.lineWidth = 2;
    ctx.beginPath();
    ctx.moveTo(padding, 85);
    ctx.lineTo(canvas.width - padding, 85);
    ctx.stroke();
    
    // Dibujar números
    let index = 0;
    for (let row = 0; row < rows; row++) {
        for (let col = 0; col < cols; col++) {
            if (index >= TOTAL_NUMBERS) break;
            
            const number = index + 1;
            const x = padding + col * itemSize;
            const y = padding + 100 + row * itemSize;
            
            if (markedNumbers.has(number)) {
                const gradient = ctx.createLinearGradient(x, y, x + itemSize, y + itemSize);
                gradient.addColorStop(0, '#f093fb');
                gradient.addColorStop(1, '#f5576c');
                ctx.fillStyle = gradient;
                ctx.strokeStyle = '#ff6b9d';
                ctx.lineWidth = 2;
            } else {
                const gradient = ctx.createLinearGradient(x, y, x + itemSize, y + itemSize);
                gradient.addColorStop(0, '#667eea');
                gradient.addColorStop(1, '#764ba2');
                ctx.fillStyle = gradient;
                ctx.strokeStyle = '#5568d3';
                ctx.lineWidth = 1;
            }
            
            ctx.beginPath();
            ctx.roundRect(x, y, itemSize - 5, itemSize - 5, 8);
            ctx.fill();
            ctx.stroke();
            
            ctx.fillStyle = '#ffffff';
            ctx.font = 'bold 20px Arial';
            ctx.textAlign = 'center';
            ctx.textBaseline = 'middle';
            ctx.fillText(number, x + (itemSize - 5) / 2, y + (itemSize - 5) / 2);
            
            if (markedNumbers.has(number)) {
                ctx.fillStyle = '#ffffff';
                ctx.font = 'bold 18px Arial';
                ctx.fillText('✓', x + (itemSize - 5) / 2 + 12, y + (itemSize - 5) / 2 - 8);
            }
            
            index++;
        }
    }
    
    const link = document.createElement('a');
    link.href = canvas.toDataURL('image/png');
    link.download = `sorteo-${playerName}-${formatDate(new Date())}.png`;
    link.click();
}

// ============================================
// POLYFILL PARA ROUNDRECT
// ============================================

if (!CanvasRenderingContext2D.prototype.roundRect) {
    CanvasRenderingContext2D.prototype.roundRect = function(x, y, w, h, r) {
        if (w < 2 * r) r = w / 2;
        if (h < 2 * r) r = h / 2;
        this.beginPath();
        this.moveTo(x + r, y);
        this.arcTo(x + w, y, x + w, y + h, r);
        this.arcTo(x + w, y + h, x, y + h, r);
        this.arcTo(x, y + h, x, y, r);
        this.arcTo(x, y, x + w, y, r);
        this.closePath();
    };
}

// ============================================
// LOCALSTORAGE
// ============================================

function saveToLocalStorage() {
    const data = Array.from(markedNumbers);
    localStorage.setItem(`sorteo_${sessionId}_numbers`, JSON.stringify(data));
    localStorage.setItem(`sorteo_${sessionId}_timestamp`, new Date().toISOString());
}

function loadFromLocalStorage() {
    const data = localStorage.getItem(`sorteo_${sessionId}_numbers`);
    if (data) {
        try {
            markedNumbers = new Set(JSON.parse(data).map(n => parseInt(n)));
        } catch (e) {
            console.error('Error cargando datos:', e);
            markedNumbers = new Set();
        }
    }
}

// ============================================
// UTILIDADES
// ============================================

function formatDate(date) {
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const day = String(date.getDate()).padStart(2, '0');
    const hours = String(date.getHours()).padStart(2, '0');
    const minutes = String(date.getMinutes()).padStart(2, '0');
    return `${year}-${month}-${day}_${hours}-${minutes}`;
}

// ============================================
// COPIAR CÓDIGO DE SESIÓN
// ============================================

function copySessionCode() {
    const url = `${window.location.origin}${window.location.pathname}?session=${sessionId}`;
    navigator.clipboard.writeText(url).then(() => {
        copyBtn.textContent = '✅';
        setTimeout(() => {
            copyBtn.textContent = '📋';
        }, 2000);
    });
}

// ============================================
// EVENT LISTENERS
// ============================================

function attachEventListeners() {
    resetBtn.addEventListener('click', reset);
    exportBtn.addEventListener('click', exportAsImage);
    copyBtn.addEventListener('click', copySessionCode);
}

// ============================================
// INICIAR APLICACIÓN
// ============================================

document.addEventListener('DOMContentLoaded', init);
