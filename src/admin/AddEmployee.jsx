import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import './AdminStyles.css';

const AddEmployee = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    lastName: '',
    firstName: '',
    localLastName: '',
    localFirstName: '',
    email: '',
    preferredLanguage: 'ja',
    country: 'Japan',
    timezone: 'GMT+9 (Tokyo)',
    joiningDate: '',
    department: 'Sales Department',
    team: '',
    sendWelcomeMessages: {
      manager: true,
      director: true,
      honbucho: true
    }
  });

  // 入力フォームの変更を処理
  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    
    if (type === 'checkbox') {
      setFormData({
        ...formData,
        sendWelcomeMessages: {
          ...formData.sendWelcomeMessages,
          [name]: checked
        }
      });
    } else {
      setFormData({
        ...formData,
        [name]: value
      });
    }
  };

  // フォーム送信を処理
  const handleSubmit = (e) => {
    e.preventDefault();
    
    // 実際のアプリでは、ここでAPIにデータを送信
    console.log('送信されたデータ:', formData);
    
    // 送信成功後に社員一覧ページに戻る
    alert('新入社員の情報が登録されました');
    navigate('/admin/employees');
  };

  // AIによる自動入力（実際のアプリではAPIを呼び出す）
  const handleAutoFill = () => {
    alert('履歴書からデータを読み込んでいます...');
    // デモ用に自動入力をシミュレート
    setTimeout(() => {
      setFormData({
        ...formData,
        lastName: 'Tanaka',
        firstName: 'Yuki',
        localLastName: '田中',
        localFirstName: '有希',
        email: 'tanaka.yuki@example.com'
      });
      alert('データの読み込みが完了しました');
    }, 1000);
  };

  return (
    <div className="admin-add-employee">
      <h2 className="admin-page-title">新入社員セットアップ（Global対応）</h2>
      
      <form onSubmit={handleSubmit}>
        <div className="admin-card">
          <h3>🌏 基本情報</h3>
          <button 
            type="button" 
            className="admin-button" 
            onClick={handleAutoFill}
            style={{ marginBottom: '15px' }}
          >
            履歴書をアップロードしてAIで自動入力
          </button>
          
          <div className="admin-form-row">
            <div className="admin-form-group">
              <label htmlFor="lastName">氏名（ローマ字）</label>
              <input
                type="text"
                id="lastName"
                name="lastName"
                placeholder="姓"
                value={formData.lastName}
                onChange={handleChange}
                required
              />
            </div>
            <div className="admin-form-group">
              <label htmlFor="firstName">&nbsp;</label>
              <input
                type="text"
                id="firstName"
                name="firstName"
                placeholder="名"
                value={formData.firstName}
                onChange={handleChange}
                required
              />
            </div>
          </div>
          
          <div className="admin-form-row">
            <div className="admin-form-group">
              <label htmlFor="localLastName">氏名（現地表記・任意）</label>
              <input
                type="text"
                id="localLastName"
                name="localLastName"
                placeholder="姓（現地表記）"
                value={formData.localLastName}
                onChange={handleChange}
              />
            </div>
            <div className="admin-form-group">
              <label htmlFor="localFirstName">&nbsp;</label>
              <input
                type="text"
                id="localFirstName"
                name="localFirstName"
                placeholder="名（現地表記）"
                value={formData.localFirstName}
                onChange={handleChange}
              />
            </div>
          </div>
          
          <div className="admin-form-group">
            <label htmlFor="email">メールアドレス</label>
            <input
              type="email"
              id="email"
              name="email"
              placeholder="example@domain.com"
              value={formData.email}
              onChange={handleChange}
              required
            />
          </div>
          
          <div className="admin-form-group">
            <label htmlFor="preferredLanguage">希望言語</label>
            <select
              id="preferredLanguage"
              name="preferredLanguage"
              value={formData.preferredLanguage}
              onChange={handleChange}
            >
              <option value="en">English</option>
              <option value="ja">日本語</option>
              <option value="zh">中文</option>
            </select>
          </div>
          
          <div className="admin-form-group">
            <label htmlFor="country">勤務国</label>
            <select
              id="country"
              name="country"
              value={formData.country}
              onChange={handleChange}
            >
              <option value="Japan">Japan</option>
              <option value="United States">United States</option>
              <option value="China">China</option>
            </select>
          </div>
          
          <div className="admin-form-group">
            <label htmlFor="timezone">タイムゾーン</label>
            <select
              id="timezone"
              name="timezone"
              value={formData.timezone}
              onChange={handleChange}
            >
              <option value="GMT+9 (Tokyo)">GMT+9 (Tokyo)</option>
              <option value="GMT-5 (New York)">GMT-5 (New York)</option>
              <option value="GMT+8 (Beijing)">GMT+8 (Beijing)</option>
            </select>
          </div>
        </div>
        
        <div className="admin-card">
          <h3>📅 入社情報</h3>
          <div className="admin-form-group">
            <label htmlFor="joiningDate">入社予定日</label>
            <input
              type="date"
              id="joiningDate"
              name="joiningDate"
              value={formData.joiningDate}
              onChange={handleChange}
              required
            />
          </div>
          
          <div className="admin-form-group">
            <label htmlFor="department">配属部署</label>
            <select
              id="department"
              name="department"
              value={formData.department}
              onChange={handleChange}
            >
              <option value="Sales Department">Sales Department</option>
              <option value="Marketing Department">Marketing Department</option>
              <option value="Engineering Department">Engineering Department</option>
              <option value="Human Resources">Human Resources</option>
            </select>
          </div>
          
          <div className="admin-form-group">
            <label htmlFor="team">配属チーム（任意）</label>
            <input
              type="text"
              id="team"
              name="team"
              placeholder="Team Name"
              value={formData.team}
              onChange={handleChange}
            />
          </div>
        </div>
        
        <div className="admin-card">
          <h3>✉ ウェルカムメッセージ設定</h3>
          <div className="admin-checkbox-group">
            <div style={{ display: 'flex', justifyContent: 'space-between', width: '200px' }}>
              <label htmlFor="manager" style={{ whiteSpace: 'nowrap' }}>マネージャー</label>
              <input
                type="checkbox"
                id="manager"
                name="manager"
                checked={formData.sendWelcomeMessages.manager}
                onChange={handleChange}
              />
            </div>
            <div style={{ display: 'flex', justifyContent: 'space-between', width: '200px' }}>
              <label htmlFor="director" style={{ whiteSpace: 'nowrap' }}>部長</label>
              <input
                type="checkbox"
                id="director"
                name="director"
                checked={formData.sendWelcomeMessages.director}
                onChange={handleChange}
              />
            </div>
            <div style={{ display: 'flex', justifyContent: 'space-between', width: '200px' }}>
              <label htmlFor="honbucho" style={{ whiteSpace: 'nowrap' }}>本部長</label>
              <input
                type="checkbox"
                id="honbucho"
                name="honbucho"
                checked={formData.sendWelcomeMessages.honbucho}
                onChange={handleChange}
              />
            </div>
          </div>
        </div>
        
        <div className="admin-form-actions">
          <button 
            type="button" 
            className="admin-button-secondary" 
            onClick={() => navigate('/admin/employees')}
            style={{ height: '40px', flex: '0 0 30%' }}
          >
            キャンセル
          </button>
          <button 
            type="submit" 
            className="admin-button"
            style={{ height: '40px', flex: '0 0 70%' }}
          >
            セットアップ完了＆通知を送信する
          </button>
        </div>
      </form>
    </div>
  );
};

export default AddEmployee;
