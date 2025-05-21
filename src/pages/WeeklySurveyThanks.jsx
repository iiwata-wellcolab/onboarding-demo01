import React from 'react';
import { useNavigate } from 'react-router-dom';

const WeeklySurveyThanks = () => {
  const navigate = useNavigate();

  return (
    <div style={styles.container}>
      <div style={styles.card}>
        <div style={styles.header}>
          <h2 style={styles.title}>週次サーベイ</h2>
        </div>
        
        <div style={styles.thankYouContainer}>
          <div style={styles.checkmark}>✓</div>
          <h3 style={styles.thankYouTitle}>回答ありがとうございました</h3>
          <p style={styles.thankYouMessage}>
            いただいたフィードバックは、より良いオンボーディング体験のために活用させていただきます。
            <br />
            何か質問や懸念事項がある場合は、いつでもマネージャーやHR担当者にお問い合わせください。
          </p>
          
          <button
            style={styles.closeButton}
            onClick={() => navigate('/dashboard')}
          >
            閉じる
          </button>
        </div>
      </div>
    </div>
  );
};

const styles = {
  container: {
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    padding: '20px',
    minHeight: '100vh',
    backgroundColor: '#f8f9fa',
  },
  card: {
    width: '100%',
    maxWidth: '600px',
    backgroundColor: 'white',
    borderRadius: '15px',
    boxShadow: '0 2px 10px rgba(0, 0, 0, 0.1)',
    padding: '30px',
  },
  header: {
    marginBottom: '25px',
    textAlign: 'center',
  },
  title: {
    margin: 0,
    fontSize: '24px',
    fontWeight: '600',
    color: '#333',
  },
  thankYouContainer: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    padding: '20px 0',
  },
  checkmark: {
    width: '70px',
    height: '70px',
    borderRadius: '50%',
    backgroundColor: '#34a853',
    color: 'white',
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    fontSize: '36px',
    marginBottom: '20px',
  },
  thankYouTitle: {
    fontSize: '22px',
    fontWeight: '500',
    color: '#333',
    marginBottom: '15px',
  },
  thankYouMessage: {
    fontSize: '16px',
    color: '#666',
    textAlign: 'center',
    lineHeight: '1.6',
    marginBottom: '30px',
  },
  closeButton: {
    padding: '12px 40px',
    backgroundColor: '#4285f4',
    color: 'white',
    border: 'none',
    borderRadius: '8px',
    fontSize: '16px',
    cursor: 'pointer',
    transition: 'background-color 0.2s',
  },
};

export default WeeklySurveyThanks;
