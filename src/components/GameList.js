// src/components/GameList.js
import React, { useState, useEffect } from 'react';
import GameService from '../services/api';

const GameList = ({ onSelectGame }) => {
    const [games, setGames] = useState({});
    const [isLoading, setIsLoading] = useState(true);

    const loadGames = async () => {
        try {
            const allGames = await GameService.getAllGames();
            setGames(allGames);
        } catch (error) {
            console.error('Error loading games:', error);
            alert('Error al cargar las partidas');
        } finally {
            setIsLoading(false);
        }
    };

    useEffect(() => {
        loadGames();
    }, []);

    const getAvailableSlots = (game) => {
        const totalSlots = game.participants.length;
        const usedSlots = game.players.length;
        return totalSlots - usedSlots;
    };

    const formatDate = (dateString) => {
        return new Date(dateString).toLocaleDateString('es-ES', {
            day: '2-digit',
            month: '2-digit',
            hour: '2-digit',
            minute: '2-digit'
        });
    };

    if (isLoading) {
        return <div>Cargando partidas...</div>;
    }

    const activeGames = Object.values(games).filter(game => game.isActive);

    return (
        <div className="game-list">
            <h2>Partidas Disponibles</h2>

            {activeGames.length === 0 ? (
                <div className="no-games">
                    <p>No hay partidas disponibles</p>
                    <button onClick={() => onSelectGame('create')}>
                        Crear Primera Partida
                    </button>
                </div>
            ) : (
                <div className="games-grid">
                    {activeGames.map(game => (
                        <div key={game.id} className="game-card">
                            <h3>{game.name}</h3>
                            <div className="game-info">
                                <p><strong>ID:</strong> {game.id}</p>
                                <p><strong>Jugadores:</strong> {game.players.length}/{game.participants.length}</p>
                                <p><strong>Creada:</strong> {formatDate(game.createdAt)}</p>
                                <p><strong>Creador:</strong> {game.createdBy}</p>
                            </div>

                            {getAvailableSlots(game) > 0 ? (
                                <button
                                    onClick={() => onSelectGame(game.id)}
                                    className="join-game-btn"
                                >
                                    Unirse ({getAvailableSlots(game)} plazas libres)
                                </button>
                            ) : (
                                <button disabled className="full-game-btn">
                                    Partida Llena
                                </button>
                            )}
                        </div>
                    ))}
                </div>
            )}

            <div className="game-list-actions">
                <button onClick={loadGames} className="refresh-btn">
                    Actualizar Lista
                </button>
                <button onClick={() => onSelectGame('create')} className="create-new-btn">
                    Crear Nueva Partida
                </button>
            </div>
        </div>
    );
};

export default GameList;