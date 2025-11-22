// src/components/PlayerView.js
import React from 'react';

const PlayerView = ({ player }) => {
    if (!player) return null;

    return (
        <div className="player-view">
            <h2>¡Bienvenido {player.name}!</h2>
            <div className="assignment-card">
                <h3>Tu Asignación Secreta</h3>
                <div className="assignment-item">
                    <strong>Participante:</strong> {player.participant}
                </div>
                <div className="assignment-item">
                    <strong>Objeto:</strong> {player.object}
                </div>
                <div className="assignment-item">
                    <strong>Ubicación:</strong> {player.location}
                </div>
            </div>
            <div className="instructions">
                <p>⚠️ Esta información es solo para ti. No la compartas con otros jugadores.</p>
            </div>
        </div>
    );
};

export default PlayerView;