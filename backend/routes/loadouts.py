from flask import Blueprint, request, jsonify
from models import db, Loadout, Game
from utils import login_required
from flask_login import current_user

loadouts_bp = Blueprint('loadouts', __name__)

@loadouts_bp.route('', methods=['GET'])
@login_required
def get_loadouts():
    """Get all loadouts for the current user"""
    user = current_user
    
    # Optional query parameters
    game_id = request.args.get('game_id', type=int)
    
    query = Loadout.query.filter_by(user_id=user.id)
    
    if game_id:
        query = query.filter_by(game_id=game_id)
    
    loadouts = query.order_by(Loadout.updated_at.desc()).all()
    
    return jsonify({
        'loadouts': [loadout.to_dict() for loadout in loadouts]
    }), 200

@loadouts_bp.route('/<int:loadout_id>', methods=['GET'])
@login_required
def get_loadout(loadout_id):
    """Get a specific loadout by ID"""
    user = current_user
    loadout = Loadout.query.filter_by(id=loadout_id, user_id=user.id).first()
    
    if not loadout:
        return jsonify({'error': 'Loadout not found'}), 404
    
    return jsonify({'loadout': loadout.to_dict()}), 200

@loadouts_bp.route('', methods=['POST'])
@login_required
def create_loadout():
    """Create a new loadout"""
    user = current_user
    data = request.get_json()
    
    if not data or not data.get('name'):
        return jsonify({'error': 'Name is required'}), 400
    
    if not data.get('game_id'):
        return jsonify({'error': 'Game ID is required'}), 400
    
    # Validate game belongs to user
    game = Game.query.filter_by(id=data['game_id'], user_id=user.id).first()
    if not game:
        return jsonify({'error': 'Game not found'}), 404
    
    loadout = Loadout(
        name=data['name'],
        weapons=data.get('weapons', ''),
        abilities=data.get('abilities', ''),
        stats=data.get('stats', ''),
        notes=data.get('notes', ''),
        user_id=user.id,
        game_id=data['game_id']
    )
    
    try:
        db.session.add(loadout)
        db.session.commit()
        return jsonify({'loadout': loadout.to_dict()}), 201
    except Exception as e:
        db.session.rollback()
        return jsonify({'error': str(e)}), 500

@loadouts_bp.route('/<int:loadout_id>', methods=['PUT'])
@login_required
def update_loadout(loadout_id):
    """Update an existing loadout"""
    user = current_user
    loadout = Loadout.query.filter_by(id=loadout_id, user_id=user.id).first()
    
    if not loadout:
        return jsonify({'error': 'Loadout not found'}), 404
    
    data = request.get_json()
    
    if 'name' in data:
        loadout.name = data['name']
    if 'weapons' in data:
        loadout.weapons = data['weapons']
    if 'abilities' in data:
        loadout.abilities = data['abilities']
    if 'stats' in data:
        loadout.stats = data['stats']
    if 'notes' in data:
        loadout.notes = data['notes']
    if 'game_id' in data:
        # Validate game belongs to user
        game = Game.query.filter_by(id=data['game_id'], user_id=user.id).first()
        if not game:
            return jsonify({'error': 'Game not found'}), 404
        loadout.game_id = data['game_id']
    
    try:
        db.session.commit()
        return jsonify({'loadout': loadout.to_dict()}), 200
    except Exception as e:
        db.session.rollback()
        return jsonify({'error': str(e)}), 500

@loadouts_bp.route('/<int:loadout_id>', methods=['DELETE'])
@login_required
def delete_loadout(loadout_id):
    """Delete a loadout"""
    user = current_user
    loadout = Loadout.query.filter_by(id=loadout_id, user_id=user.id).first()
    
    if not loadout:
        return jsonify({'error': 'Loadout not found'}), 404
    
    try:
        db.session.delete(loadout)
        db.session.commit()
        return jsonify({'message': 'Loadout deleted successfully'}), 200
    except Exception as e:
        db.session.rollback()
        return jsonify({'error': str(e)}), 500

