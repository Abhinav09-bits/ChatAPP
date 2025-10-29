import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import Login from './pages/Login';
import Register from './pages/Register';
import ChatWindow from './components/ChatWindow';

const isAuthenticated = () => !!localStorage.getItem('token');

const App = () => {
  return (
    <Routes>
      <Route path="/login" element={<Login />} />
      <Route path="/register" element={<Register />} />
      <Route
        path="/"
        element={isAuthenticated() ? <ChatWindow /> : <Navigate to="/login" />}
      />
    </Routes>
  );
};

export default App;
