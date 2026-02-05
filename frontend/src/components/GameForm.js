import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import axios from 'axios';

const GameForm = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const isEdit = !!id;

  const [formData, setFormData] = useState({
    name: '',
    genre: ''
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const genres = [
    'RPG',
    'Shooter',
    'Action',
    'Strategy',
    'Sports',
    'Racing',
    'Fighting',
    'MMO',
    'MOBA',
    'Other'
  ];

  useEffect(() => {
    if (isEdit) {
      fetchGame();
    }
  }, [id]);

  const fetchGame = async () => {
    try {
      const response = await axios.get(`/api/games/${id}`);
      const game = response.data.game;
      setFormData({
        name: game.name,
        genre: game.genre || ''
      });
    } catch (err) {
      setError('Failed to load game');
      console.error(err);
    }
  };

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
    setError('');
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      if (isEdit) {
        await axios.put(`/api/games/${id}`, formData);
      } else {
        await axios.post('/api/games', formData);
      }

      navigate('/games');
    } catch (err) {
      setError(err.response?.data?.error || 'Failed to save game');
      setLoading(false);
    }
  };

  return (
    <div className="form-container">
      <h2>{isEdit ? 'Edit Game' : 'Add New Game'}</h2>
      {error && <div className="error">{error}</div>}
      <form onSubmit={handleSubmit}>
        <div className="form-group">
          <label htmlFor="name">Game Name *</label>
          <input
            type="text"
            id="name"
            name="name"
            value={formData.name}
            onChange={handleChange}
            required
            autoFocus
            placeholder="e.g., Call of Duty, Elden Ring"
          />
        </div>
        <div className="form-group">
          <label htmlFor="genre">Genre</label>
          <select
            id="genre"
            name="genre"
            value={formData.genre}
            onChange={handleChange}
          >
            <option value="">Select a genre (optional)</option>
            {genres.map(genre => (
              <option key={genre} value={genre}>
                {genre}
              </option>
            ))}
          </select>
        </div>
        <div className="btn-group">
          <button type="submit" className="btn btn-primary" disabled={loading}>
            {loading ? 'Saving...' : isEdit ? 'Update Game' : 'Add Game'}
          </button>
          <button
            type="button"
            onClick={() => navigate('/games')}
            className="btn btn-secondary"
          >
            Cancel
          </button>
        </div>
      </form>
    </div>
  );
};

export default GameForm;

