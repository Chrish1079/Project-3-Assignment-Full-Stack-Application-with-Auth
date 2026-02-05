import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import axios from 'axios';

const LoadoutForm = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const isEdit = !!id;

  const [formData, setFormData] = useState({
    name: '',
    weapons: '',
    abilities: '',
    stats: '',
    notes: '',
    game_id: ''
  });
  const [games, setGames] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    fetchGames();
    if (isEdit) {
      fetchLoadout();
    }
  }, [id]);

  const fetchLoadout = async () => {
    try {
      const response = await axios.get(`/api/loadouts/${id}`);
      const loadout = response.data.loadout;
      setFormData({
        name: loadout.name,
        weapons: loadout.weapons || '',
        abilities: loadout.abilities || '',
        stats: loadout.stats || '',
        notes: loadout.notes || '',
        game_id: loadout.game_id || ''
      });
    } catch (err) {
      setError('Failed to load loadout');
      console.error(err);
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

    if (!formData.game_id) {
      setError('Please select a game');
      setLoading(false);
      return;
    }

    try {
      const payload = {
        name: formData.name,
        weapons: formData.weapons,
        abilities: formData.abilities,
        stats: formData.stats,
        notes: formData.notes,
        game_id: parseInt(formData.game_id)
      };

      if (isEdit) {
        await axios.put(`/api/loadouts/${id}`, payload);
      } else {
        await axios.post('/api/loadouts', payload);
      }

      navigate('/loadouts');
    } catch (err) {
      setError(err.response?.data?.error || 'Failed to save loadout');
      setLoading(false);
    }
  };

  return (
    <div className="form-container">
      <h2>{isEdit ? 'Edit Loadout' : 'Create New Loadout'}</h2>
      {error && <div className="error">{error}</div>}
      <form onSubmit={handleSubmit}>
        <div className="form-group">
          <label htmlFor="name">Loadout Name *</label>
          <input
            type="text"
            id="name"
            name="name"
            value={formData.name}
            onChange={handleChange}
            required
            autoFocus
            placeholder="e.g., Sniper Build, Tank Setup"
          />
        </div>
        <div className="form-group">
          <label htmlFor="game_id">Game *</label>
          <select
            id="game_id"
            name="game_id"
            value={formData.game_id}
            onChange={handleChange}
            required
          >
            <option value="">Select a game</option>
            {games.map(game => (
              <option key={game.id} value={game.id}>
                {game.name}
              </option>
            ))}
          </select>
        </div>
        <div className="form-group">
          <label htmlFor="weapons">Weapons / Equipment</label>
          <textarea
            id="weapons"
            name="weapons"
            value={formData.weapons}
            onChange={handleChange}
            placeholder="List weapons, equipment, or items (one per line or comma-separated)"
            rows="3"
          />
        </div>
        <div className="form-group">
          <label htmlFor="abilities">Abilities / Skills</label>
          <textarea
            id="abilities"
            name="abilities"
            value={formData.abilities}
            onChange={handleChange}
            placeholder="List abilities, skills, or perks (one per line or comma-separated)"
            rows="3"
          />
        </div>
        <div className="form-group">
          <label htmlFor="stats">Stats / Attributes</label>
          <textarea
            id="stats"
            name="stats"
            value={formData.stats}
            onChange={handleChange}
            placeholder="Key stats or attributes (e.g., Strength: 50, Agility: 30)"
            rows="3"
          />
        </div>
        <div className="form-group">
          <label htmlFor="notes">Notes</label>
          <textarea
            id="notes"
            name="notes"
            value={formData.notes}
            onChange={handleChange}
            placeholder="Additional notes, strategies, or tips for this loadout"
            rows="5"
          />
        </div>
        <div className="btn-group">
          <button type="submit" className="btn btn-primary" disabled={loading}>
            {loading ? 'Saving...' : isEdit ? 'Update Loadout' : 'Create Loadout'}
          </button>
          <button
            type="button"
            onClick={() => navigate('/loadouts')}
            className="btn btn-secondary"
          >
            Cancel
          </button>
        </div>
      </form>
    </div>
  );
};

export default LoadoutForm;

