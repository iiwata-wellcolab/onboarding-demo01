
import React, { useState } from 'react';
import { BrowserRouter as Router, Routes, Route, Link, Navigate } from 'react-router-dom';
import Welcome from './pages/Welcome';
import Dashboard from './pages/Dashboard';
import DocumentCheck from './pages/DocumentCheck';
import Messages from './pages/Messages';
import QuestionForm from './pages/QuestionForm';
import Completion from './pages/Completion';
import './App.css';

export default function App() {
  const [userName, setUserName] = useState('山田 太郎');
  const [daysUntilJoining, setDaysUntilJoining] = useState(7);
  
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Welcome userName={userName} daysUntilJoining={daysUntilJoining} />} />
        <Route path="/dashboard" element={<Dashboard daysUntilJoining={daysUntilJoining} />} />
        <Route path="/documents" element={<DocumentCheck daysUntilJoining={daysUntilJoining} />} />
        <Route path="/messages" element={<Messages daysUntilJoining={daysUntilJoining} />} />
        <Route path="/question" element={<QuestionForm daysUntilJoining={daysUntilJoining} />} />
        <Route path="/completion" element={<Completion daysUntilJoining={daysUntilJoining} />} />
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </Router>
  );
}
