import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';

const LoadoutsList = () => {
  const [loadouts, setLoadouts] = useState([]);
  const [games, setGames] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [selectedGame, setSelectedGame] = useState('');

  useEffect(() => {
    fetchLoadouts();
    fetchGames();
  }, [selectedGame]);

  const fetchLoadouts = async () => {
    try {
      setLoading(true);
      const url = selectedGame
        ? `/api/loadouts?game_id=${selectedGame}`
        : '/api/loadouts';
      const response = await axios.get(url);
      setLoadouts(response.data.loadouts);
      setError('');
    } catch (err) {
      setError('Failed to load loadouts');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const fetchGames = async () => {
    try {
      const response = await axios.get('/api/games');
      setGames(response.data.games);
    } catch (err) {
      console.error(err);
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Are you sure you want to delete this loadout?')) {
      return;
    }

    try {
      await axios.delete(`/api/loadouts/${id}`);
      setLoadouts(loadouts.filter(loadout => loadout.id !== id));
    } catch (err) {
      setError('Failed to delete loadout');
      console.error(err);
    }
  };

  if (loading) {
    return <div className="loading">Loading loadouts...</div>;
  }

  return (
    <div>
      <div className="list-header">
        <h1 className="list-title">My Loadouts</h1>
        <Link to="/loadouts/new" className="btn btn-primary">
          + New Loadout
        </Link>
      </div>

      {error && <div className="error">{error}</div>}

      <div className="form-group" style={{ maxWidth: '300px', marginBottom: '20px' }}>
        <label htmlFor="game-filter">Filter by Game</label>
        <select
          id="game-filter"
          value={selectedGame}
          onChange={(e) => setSelectedGame(e.target.value)}
        >
          <option value="">All Games</option>
          {games.map(game => (
            <option key={game.id} value={game.id}>
              {game.name}
            </option>
          ))}
        </select>
      </div>

      {loadouts.length === 0 ? (
        <div className="empty-state">
          <h3>No loadouts yet</h3>
          <p>Create your first loadout to get started!</p>
          <Link to="/loadouts/new" className="btn btn-primary" style={{ marginTop: '20px' }}>
            Create Loadout
          </Link>
        </div>
      ) : (
        loadouts.map(loadout => (
          <div key={loadout.id} className="card">
            <div className="card-header">
              <h3 className="card-title">{loadout.name}</h3>
              {loadout.game && (
                <span className="badge">
                  {loadout.game.name}
                </span>
              )}
            </div>
            <div className="card-content">
              {loadout.weapons && (
                <div style={{ marginBottom: '10px' }}>
                  <strong>Weapons:</strong> {loadout.weapons}
                </div>
              )}
              {loadout.abilities && (
                <div style={{ marginBottom: '10px' }}>
                  <strong>Abilities:</strong> {loadout.abilities}
                </div>
              )}
              {loadout.stats && (
                <div style={{ marginBottom: '10px' }}>
                  <strong>Stats:</strong> {loadout.stats}
                </div>
              )}
              {loadout.notes && (
                <div style={{ marginBottom: '10px', color: '#666' }}>
                  {loadout.notes.length > 200
                    ? loadout.notes.substring(0, 200) + '...'
                    : loadout.notes}
                </div>
              )}
            </div>
            <div className="card-meta">
              <span>Created: {new Date(loadout.created_at).toLocaleDateString()}</span>
              {loadout.updated_at !== loadout.created_at && (
                <span>Updated: {new Date(loadout.updated_at).toLocaleDateString()}</span>
              )}
            </div>
            <div className="card-actions">
              <Link to={`/loadouts/${loadout.id}/edit`} className="btn btn-secondary">
                Edit
              </Link>
              <button
                onClick={() => handleDelete(loadout.id)}
                className="btn btn-danger"
              >
                Delete
              </button>
            </div>
          </div>
        ))
      )}
    </div>
  );
};

export default LoadoutsList;

