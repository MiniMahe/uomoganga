// src/App.js
import React, { useState } from 'react';
import CreateGame from './components/CreateGame';
import GameLobby from './components/GameLobby';
import PlayerView from './components/PlayerView';
import GameAdmin from './components/GameAdmin';
import GameList from './components/GameList';
import ConfigChecker from './components/ConfigChecker';
import './App.css';

function App() {
  const [currentGameId, setCurrentGameId] = useState('');
  const [currentPlayer, setCurrentPlayer] = useState(null);
  const [view, setView] = useState('list');

  const handleGameCreated = (gameId) => {
    setCurrentGameId(gameId);
    setView('join');
  };

  const handleJoinGame = (player) => {
    setCurrentPlayer(player);
    setView('play');
  };

  const handleSelectGame = (gameId) => {
    if (gameId === 'create') {
      setView('create');
    } else {
      setCurrentGameId(gameId);
      setView('join');
    }
  };

  const handleResetGame = () => {
    setCurrentPlayer(null);
    setCurrentGameId('');
    setView('list');
  };

  const handleExitGame = () => {
    setCurrentPlayer(null);
    setCurrentGameId('');
    setView('list');
  };

  // Determinar si estamos en una vista de juego (donde ocultamos el menú)
  const isInGameView = view === 'join' || view === 'play';

  return (
    <div className="App">
      <ConfigChecker />

      {/* Mostrar header solo si NO estamos en vista de juego */}
      {!isInGameView && (
        <header className="app-header">
          <h1>🎮 Juego de Asignaciones Secretas</h1>
          <nav className="app-nav">
            <button onClick={() => setView('list')}>Partidas</button>
            <button onClick={() => setView('create')}>Crear</button>
            <button onClick={() => setView('admin')}>Admin</button>
          </nav>
        </header>
      )}

      <main className={`app-main ${isInGameView ? 'game-view' : ''}`}>
        {view === 'list' && (
          <GameList onSelectGame={handleSelectGame} />
        )}

        {view === 'create' && (
          <CreateGame
            onGameCreated={handleGameCreated}
            onBack={() => setView('list')}
          />
        )}

        {view === 'join' && currentGameId && (
          <GameLobby
            gameId={currentGameId}
            onJoinGame={handleJoinGame}
            onBack={handleExitGame}
          />
        )}

        {view === 'play' && currentPlayer && (
          <PlayerView
            player={currentPlayer}
            onBack={handleExitGame}
          />
        )}

        {view === 'admin' && (
          <div className="admin-section">
            <h2>Administración</h2>
            <p>Ingresa el ID de la partida para administrar:</p>
            <input
              type="text"
              placeholder="ID de partida (ej: ABC123)"
              value={currentGameId}
              onChange={(e) => setCurrentGameId(e.target.value)}
            />
            {currentGameId && (
              <GameAdmin
                gameId={currentGameId}
                onReset={handleResetGame}
                onBack={() => setView('list')}
              />
            )}
            <button onClick={() => setView('list')} className="back-btn">
              ← Volver a Partidas
            </button>
          </div>
        )}
      </main>
    </div>
  );
}

export default App;