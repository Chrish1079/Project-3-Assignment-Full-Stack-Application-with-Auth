# Quick Setup Guide - SkillSet

## Backend Setup

1. **Navigate to backend directory:**
   ```bash
   cd backend
   ```

2. **Create virtual environment:**
   ```bash
   python -m venv venv
   # On Windows:
   venv\Scripts\activate
   # On Mac/Linux:
   source venv/bin/activate
   ```

3. **Install dependencies:**
   ```bash
   pip install -r requirements.txt
   ```

4. **Create `.env` file in the backend directory:**
   Create a file named `.env` with the following content:
   ```
   SECRET_KEY=your-secret-key-here-change-in-production
   DATABASE_URL=sqlite:///skillset_app.db
   FLASK_ENV=development
   FLASK_DEBUG=1
   ```
   
   **Important:** Replace `your-secret-key-here-change-in-production` with a strong, random string for production use.

5. **Run the backend:**
   ```bash
   python app.py
   ```
   
   The backend should start on `http://localhost:5555`

## Frontend Setup

1. **Navigate to frontend directory:**
   ```bash
   cd frontend
   ```

2. **Install dependencies:**
   ```bash
   npm install
   ```

3. **Start the development server:**
   ```bash
   npm start
   ```
   
   The frontend should start on `http://localhost:3000` and automatically open in your browser.

## First Use

1. Open `http://localhost:3000` in your browser
2. Click "Register" to create a new account
3. After registration, you'll be automatically logged in
4. Add your first game (e.g., "Call of Duty", "Elden Ring")
5. Create your first loadout for that game!

## Troubleshooting

- **Backend won't start:** Make sure port 5555 is not in use and you have created the `.env` file
- **Frontend can't connect to backend:** Ensure the backend is running on port 5555 and check the proxy setting in `package.json`
- **Database errors:** Delete `skillset_app.db` in the backend directory and restart the backend to recreate the database
- **Session not persisting:** Make sure `withCredentials: true` is set in axios (already configured in AuthContext)
