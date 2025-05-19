import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import './AdminStyles.css';

const AdminLogin = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const handleSubmit = (e) => {
    e.preventDefault();
    // 簡易的な認証（実際の環境では適切な認証システムを使用すること）
    if (email === 'admin@example.com' && password === 'password') {
      // ログイン成功時の処理
      localStorage.setItem('adminLoggedIn', 'true');
      navigate('/admin/dashboard');
    } else {
      setError('メールアドレスまたはパスワードが正しくありません。');
    }
  };

  return (
    <div className="admin-container">
      <div className="admin-login-card">
        <h2>人事管理システム</h2>
        <h3>ログイン</h3>
        
        {error && <div className="admin-error">{error}</div>}
        
        <form onSubmit={handleSubmit}>
          <div className="admin-form-group">
            <label htmlFor="email">メールアドレス</label>
            <input
              type="email"
              id="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              placeholder="例: admin@example.com"
            />
          </div>
          
          <div className="admin-form-group">
            <label htmlFor="password">パスワード</label>
            <input
              type="password"
              id="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              placeholder="パスワードを入力"
            />
          </div>
          
          <button type="submit" className="admin-button">ログイン</button>
        </form>
        
        <div className="admin-login-footer">
          <p>※テスト用アカウント: admin@example.com / password</p>
        </div>
      </div>
    </div>
  );
};

export default AdminLogin;
