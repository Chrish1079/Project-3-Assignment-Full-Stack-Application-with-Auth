import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';

const GamesList = () => {
  const [games, setGames] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    fetchGames();
  }, []);

  const fetchGames = async () => {
    try {
      setLoading(true);
      const response = await axios.get('/api/games');
      setGames(response.data.games);
      setError('');
    } catch (err) {
      setError('Failed to load games');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Are you sure you want to delete this game? All loadouts for this game will also be deleted.')) {
      return;
    }

    try {
      await axios.delete(`/api/games/${id}`);
      setGames(games.filter(game => game.id !== id));
    } catch (err) {
      setError('Failed to delete game');
      console.error(err);
    }
  };

  if (loading) {
    return <div className="loading">Loading games...</div>;
  }

  return (
    <div>
      <div className="list-header">
        <h1 className="list-title">My Games</h1>
        <Link to="/games/new" className="btn btn-primary">
          + New Game
        </Link>
      </div>

      {error && <div className="error">{error}</div>}

      {games.length === 0 ? (
        <div className="empty-state">
          <h3>No games yet</h3>
          <p>Add your first game to start creating loadouts!</p>
          <Link to="/games/new" className="btn btn-primary" style={{ marginTop: '20px' }}>
            Add Game
          </Link>
        </div>
      ) : (
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(250px, 1fr))', gap: '20px' }}>
          {games.map(game => (
            <div key={game.id} className="card">
              <div className="card-header">
                <h3 className="card-title">{game.name}</h3>
                {game.genre && (
                  <span className="badge">{game.genre}</span>
                )}
              </div>
              <div className="card-meta">
                <span>Added: {new Date(game.created_at).toLocaleDateString()}</span>
              </div>
              <div className="card-actions">
                <Link to={`/games/${game.id}/edit`} className="btn btn-secondary">
                  Edit
                </Link>
                <button
                  onClick={() => handleDelete(game.id)}
                  className="btn btn-danger"
                >
                  Delete
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default GamesList;

