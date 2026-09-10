// Variables globales
const TOTAL_NUMBERS = 90;
let markedNumbers = new Set();

// Elementos del DOM
const numbersGrid = document.getElementById('numbersGrid');
const resetBtn = document.getElementById('resetBtn');
const exportBtn = document.getElementById('exportBtn');
const markedCountSpan = document.querySelector('.marked-count');
const totalCountSpan = document.querySelector('.total-count');

// Inicializar
function init() {
    createGrid();
    loadFromLocalStorage();
    updateCounter();
    attachEventListeners();
}

// Crear grid de números
function createGrid() {
    numbersGrid.innerHTML = '';
    for (let i = 1; i <= TOTAL_NUMBERS; i++) {
        const numberItem = document.createElement('div');
        numberItem.classList.add('number-item');
        numberItem.textContent = i;
        numberItem.dataset.number = i;
        
        // Marcar si está en el conjunto
        if (markedNumbers.has(i)) {
            numberItem.classList.add('marked');
        }
        
        numberItem.addEventListener('click', () => toggleNumber(i, numberItem));
        numbersGrid.appendChild(numberItem);
    }
}

// Alternar marcado de número
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
}

// Actualizar contador
function updateCounter() {
    markedCountSpan.textContent = markedNumbers.size;
}

// Reiniciar
function reset() {
    if (confirm('¿Deseas reiniciar todos los números marcados?')) {
        markedNumbers.clear();
        createGrid();
        updateCounter();
        saveToLocalStorage();
    }
}

// Descargar como imagen
function exportAsImage() {
    const canvas = document.createElement('canvas');
    const ctx = canvas.getContext('2d');
    
    // Configurar canvas
    const padding = 40;
    const itemSize = 60;
    const cols = 10;
    const rows = Math.ceil(TOTAL_NUMBERS / cols);
    
    canvas.width = cols * itemSize + padding * 2;
    canvas.height = rows * itemSize + padding * 3 + 60; // Extra espacio para título
    
    // Fondo
    ctx.fillStyle = '#ffffff';
    ctx.fillRect(0, 0, canvas.width, canvas.height);
    
    // Título
    ctx.fillStyle = '#667eea';
    ctx.font = 'bold 30px Arial';
    ctx.textAlign = 'center';
    ctx.fillText('SORTEO - Números Marcados', canvas.width / 2, 40);
    
    // Información
    ctx.fillStyle = '#666';
    ctx.font = '16px Arial';
    ctx.fillText(`Marcados: ${markedNumbers.size} de ${TOTAL_NUMBERS}`, canvas.width / 2, 65);
    
    // Dibujar números
    let index = 0;
    for (let row = 0; row < rows; row++) {
        for (let col = 0; col < cols; col++) {
            if (index >= TOTAL_NUMBERS) break;
            
            const number = index + 1;
            const x = padding + col * itemSize;
            const y = padding + 80 + row * itemSize;
            
            // Fondo del número
            if (markedNumbers.has(number)) {
                // Gradiente para marcados
                const gradient = ctx.createLinearGradient(x, y, x + itemSize, y + itemSize);
                gradient.addColorStop(0, '#f093fb');
                gradient.addColorStop(1, '#f5576c');
                ctx.fillStyle = gradient;
                ctx.strokeStyle = '#ff6b9d';
                ctx.lineWidth = 2;
            } else {
                // Gradiente para no marcados
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
            
            // Número
            ctx.fillStyle = '#ffffff';
            ctx.font = 'bold 20px Arial';
            ctx.textAlign = 'center';
            ctx.textBaseline = 'middle';
            ctx.fillText(number, x + (itemSize - 5) / 2, y + (itemSize - 5) / 2);
            
            // Checkmark si está marcado
            if (markedNumbers.has(number)) {
                ctx.fillStyle = '#ffffff';
                ctx.font = 'bold 16px Arial';
                ctx.fillText('✓', x + (itemSize - 5) / 2 + 12, y + (itemSize - 5) / 2 - 5);
            }
            
            index++;
        }
    }
    
    // Descargar
    const link = document.createElement('a');
    link.href = canvas.toDataURL('image/png');
    link.download = `sorteo-${new Date().toLocaleDateString()}.png`;
    link.click();
}

// Polyfill para roundRect si no existe
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

// LocalStorage
function saveToLocalStorage() {
    const data = Array.from(markedNumbers);
    localStorage.setItem('sorteoMarkedNumbers', JSON.stringify(data));
    localStorage.setItem('sorteoTimestamp', new Date().toISOString());
}

function loadFromLocalStorage() {
    const data = localStorage.getItem('sorteoMarkedNumbers');
    if (data) {
        markedNumbers = new Set(JSON.parse(data));
    }
}

// Event Listeners
function attachEventListeners() {
    resetBtn.addEventListener('click', reset);
    exportBtn.addEventListener('click', exportAsImage);
}

// Iniciar aplicación
init();