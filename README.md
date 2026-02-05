# SkillSet - Gaming Loadout Management Application

A full-stack web application built with Flask (backend) and React (frontend) that allows gamers to create, manage, and organize game-specific loadouts. The application features user authentication using Flask-Login sessions and complete CRUD operations for both games and loadouts.

## Features

- **User Authentication**: Secure registration and login using Flask-Login sessions
- **Game Management**: Add and organize your favorite games by genre
- **Loadout Management**: Create, read, update, and delete custom loadouts with structured data
- **Loadout Details**: Store weapons, abilities, stats, and notes for each loadout
- **Authorization**: Users can only access and modify their own data
- **Responsive Design**: Modern, mobile-friendly UI
- **Protected Routes**: Frontend routes are protected based on authentication state

## Business Problem

Many gamers play titles that rely heavily on character builds, weapon loadouts, or ability combinations, yet they lack a simple, organized way to save, refine, and compare these setups. Players often rely on memory, screenshots, or external notes, which leads to lost builds, repeated experimentation, and inefficient gameplay.

**SkillSet** solves this by providing a centralized, secure platform for gamers to create, store, and compare custom loadouts across games.

## Tech Stack

### Backend
- Flask 3.0.0
- Flask-SQLAlchemy (Database ORM)
- Flask-Login (Session-based authentication)
- Flask-CORS (Cross-Origin Resource Sharing)
- Flask-Bcrypt (Password hashing)
- SQLite (Database)

### Frontend
- React 18.2.0
- React Router DOM (Routing)
- Axios (HTTP client)
- CSS3 (Styling)

## Project Structure

```
.
├── backend/
│   ├── routes/
│   │   ├── auth.py          # Authentication routes
│   │   ├── games.py         # Games CRUD routes
│   │   └── loadouts.py      # Loadouts CRUD routes
│   ├── models.py            # Database models (User, Game, Loadout)
│   ├── utils.py             # Authentication decorators
│   ├── config.py            # Configuration
│   ├── app.py               # Flask application
│   ├── requirements.txt     # Python dependencies
│   └── .env                 # Environment variables (create from .env.example)
│
└── frontend/
    ├── src/
    │   ├── components/      # React components
    │   ├── context/         # React context (AuthContext)
    │   ├── App.js           # Main app component
    │   └── index.js         # Entry point
    ├── public/
    ├── package.json
    └── .env                 # Environment variables (if needed)
```

## Setup Instructions

### Prerequisites
- Python 3.8 or higher
- Node.js 16 or higher
- npm or yarn

### Backend Setup

1. Navigate to the backend directory:
```bash
cd backend
```

2. Create a virtual environment (recommended):
```bash
python -m venv venv
source venv/bin/activate  # On Windows: venv\Scripts\activate
```

3. Install dependencies:
```bash
pip install -r requirements.txt
```

4. Create a `.env` file in the backend directory:
```bash
# Create .env file with the following content:
SECRET_KEY=your-secret-key-here-change-in-production
DATABASE_URL=sqlite:///skillset_app.db
FLASK_ENV=development
FLASK_DEBUG=1
```

5. Run the Flask application:
```bash
python app.py
```

The backend will run on `http://localhost:5555`

### Frontend Setup

1. Navigate to the frontend directory:
```bash
cd frontend
```

2. Install dependencies:
```bash
npm install
```

3. Start the development server:
```bash
npm start
```

The frontend will run on `http://localhost:3000`

## API Documentation

All API routes are prefixed with `/api`.

### Authentication Routes

#### Register
- **POST** `/api/auth/register`
- **Body**: `{ "username": "string", "email": "string", "password": "string" }`
- **Response**: `{ "message": "string", "user": {...} }`

#### Login
- **POST** `/api/auth/login`
- **Body**: `{ "username": "string", "password": "string" }`
- **Response**: `{ "message": "string", "user": {...} }`

#### Logout
- **POST** `/api/auth/logout`
- **Response**: `{ "message": "string" }`

#### Get Current User
- **GET** `/api/auth/me`
- **Response**: `{ "user": {...} }`

### Games Routes

All game routes require authentication (session-based).

#### Get All Games
- **GET** `/api/games`
- **Response**: `{ "games": [...] }`

#### Get Single Game
- **GET** `/api/games/:id`
- **Response**: `{ "game": {...} }`

#### Create Game
- **POST** `/api/games`
- **Body**: `{ "name": "string", "genre": "string" (optional) }`
- **Response**: `{ "game": {...} }`

#### Update Game
- **PUT** `/api/games/:id`
- **Body**: `{ "name": "string" (optional), "genre": "string" (optional) }`
- **Response**: `{ "game": {...} }`

#### Delete Game
- **DELETE** `/api/games/:id`
- **Response**: `{ "message": "string" }`

### Loadouts Routes

All loadout routes require authentication (session-based).

#### Get All Loadouts
- **GET** `/api/loadouts`
- **Query Parameters** (optional): `game_id` (integer)
- **Response**: `{ "loadouts": [...] }`

#### Get Single Loadout
- **GET** `/api/loadouts/:id`
- **Response**: `{ "loadout": {...} }`

#### Create Loadout
- **POST** `/api/loadouts`
- **Body**: `{ "name": "string", "game_id": integer, "weapons": "string" (optional), "abilities": "string" (optional), "stats": "string" (optional), "notes": "string" (optional) }`
- **Response**: `{ "loadout": {...} }`

#### Update Loadout
- **PUT** `/api/loadouts/:id`
- **Body**: `{ "name": "string" (optional), "weapons": "string" (optional), "abilities": "string" (optional), "stats": "string" (optional), "notes": "string" (optional), "game_id": integer (optional) }`
- **Response**: `{ "loadout": {...} }`

#### Delete Loadout
- **DELETE** `/api/loadouts/:id`
- **Response**: `{ "message": "string" }`

## Security Features

- **Password Hashing**: Passwords are hashed using bcrypt before storage
- **Session-Based Authentication**: Secure session management using Flask-Login
- **Authorization**: Users can only access and modify their own games and loadouts
- **Input Validation**: Server-side validation for all inputs
- **CORS Configuration**: Properly configured for frontend-backend communication

## Usage

1. **Register/Login**: Create an account or login with existing credentials
2. **Add Games**: Add your favorite games to organize loadouts
3. **Create Loadouts**: Create loadouts with weapons, abilities, stats, and notes
4. **Filter Loadouts**: Filter loadouts by game on the loadouts list page
5. **Edit/Delete**: Update or remove your games and loadouts as needed

## Development Notes

- The frontend proxy is configured in `package.json` to forward requests to `http://localhost:5555`
- Authentication uses Flask-Login sessions (cookies) instead of JWT tokens
- The database is SQLite by default (can be changed in `.env`)
- All routes are namespaced with `/api` to avoid conflicts with frontend routing
- Axios is configured to send credentials for session cookies

## Future Enhancements

- Loadout comparison feature
- Import/export loadouts
- Share loadouts with other users
- Search functionality
- Loadout templates
- Image uploads for loadouts
- Dark mode theme

## License

This project is created for educational purposes as part of a capstone assignment.
