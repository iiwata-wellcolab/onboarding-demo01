
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
import OTPVerification from './pages/OTPVerification';
import MorningCheckin from './pages/MorningCheckin';
import EveningCheckout from './pages/EveningCheckout';
import MorningThanks from './pages/MorningThanks';
import EveningThanks from './pages/EveningThanks';
import WeeklySurvey from './pages/WeeklySurvey';
import WeeklySurveyThanks from './pages/WeeklySurveyThanks';
import MonthlySurvey30 from './pages/MonthlySurvey30';
import MonthlySurvey60 from './pages/MonthlySurvey60';
import MonthlySurvey90 from './pages/MonthlySurvey90';
import MonthlySurveyThanks from './pages/MonthlySurveyThanks';

// 管理者用コンポーネントのインポート
import AdminLogin from './admin/AdminLogin';
import AdminLayout from './admin/AdminLayout';
import AdminDashboard from './admin/AdminDashboard';
import EmployeesList from './admin/EmployeesList';
import AddEmployee from './admin/AddEmployee';
import NewHireDetail from './admin/NewHireDetail';
import './App.css';

export default function App() {
  const [userName, setUserName] = useState('山田 太郎');
  const [daysUntilJoining, setDaysUntilJoining] = useState(7);
  
  // 入社前と入社後のダッシュボードを切り替える関数
  const toggleJoiningStatus = () => {
    // 入社前の場合は入社後に、入社後の場合は入社前に切り替える
    setDaysUntilJoining(prev => prev > 0 ? -1 : 7);
  };
  
  return (
    <ProgressProvider>
      <Router basename="/onboarding-demo01">
        <Routes>
          {/* 内定者用ルート */}
          <Route path="/verify" element={<OTPVerification />} />
          <Route path="/welcome" element={<Welcome userName={userName} daysUntilJoining={daysUntilJoining} />} />
          <Route path="/" element={<Navigate to="/admin/login" replace />} />
          <Route path="/dashboard" element={<Dashboard daysUntilJoining={daysUntilJoining} toggleJoiningStatus={toggleJoiningStatus} />} />
          <Route path="/documents" element={<DocumentCheck daysUntilJoining={daysUntilJoining} />} />
          <Route path="/items" element={<ItemsToBring daysUntilJoining={daysUntilJoining} />} />
          <Route path="/messages" element={<Messages daysUntilJoining={daysUntilJoining} />} />
          <Route path="/thank-you" element={<ThankYouMessage daysUntilJoining={daysUntilJoining} />} />
          <Route path="/question" element={<QuestionForm daysUntilJoining={daysUntilJoining} />} />
          <Route path="/completion" element={<Completion daysUntilJoining={daysUntilJoining} />} />
          <Route path="/morning-checkin" element={<MorningCheckin />} />
          <Route path="/evening-checkout" element={<EveningCheckout />} />
          <Route path="/morning-thanks" element={<MorningThanks />} />
          <Route path="/evening-thanks" element={<EveningThanks />} />
          <Route path="/weekly-survey" element={<WeeklySurvey />} />
          <Route path="/weekly-survey-thanks" element={<WeeklySurveyThanks />} />
          <Route path="/monthly-survey-30" element={<MonthlySurvey30 />} />
          <Route path="/monthly-survey-60" element={<MonthlySurvey60 />} />
          <Route path="/monthly-survey-90" element={<MonthlySurvey90 />} />
          <Route path="/monthly-survey-thanks" element={<MonthlySurveyThanks />} />
          
          {/* 管理者用ルート */}
          <Route path="/admin/login" element={<AdminLogin />} />
          <Route path="/admin" element={<AdminLayout />}>
            <Route index element={<Navigate to="/admin/dashboard" replace />} />
            <Route path="dashboard" element={<AdminDashboard />} />
            <Route path="employees" element={<EmployeesList />} />
            <Route path="employees/:id" element={<NewHireDetail />} />
            <Route path="add-employee" element={<AddEmployee />} />
          </Route>
          
          <Route path="*" element={<Navigate to="/admin/login" replace />} />
        </Routes>
      </Router>
    </ProgressProvider>
  );
}
