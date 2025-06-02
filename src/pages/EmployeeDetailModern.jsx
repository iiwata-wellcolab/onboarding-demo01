import React from 'react';
import { useNavigate } from 'react-router-dom';
import '../styles/EmployeeDetailModern.css';

const EmployeeDetailModern = () => {
  const navigate = useNavigate();

  // ダミーデータ
  const employeeData = {
    // 基本情報
    full_name_local: '山田 太郎',
    full_name_alphabet: 'Taro Yamada',
    emp_no: '10001',
    join_date: '2020-04-01',
    email: 'taro.yamada@example.com',
    
    // 組織情報
    division_name: '技術開発部',
    supervisor_name: '鈴木 一郎',
    
    // プロフィール
    mbti: 'INTJ',
    profile_comment: 'プログラミングとアウトドア活動が好きです。チームでの協力を大切にし、新しい技術の習得に意欲的です。休日は山登りやサイクリングを楽しんでいます。',
    photo_url: '/images/default_emp_icon.png'
  };

  return (
    <div className="employee-detail-container">
      <div className="employee-detail-card">
        <div className="employee-header">
          <div className="employee-photo-container">
            <img src={employeeData.photo_url} alt={employeeData.full_name_local} className="employee-photo" />
          </div>
          <div className="employee-header-info">
            <h1>{employeeData.full_name_local}</h1>
            <h2>{employeeData.full_name_alphabet}</h2>
            <div className="employee-id">社員番号: {employeeData.emp_no}</div>
          </div>
        </div>

        <div className="employee-section">
          <h3 className="section-title">基本情報</h3>
          <div className="info-grid">
            <div className="info-item">
              <div className="info-label">氏名（現地表記）</div>
              <div className="info-value">{employeeData.full_name_local}</div>
            </div>
            <div className="info-item">
              <div className="info-label">氏名（アルファベット）</div>
              <div className="info-value">{employeeData.full_name_alphabet}</div>
            </div>
            <div className="info-item">
              <div className="info-label">社員番号</div>
              <div className="info-value">{employeeData.emp_no}</div>
            </div>
            <div className="info-item">
              <div className="info-label">入社日</div>
              <div className="info-value">{employeeData.join_date}</div>
            </div>
            <div className="info-item">
              <div className="info-label">メールアドレス</div>
              <div className="info-value">{employeeData.email}</div>
            </div>
          </div>
        </div>

        <div className="employee-section">
          <h3 className="section-title">組織情報</h3>
          <div className="info-grid">
            <div className="info-item">
              <div className="info-label">部署名</div>
              <div className="info-value">{employeeData.division_name}</div>
            </div>
            <div className="info-item">
              <div className="info-label">上司</div>
              <div className="info-value">{employeeData.supervisor_name}</div>
            </div>
          </div>
        </div>

        <div className="employee-section">
          <h3 className="section-title">プロフィール</h3>
          <div className="info-grid">
            <div className="info-item">
              <div className="info-label">MBTI</div>
              <div className="info-value">{employeeData.mbti}</div>
            </div>
            <div className="info-item full-width">
              <div className="info-label">自己紹介コメント</div>
              <div className="info-value profile-comment">{employeeData.profile_comment}</div>
            </div>
          </div>
        </div>

        <div className="employee-actions">
          <button 
            className="back-button" 
            onClick={() => navigate('/admin/employees')}
          >
            ← 一覧に戻る
          </button>
        </div>
      </div>
    </div>
  );
};

export default EmployeeDetailModern;
