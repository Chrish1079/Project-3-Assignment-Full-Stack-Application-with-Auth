import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import Navbar from './components/Navbar';
import Login from './components/Login';
import Register from './components/Register';
import LoadoutsList from './components/LoadoutsList';
import LoadoutForm from './components/LoadoutForm';
import GamesList from './components/GamesList';
import GameForm from './components/GameForm';
import ProtectedRoute from './components/ProtectedRoute';
import './App.css';

function App() {
  return (
    <AuthProvider>
      <Router>
        <div className="App">
          <Navbar />
          <div className="container">
            <Routes>
              <Route path="/login" element={<Login />} />
              <Route path="/register" element={<Register />} />
              <Route
                path="/loadouts"
                element={
                  <ProtectedRoute>
                    <LoadoutsList />
                  </ProtectedRoute>
                }
              />
              <Route
                path="/loadouts/new"
                element={
                  <ProtectedRoute>
                    <LoadoutForm />
                  </ProtectedRoute>
                }
              />
              <Route
                path="/loadouts/:id/edit"
                element={
                  <ProtectedRoute>
                    <LoadoutForm />
                  </ProtectedRoute>
                }
              />
              <Route
                path="/games"
                element={
                  <ProtectedRoute>
                    <GamesList />
                  </ProtectedRoute>
                }
              />
              <Route
                path="/games/new"
                element={
                  <ProtectedRoute>
                    <GameForm />
                  </ProtectedRoute>
                }
              />
              <Route
                path="/games/:id/edit"
                element={
                  <ProtectedRoute>
                    <GameForm />
                  </ProtectedRoute>
                }
              />
              <Route path="/" element={<Navigate to="/loadouts" replace />} />
            </Routes>
          </div>
        </div>
      </Router>
    </AuthProvider>
  );
}

export default App;

