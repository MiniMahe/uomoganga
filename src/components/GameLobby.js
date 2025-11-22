// src/components/GameLobby.js
import React, { useState, useEffect } from 'react';
import GameService from '../services/api';

const GameLobby = ({ gameId, onJoinGame, onBack }) => {
    const [playerName, setPlayerName] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const [gameInfo, setGameInfo] = useState(null);
    const [message, setMessage] = useState('');

    // Cargar la partida automáticamente al montar el componente
    useEffect(() => {
        loadGame();
    }, [gameId]);

    const loadGame = async () => {
        if (!gameId) return;

        setIsLoading(true);
        try {
            const game = await GameService.getGame(gameId);
            setGameInfo(game);
            setMessage('');
        } catch (error) {
            setMessage('Error al cargar la partida');
            console.error(error);
        } finally {
            setIsLoading(false);
        }
    };

    const handleJoinGame = async () => {
        if (!playerName.trim()) {
            setMessage('Ingresa tu nombre');
            return;
        }

        if (!gameInfo) {
            setMessage('Partida no encontrada');
            return;
        }

        // Verificar si el nombre ya está en uso
        if (gameInfo.players?.some(player => player.name === playerName.trim())) {
            setMessage('Este nombre ya está en uso en esta partida');
            return;
        }

        setIsLoading(true);
        setMessage('');

        try {
            // Generar asignación aleatoria única
            const availableParticipants = gameInfo.participants?.filter(p =>
                !gameInfo.players?.some(player => player.participant === p)
            ) || [];

            const availableObjects = gameInfo.objects?.filter(o =>
                !gameInfo.players?.some(player => player.object === o)
            ) || [];

            const availableLocations = gameInfo.locations?.filter(l =>
                !gameInfo.players?.some(player => player.location === l)
            ) || [];

            console.log('Disponibles:', {
                participants: availableParticipants,
                objects: availableObjects,
                locations: availableLocations
            });

            // Verificar que hay suficientes elementos disponibles
            if (availableParticipants.length === 0 || availableObjects.length === 0 || availableLocations.length === 0) {
                setMessage('No hay más asignaciones disponibles en esta partida');
                return;
            }

            // Seleccionar aleatoriamente
            const randomParticipant = availableParticipants[Math.floor(Math.random() * availableParticipants.length)];
            const randomObject = availableObjects[Math.floor(Math.random() * availableObjects.length)];
            const randomLocation = availableLocations[Math.floor(Math.random() * availableLocations.length)];

            const newPlayer = {
                id: Date.now().toString(),
                name: playerName.trim(),
                participant: randomParticipant,
                object: randomObject,
                location: randomLocation,
                joinedAt: new Date().toISOString()
            };

            console.log('Nuevo jugador:', newPlayer);

            // Actualizar la partida en la base de datos
            const updatedGame = {
                ...gameInfo,
                players: [...(gameInfo.players || []), newPlayer]
            };

            await GameService.updateGame(gameId, updatedGame);

            // Pasar el jugador al componente padre
            onJoinGame(newPlayer);

        } catch (error) {
            setMessage('Error al unirse a la partida');
            console.error('Error completo:', error);
        } finally {
            setIsLoading(false);
        }
    };

    const getAvailableSlots = () => {
        if (!gameInfo) return 0;
        const total = gameInfo.participants?.length || 0;
        const used = gameInfo.players?.length || 0;
        return total - used;
    };

    return (
        <div className="game-lobby">
            <button onClick={onBack} className="back-btn">
                ← Salir del Lobby
            </button>


            <h2>Unirse a Partida</h2>
            <p><strong>ID de Partida:</strong> {gameId}</p>

            {gameInfo && (
                <div className="game-info">
                    <h3>{gameInfo.name}</h3>
                    <p><strong>Plazas libres:</strong> {getAvailableSlots()} de {gameInfo.participants?.length}</p>
                    <p><strong>Jugadores actuales:</strong> {gameInfo.players?.length || 0}</p>
                </div>
            )}

            <div className="join-form">
                <div className="input-group">
                    <input
                        type="text"
                        value={playerName}
                        onChange={(e) => setPlayerName(e.target.value)}
                        placeholder="Tu nombre"
                        disabled={isLoading}
                    />
                </div>

                {message && (
                    <div className="message">{message}</div>
                )}

                <button
                    onClick={handleJoinGame}
                    disabled={isLoading || getAvailableSlots() === 0}
                    className="join-btn"
                >
                    {isLoading ? 'Uniéndose...' : `Unirse a Partida (${getAvailableSlots()} libres)`}
                </button>
            </div>

            <button onClick={loadGame} disabled={isLoading} className="refresh-btn">
                Actualizar Información
            </button>
        </div>
    );
};

export default GameLobby;