import React from 'react';
import { Navigate, Outlet, useNavigate, useLocation } from 'react-router-dom';
import './AdminStyles.css';

// 認証状態を確認するための関数
const isAuthenticated = () => {
  return localStorage.getItem('adminLoggedIn') === 'true';
};

const AdminLayout = () => {
  const navigate = useNavigate();
  const location = useLocation();
  
  // 認証されていない場合はログインページにリダイレクト
  if (!isAuthenticated()) {
    return <Navigate to="/admin/login" replace />;
  }
  
  const handleLogout = () => {
    localStorage.removeItem('adminLoggedIn');
    navigate('/admin/login');
  };
  
  // 現在のパスに基づいてアクティブなメニュー項目を判断
  const isActive = (path) => {
    return location.pathname === path;
  };

  return (
    <div className="admin-container">
      {/* サイドバー */}
      <div className="admin-sidebar">
        <div className="admin-sidebar-header">
          <h2>WellCo オンボーディング</h2>
        </div>
        <ul className="admin-menu">
          <li 
            className={`admin-menu-item ${isActive('/admin/dashboard') ? 'active' : ''}`}
            onClick={() => navigate('/admin/dashboard')}
          >
            <i className="fas fa-home"></i> ダッシュボード
          </li>
          <li 
            className={`admin-menu-item ${isActive('/admin/employees') ? 'active' : ''}`}
            onClick={() => navigate('/admin/employees')}
          >
            <i className="fas fa-users"></i> 新入社員
          </li>
        </ul>
      </div>
      
      {/* メインコンテンツ */}
      <div className="admin-content">
        <div className="admin-header">
          <div className="admin-header-title">
            {location.pathname === '/admin/dashboard' && 'ダッシュボード'}
            {location.pathname === '/admin/employees' && '新入社員管理'}
          </div>
          <div className="admin-user-info">
            <span className="admin-user-name">管理者</span>
            <button className="admin-logout-button" onClick={handleLogout}>ログアウト</button>
          </div>
        </div>
        
        {/* 子ルートのコンポーネントがここに表示される */}
        <Outlet />
      </div>
    </div>
  );
};

export default AdminLayout;
