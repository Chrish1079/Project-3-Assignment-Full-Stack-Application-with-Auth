from flask import Blueprint, request, jsonify
from models import db, Game, Loadout
from utils import login_required
from flask_login import current_user

games_bp = Blueprint('games', __name__)

@games_bp.route('', methods=['GET'])
@login_required
def get_games():
    """Get all games for the current user"""
    user = current_user
    games = Game.query.filter_by(user_id=user.id).order_by(Game.name).all()
    
    return jsonify({
        'games': [game.to_dict() for game in games]
    }), 200

@games_bp.route('/<int:game_id>', methods=['GET'])
@login_required
def get_game(game_id):
    """Get a specific game by ID"""
    user = current_user
    game = Game.query.filter_by(id=game_id, user_id=user.id).first()
    
    if not game:
        return jsonify({'error': 'Game not found'}), 404
    
    return jsonify({'game': game.to_dict()}), 200

@games_bp.route('', methods=['POST'])
@login_required
def create_game():
    """Create a new game"""
    user = current_user
    data = request.get_json()
    
    if not data or not data.get('name'):
        return jsonify({'error': 'Name is required'}), 400
    
    # Check if game name already exists for this user
    existing = Game.query.filter_by(name=data['name'], user_id=user.id).first()
    if existing:
        return jsonify({'error': 'Game with this name already exists'}), 400
    
    game = Game(
        name=data['name'],
        genre=data.get('genre', ''),
        user_id=user.id
    )
    
    try:
        db.session.add(game)
        db.session.commit()
        return jsonify({'game': game.to_dict()}), 201
    except Exception as e:
        db.session.rollback()
        return jsonify({'error': str(e)}), 500

@games_bp.route('/<int:game_id>', methods=['PUT'])
@login_required
def update_game(game_id):
    """Update an existing game"""
    user = current_user
    game = Game.query.filter_by(id=game_id, user_id=user.id).first()
    
    if not game:
        return jsonify({'error': 'Game not found'}), 404
    
    data = request.get_json()
    
    if 'name' in data:
        # Check if new name conflicts with existing game
        existing = Game.query.filter_by(name=data['name'], user_id=user.id).first()
        if existing and existing.id != game_id:
            return jsonify({'error': 'Game with this name already exists'}), 400
        game.name = data['name']
    
    if 'genre' in data:
        game.genre = data['genre']
    
    try:
        db.session.commit()
        return jsonify({'game': game.to_dict()}), 200
    except Exception as e:
        db.session.rollback()
        return jsonify({'error': str(e)}), 500

@games_bp.route('/<int:game_id>', methods=['DELETE'])
@login_required
def delete_game(game_id):
    """Delete a game"""
    user = current_user
    game = Game.query.filter_by(id=game_id, user_id=user.id).first()
    
    if not game:
        return jsonify({'error': 'Game not found'}), 404
    
    # Delete all loadouts associated with this game
    Loadout.query.filter_by(game_id=game_id).delete()
    
    try:
        db.session.delete(game)
        db.session.commit()
        return jsonify({'message': 'Game deleted successfully'}), 200
    except Exception as e:
        db.session.rollback()
        return jsonify({'error': str(e)}), 500

