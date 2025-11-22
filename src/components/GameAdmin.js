// src/components/GameAdmin.js
import React, { useState } from 'react';
import GameService from '../services/api';

const GameAdmin = ({ gameId, onReset, onBack }) => {
    const [adminKey, setAdminKey] = useState('');
    const [isResetting, setIsResetting] = useState(false);

    const handleResetGame = async () => {
        if (!adminKey || adminKey !== 'admin123') { // Cambia esta clave
            alert('Clave de administrador incorrecta');
            return;
        }

        setIsResetting(true);
        try {
            const game = await GameService.getGame(gameId);
            const resetGame = {
                ...game.record,
                players: [],
                isActive: true
            };

            await GameService.updateGame(gameId, resetGame);
            alert('¡Partida reiniciada!');
            onReset();
        } catch (error) {
            alert('Error al reiniciar la partida');
            console.error(error);
        } finally {
            setIsResetting(false);
            setAdminKey('');
        }
    };

    return (
        <div className="game-admin">
            <button onClick={onBack} className="back-btn">
                ← Volver
            </button>

            <h3>Panel de Administración - Partida {gameId}</h3>
            <div className="admin-controls">
                <input
                    type="password"
                    value={adminKey}
                    onChange={(e) => setAdminKey(e.target.value)}
                    placeholder="Clave de administrador"
                />
                <button
                    onClick={handleResetGame}
                    disabled={isResetting}
                    className="reset-btn"
                >
                    {isResetting ? 'Reiniciando...' : 'Reiniciar Partida'}
                </button>
            </div>
        </div>
    );
};

export default GameAdmin;