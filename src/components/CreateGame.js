// src/components/CreateGame.js
import React, { useState } from 'react';
import GameService from '../services/api';

const CreateGame = ({ onGameCreated }) => {
    const [gameData, setGameData] = useState({
        name: '',
        participants: [''],
        objects: [''],
        locations: [''],
        createdBy: ''
    });
    const [isCreating, setIsCreating] = useState(false);

    const addItem = (field) => {
        setGameData(prev => ({
            ...prev,
            [field]: [...prev[field], '']
        }));
    };

    const updateItem = (field, index, value) => {
        setGameData(prev => ({
            ...prev,
            [field]: prev[field].map((item, i) => i === index ? value : item)
        }));
    };

    const removeItem = (field, index) => {
        setGameData(prev => ({
            ...prev,
            [field]: prev[field].filter((_, i) => i !== index)
        }));
    };

    const handleCreateGame = async () => {
        const validParticipants = gameData.participants.filter(p => p.trim() !== '');
        const validObjects = gameData.objects.filter(o => o.trim() !== '');
        const validLocations = gameData.locations.filter(l => l.trim() !== '');

        if (validParticipants.length === 0 || validObjects.length === 0 || validLocations.length === 0) {
            alert('Debe haber al menos un participante, objeto y ubicación');
            return;
        }

        setIsCreating(true);
        try {
            const game = {
                participants: validParticipants,
                objects: validObjects,
                locations: validLocations,
                players: [],
                createdAt: new Date().toISOString(),
                isActive: true
            };

            const result = await GameService.createGame(game);
            const gameId = result.metadata.id;

            alert(`¡Partida creada! ID de la partida: ${gameId}`);
            onGameCreated(gameId);
        } catch (error) {
            alert('Error al crear la partida');
            console.error(error);
        } finally {
            setIsCreating(false);
        }
    };

    return (
        <div className="create-game">
            <h2>Crear Nueva Partida</h2>

            <div className="form-section">
                <h3>Participantes</h3>
                {gameData.participants.map((participant, index) => (
                    <div key={index} className="input-group">
                        <input
                            type="text"
                            value={participant}
                            onChange={(e) => updateItem('participants', index, e.target.value)}
                            placeholder={`Participante ${index + 1}`}
                        />
                        {gameData.participants.length > 1 && (
                            <button onClick={() => removeItem('participants', index)}>×</button>
                        )}
                    </div>
                ))}
                <button onClick={() => addItem('participants')}>+ Agregar Participante</button>
            </div>

            <div className="form-section">
                <h3>Objetos</h3>
                {gameData.objects.map((object, index) => (
                    <div key={index} className="input-group">
                        <input
                            type="text"
                            value={object}
                            onChange={(e) => updateItem('objects', index, e.target.value)}
                            placeholder={`Objeto ${index + 1}`}
                        />
                        {gameData.objects.length > 1 && (
                            <button onClick={() => removeItem('objects', index)}>×</button>
                        )}
                    </div>
                ))}
                <button onClick={() => addItem('objects')}>+ Agregar Objeto</button>
            </div>

            <div className="form-section">
                <h3>Ubicaciones</h3>
                {gameData.locations.map((location, index) => (
                    <div key={index} className="input-group">
                        <input
                            type="text"
                            value={location}
                            onChange={(e) => updateItem('locations', index, e.target.value)}
                            placeholder={`Ubicación ${index + 1}`}
                        />
                        {gameData.locations.length > 1 && (
                            <button onClick={() => removeItem('locations', index)}>×</button>
                        )}
                    </div>
                ))}
                <button onClick={() => addItem('locations')}>+ Agregar Ubicación</button>
            </div>

            <div className="form-section">
                <h3>Información de la Partida</h3>
                <div className="input-group">
                    <input
                        type="text"
                        value={gameData.name}
                        onChange={(e) => setGameData(prev => ({ ...prev, name: e.target.value }))}
                        placeholder="Nombre de la partida (ej: 'Fiesta Cumpleaños')"
                    />
                </div>
                <div className="input-group">
                    <input
                        type="text"
                        value={gameData.createdBy}
                        onChange={(e) => setGameData(prev => ({ ...prev, createdBy: e.target.value }))}
                        placeholder="Tu nombre (creador)"
                    />
                </div>
            </div>

            <button
                onClick={handleCreateGame}
                disabled={isCreating}
                className="create-btn"
            >
                {isCreating ? 'Creando...' : 'Crear Partida'}
            </button>
        </div>
    );
};

export default CreateGame;