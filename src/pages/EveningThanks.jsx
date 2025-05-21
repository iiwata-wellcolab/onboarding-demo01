import React from 'react';
import { useNavigate } from 'react-router-dom';

const EveningThanks = () => {
  const navigate = useNavigate();

  return (
    <div className="container" style={styles.container}>
      <div className="card" style={styles.card}>
        <div className="card-header" style={styles.cardHeader}>夕方のチェックアウト</div>
        <div className="card-body" style={styles.cardBody}>
          <div className="thank-you-message" style={styles.thankYouMessage}>
            回答ありがとうございます。<br />
            今日もお疲れ様でした！
          </div>
          
          <button
            className="close-button"
            style={styles.backButton}
            onClick={() => navigate('/dashboard')}
          >
            閉じる
          </button>
        </div>
      </div>
    </div>
  );
};

// インラインスタイル
const styles = {
  container: {
    display: 'flex',
    justifyContent: 'center',
    width: '100%',
    maxWidth: '500px',
    margin: '0 auto',
    padding: '20px',
  },
  card: {
    width: '100%',
    backgroundColor: 'white',
    borderRadius: '15px',
    boxShadow: '0 2px 10px rgba(0, 0, 0, 0.1)',
    overflow: 'hidden',
  },
  cardHeader: {
    padding: '20px',
    backgroundColor: '#34a853',
    color: 'white',
    textAlign: 'center',
    fontSize: '22px',
    fontWeight: '500',
  },
  cardBody: {
    padding: '40px 30px',
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
  },
  thankYouMessage: {
    fontSize: '20px',
    fontWeight: '500',
    color: '#34a853',
    textAlign: 'center',
    marginBottom: '40px',
    lineHeight: '1.6',
  },
  backButton: {
    display: 'block',
    width: '200px',
    padding: '14px',
    borderRadius: '24px',
    border: 'none',
    backgroundColor: '#34a853',
    color: 'white',
    textAlign: 'center',
    fontSize: '16px',
    cursor: 'pointer',
    transition: 'background-color 0.2s',
  },
};

export default EveningThanks;
