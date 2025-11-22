// src/services/api.js
class GameService {
    constructor() {
        // Create React App usa process.env
        this.BIN_ID = process.env.REACT_APP_JSONBIN_BIN_ID;
        this.API_KEY = process.env.REACT_APP_JSONBIN_API_KEY;

        this.baseURL = 'https://api.jsonbin.io/v3/b';
        this.headers = {
            'Content-Type': 'application/json',
            'X-Master-Key': this.API_KEY,
        };

        console.log('🔧 Configuración API:', {
            binId: this.BIN_ID ? '✅ Configurado' : '❌ Faltante',
            apiKey: this.API_KEY ? '✅ Configurado' : '❌ Faltante',
            nodeEnv: process.env.NODE_ENV
        });
    }

    async createGame(gameData) {
        try {
            if (!this.validateConfig()) {
                throw new Error('Configuración de API no válida');
            }

            const existingGames = await this.getAllGames();
            const gameId = this.generateSimpleId();
            const gameName = gameData.name || `Partida ${gameId}`;

            const newGame = {
                id: gameId,
                name: gameName,
                participants: gameData.participants,
                objects: gameData.objects,
                locations: gameData.locations,
                players: [],
                createdAt: new Date().toISOString(),
                isActive: true,
                createdBy: gameData.createdBy || 'Admin'
            };

            existingGames[gameId] = newGame;

            const response = await fetch(`${this.baseURL}/${this.BIN_ID}`, {
                method: 'PUT',
                headers: this.headers,
                body: JSON.stringify(existingGames),
            });

            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }

            const result = await response.json();
            return { gameId, metadata: result.metadata };

        } catch (error) {
            console.error('Error creating game:', error);
            throw error;
        }
    }

    async getAllGames() {
        try {
            if (!this.validateConfig()) {
                throw new Error('Configuración de API no válida');
            }

            const response = await fetch(`${this.baseURL}/${this.BIN_ID}/latest`, {
                method: 'GET',
                headers: this.headers,
            });

            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }

            const result = await response.json();
            return result.record || {};
        } catch (error) {
            console.error('Error fetching games:', error);
            throw error;
        }
    }

    async getGame(gameId) {
        try {
            if (!this.validateConfig()) {
                throw new Error('Configuración de API no válida');
            }

            const games = await this.getAllGames();
            const game = games[gameId];

            if (!game) {
                throw new Error('Game not found');
            }

            return game;
        } catch (error) {
            console.error('Error fetching game:', error);
            throw error;
        }
    }

    async updateGame(gameId, gameData) {
        try {
            if (!this.validateConfig()) {
                throw new Error('Configuración de API no válida');
            }

            const games = await this.getAllGames();

            games[gameId] = {
                ...games[gameId],
                ...gameData
            };

            const response = await fetch(`${this.baseURL}/${this.BIN_ID}`, {
                method: 'PUT',
                headers: this.headers,
                body: JSON.stringify(games),
            });

            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }

            return await response.json();
        } catch (error) {
            console.error('Error updating game:', error);
            throw error;
        }
    }

    validateConfig() {
        if (!this.BIN_ID || !this.API_KEY) {
            console.error('❌ Configuración incompleta. Verifica las variables de entorno.');
            console.error('❌ REACT_APP_JSONBIN_BIN_ID:', this.BIN_ID);
            console.error('❌ REACT_APP_JSONBIN_API_KEY:', this.API_KEY);
            return false;
        }
        return true;
    }

    generateSimpleId() {
        const letters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ';
        const numbers = '0123456789';

        const randomLetter = () => letters[Math.floor(Math.random() * letters.length)];
        const randomNumber = () => numbers[Math.floor(Math.random() * numbers.length)];

        return `${randomLetter()}${randomLetter()}${randomLetter()}${randomNumber()}${randomNumber()}${randomNumber()}`;
    }
}

export default new GameService();