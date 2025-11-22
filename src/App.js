import React, { useState } from 'react';
import './App.css';
import GameAdmin from './components/GameAdmin';
import PlayerView from './components/PlayerView';
import GameLobby from './components/GameLobby';
import CreateGame from './components/CreateGame';
import GameList from './components/GameList';

// App.js actualizado
function App() {
  const [currentGameId, setCurrentGameId] = useState('');
  const [currentPlayer, setCurrentPlayer] = useState(null);
  const [view, setView] = useState('list'); // 'list', 'create', 'join', 'play', 'admin'

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
    setView('list');
  };

  return (
    <div className="App">
      <header className="app-header">
        <h1>🎮 Juego de Asignaciones Secretas</h1>
        <nav className="app-nav">
          <button onClick={() => setView('list')}>Partidas</button>
          <button onClick={() => setView('create')}>Crear</button>
          <button onClick={() => setView('admin')}>Admin</button>
        </nav>
      </header>

      <main className="app-main">
        {view === 'list' && (
          <GameList onSelectGame={handleSelectGame} />
        )}

        {view === 'create' && (
          <CreateGame onGameCreated={handleGameCreated} />
        )}

        {view === 'join' && currentGameId && (
          <GameLobby
            gameId={currentGameId}
            onJoinGame={handleJoinGame}
            onBack={() => setView('list')}
          />
        )}

        {view === 'play' && currentPlayer && (
          <PlayerView
            player={currentPlayer}
            onBack={() => setView('list')}
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
              />
            )}
          </div>
        )}
      </main>
    </div>
  );
}

export default App;
