
import React, { useState } from 'react';
import { BrowserRouter as Router, Routes, Route, Link, Navigate } from 'react-router-dom';
import { ProgressProvider } from './contexts/ProgressContext';
import Welcome from './pages/Welcome';
import Dashboard from './pages/Dashboard';
import DocumentCheck from './pages/DocumentCheck';
import ItemsToBring from './pages/ItemsToBring';
import Messages from './pages/Messages';
import ThankYouMessage from './pages/ThankYouMessage';
import QuestionForm from './pages/QuestionForm';
import Completion from './pages/Completion';

// 管理者用コンポーネントのインポート
import AdminLogin from './admin/AdminLogin';
import AdminLayout from './admin/AdminLayout';
import AdminDashboard from './admin/AdminDashboard';
import EmployeesList from './admin/EmployeesList';
import AddEmployee from './admin/AddEmployee';
import './App.css';

export default function App() {
  const [userName, setUserName] = useState('山田 太郎');
  const [daysUntilJoining, setDaysUntilJoining] = useState(7);
  
  return (
    <ProgressProvider>
      <Router>
        <Routes>
          {/* 内定者用ルート */}
          <Route path="/" element={<Welcome userName={userName} daysUntilJoining={daysUntilJoining} />} />
          <Route path="/dashboard" element={<Dashboard daysUntilJoining={daysUntilJoining} />} />
          <Route path="/documents" element={<DocumentCheck daysUntilJoining={daysUntilJoining} />} />
          <Route path="/items" element={<ItemsToBring daysUntilJoining={daysUntilJoining} />} />
          <Route path="/messages" element={<Messages daysUntilJoining={daysUntilJoining} />} />
          <Route path="/thank-you" element={<ThankYouMessage daysUntilJoining={daysUntilJoining} />} />
          <Route path="/question" element={<QuestionForm daysUntilJoining={daysUntilJoining} />} />
          <Route path="/completion" element={<Completion daysUntilJoining={daysUntilJoining} />} />
          
          {/* 管理者用ルート */}
          <Route path="/admin/login" element={<AdminLogin />} />
          <Route path="/admin" element={<AdminLayout />}>
            <Route index element={<Navigate to="/admin/dashboard" replace />} />
            <Route path="dashboard" element={<AdminDashboard />} />
            <Route path="employees" element={<EmployeesList />} />
            <Route path="add-employee" element={<AddEmployee />} />
          </Route>
          
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </Router>
    </ProgressProvider>
  );
}
