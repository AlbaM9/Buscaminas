// Configuración del juego
const numRows = 10;
const numCols = 10;
const numMines = 20;
const gameContainer = document.getElementById('game-container');
let board = [];
let mines = [];

// Función para inicializar el tablero
function initBoard() {
    gameContainer.style.gridTemplateColumns = `repeat(${numCols}, 30px)`;
    gameContainer.style.gridTemplateRows = `repeat(${numRows}, 30px)`;
    board = [];
    mines = [];

    // Crear el tablero vacío
    for (let row = 0; row < numRows; row++) {
        board[row] = [];
        for (let col = 0; col < numCols; col++) {
            const cell = document.createElement('div');
            cell.className = 'cell';
            cell.dataset.row = row;
            cell.dataset.col = col;

            // Manejar el clic izquierdo
            cell.addEventListener('click', () => revealCell(row, col));

            // Manejar el clic derecho
            cell.addEventListener('contextmenu', (e) => {
                e.preventDefault(); // Esto debería prevenir el menú contextual
                toggleFlag(cell, row, col);
            });

            gameContainer.appendChild(cell);
            board[row][col] = {
                revealed: false,
                mine: false,
                flagged: false,
                adjacentMines: 0
            };
        }
    }

    // Colocar minas
    let minesPlaced = 0;
    while (minesPlaced < numMines) {
        const row = Math.floor(Math.random() * numRows);
        const col = Math.floor(Math.random() * numCols);
        if (!board[row][col].mine) {
            board[row][col].mine = true;
            mines.push({ row, col });
            minesPlaced++;
        }
    }

    // Calcular números de minas adyacentes
    for (const { row, col } of mines) {
        for (let r = row - 1; r <= row + 1; r++) {
            for (let c = col - 1; c <= col + 1; c++) {
                if (r >= 0 && r < numRows && c >= 0 && c < numCols && !board[r][c].mine) {
                    board[r][c].adjacentMines++;
                }
            }
        }
    }
}

// Función para revelar una celda
function revealCell(row, col) {
    const cell = document.querySelector(`.cell[data-row='${row}'][data-col='${col}']`);
    if (board[row][col].revealed || board[row][col].flagged) return; // No revelar si está marcado con una bandera
    board[row][col].revealed = true;
    cell.classList.add('revealed');

    if (board[row][col].mine) {
        cell.classList.add('mine');
        alert('¡Game Over!');
        return;
    }

    if (board[row][col].adjacentMines > 0) {
        cell.textContent = board[row][col].adjacentMines;
        cell.classList.add('number');
    } else {
        // Si no hay minas adyacentes, revelar celdas adyacentes
        for (let r = row - 1; r <= row + 1; r++) {
            for (let c = col - 1; c <= col + 1; c++) {
                if (r >= 0 && r < numRows && c >= 0 && c < numCols) {
                    revealCell(r, c);
                }
            }
        }
    }
}

// Función para alternar bandera en una celda
function toggleFlag(cell, row, col) {
    if (board[row][col].revealed) return; // No marcar si ya está revelado

    board[row][col].flagged = !board[row][col].flagged;
    if (board[row][col].flagged) {
        cell.classList.add('flagged');
        // Aquí puedes agregar una imagen de una bandera, por ejemplo:
        cell.textContent = '🚩';
    } else {
        cell.classList.remove('flagged');
        cell.textContent = ''; // Quitar el texto de la bandera
    }
}

// Inicializar el tablero al cargar la página
initBoard();
