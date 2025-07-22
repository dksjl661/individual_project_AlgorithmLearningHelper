import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { Toaster } from 'react-hot-toast';
import { AuthProvider } from './contexts/AuthContext';
import { ProtectedRoute } from './components/ProtectedRoute';
import Navbar from './components/Navbar';
import Home from './pages/Home';
import Login from './pages/Login';
import Register from './pages/Register';
import Dashboard from './pages/Dashboard';
import Algorithms from './pages/Algorithms';
import AlgorithmDetail from './pages/AlgorithmDetail';
import Questions from './pages/Questions';
import QuestionDetail from './pages/QuestionDetail';
import WrongAnswers from './pages/WrongAnswers';
import Profile from './pages/Profile';
import './index.css';

function App() {
  return (
    <AuthProvider>
      <Router>
        <div className="min-h-screen bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50">
          <Navbar />
          <main className="pt-16">
            <Routes>
              <Route path="/" element={<Home />} />
              <Route path="/login" element={<Login />} />
              <Route path="/register" element={<Register />} />
              <Route 
                path="/dashboard" 
                element={
                  <ProtectedRoute>
                    <Dashboard />
                  </ProtectedRoute>
                } 
              />
              <Route 
                path="/algorithms" 
                element={
                  <ProtectedRoute>
                    <Algorithms />
                  </ProtectedRoute>
                } 
              />
              <Route 
                path="/algorithms/:id" 
                element={
                  <ProtectedRoute>
                    <AlgorithmDetail />
                  </ProtectedRoute>
                } 
              />
              <Route 
                path="/questions" 
                element={
                  <ProtectedRoute>
                    <Questions />
                  </ProtectedRoute>
                } 
              />
              <Route 
                path="/questions/:id" 
                element={
                  <ProtectedRoute>
                    <QuestionDetail />
                  </ProtectedRoute>
                } 
              />
              <Route 
                path="/wrong-answers" 
                element={
                  <ProtectedRoute>
                    <WrongAnswers />
                  </ProtectedRoute>
                } 
              />
              <Route 
                path="/profile" 
                element={
                  <ProtectedRoute>
                    <Profile />
                  </ProtectedRoute>
                } 
              />
              <Route path="*" element={<Navigate to="/" replace />} />
            </Routes>
          </main>
          <Toaster 
            position="top-right"
            toastOptions={{
              duration: 4000,
              style: {
                background: '#363636',
                color: '#fff',
              },
              success: {
                duration: 3000,
                iconTheme: {
                  primary: '#10b981',
                  secondary: '#fff',
                },
              },
              error: {
                duration: 5000,
                iconTheme: {
                  primary: '#ef4444',
                  secondary: '#fff',
                },
              },
            }}
          />
        </div>
      </Router>
    </AuthProvider>
  );
}

export default App; 