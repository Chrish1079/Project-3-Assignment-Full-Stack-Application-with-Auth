from flask import Flask
from flask_cors import CORS
from flask_login import LoginManager
from config import Config
from models import db, bcrypt, User
from routes.auth import auth_bp
from routes.games import games_bp
from routes.loadouts import loadouts_bp

def create_app():
    app = Flask(__name__)
    app.config.from_object(Config)
    
    # Initialize extensions
    db.init_app(app)
    bcrypt.init_app(app)
    login_manager = LoginManager()
    login_manager.init_app(app)
    CORS(app, supports_credentials=True, origins=["http://localhost:3000"])
    
    @login_manager.user_loader
    def load_user(user_id):
        return User.query.get(int(user_id))
    
    # Register blueprints
    app.register_blueprint(auth_bp, url_prefix='/api/auth')
    app.register_blueprint(games_bp, url_prefix='/api/games')
    app.register_blueprint(loadouts_bp, url_prefix='/api/loadouts')
    
    # Create tables
    with app.app_context():
        db.create_all()
    
    return app

if __name__ == '__main__':
    app = create_app()
    app.run(debug=True, port=5555)

