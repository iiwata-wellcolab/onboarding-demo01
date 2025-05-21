import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';

const MorningCheckin = () => {
  const [selectedEmoji, setSelectedEmoji] = useState(null);
  const [selectedOption, setSelectedOption] = useState(null);
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const handleEmojiSelect = (emoji) => {
    setSelectedEmoji(emoji);
  };

  const handleOptionSelect = (option) => {
    setSelectedOption(option);
  };

  const handleSubmit = () => {
    // 両方の設問に回答しているかチェック
    if (!selectedEmoji || !selectedOption) {
      setError('回答されていません');
      return;
    }
    
    // エラーをクリア
    setError('');
    
    // チェックインデータ収集
    const formData = {
      type: 'morning_checkin',
      mood: selectedEmoji,
      feeling: selectedOption,
      timestamp: new Date().toISOString()
    };
    
    // 実際のアプリケーションでは、ここでサーバーにデータを送信します
    console.log('朝のチェックインデータ:', formData);
    
    // ローカルストレージに保存
    localStorage.setItem('morningCheckin', JSON.stringify(formData));
    
    // 送信成功後、サンクスページに遷移
    navigate('/morning-thanks');
  };

  return (
    <div className="container" style={styles.container}>
      <div className="card" style={styles.card}>
        <div className="card-header" style={styles.cardHeader}>朝のチェックイン</div>
        <div className="card-body" style={styles.cardBody}>
          <div className="question" style={styles.question}>今朝の気分は？</div>
          <div className="emoji-buttons" style={styles.emojiButtons}>
            {['😄', '😊', '😐', '🙁', '😣'].map((emoji) => (
              <button
                key={emoji}
                className={`emoji-button ${selectedEmoji === emoji ? 'selected' : ''}`}
                style={{
                  ...styles.emojiButton,
                  ...(selectedEmoji === emoji ? styles.selectedEmojiButton : {})
                }}
                onClick={() => handleEmojiSelect(emoji)}
              >
                {emoji}
              </button>
            ))}
          </div>
          
          <div className="question" style={styles.question}>今日最も当てはまるものは？</div>
          <div className="option-buttons" style={styles.optionButtons}>
            {[
              '新しいことを学ぶことに期待している',
              '同僚との交流を楽しみにしている',
              '業務について少し不安がある'
            ].map((option) => (
              <button
                key={option}
                className={`option-button ${selectedOption === option ? 'selected' : ''}`}
                style={{
                  ...styles.optionButton,
                  ...(selectedOption === option ? styles.selectedOptionButton : {})
                }}
                onClick={() => handleOptionSelect(option)}
              >
                {selectedOption === option ? '☑️ ' : ''}
                <span style={{ fontWeight: selectedOption === option ? 'bold' : 'normal' }}>
                  {option}
                </span>
              </button>
            ))}
          </div>
          
          {error && <div style={styles.errorMessage}>{error}</div>}
          <button
            className="submit-button"
            style={styles.submitButton}
            onClick={handleSubmit}
          >
            送信
          </button>
        </div>
        <div className="footer" style={styles.footer}>
          <a
            href="#"
            className="nav-link"
            style={styles.navLink}
            onClick={(e) => {
              e.preventDefault();
              navigate('/evening-checkout');
            }}
          >
            夕方のチェックアウトへ &rarr;
          </a>
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
    backgroundColor: '#4285f4',
    color: 'white',
    textAlign: 'center',
    fontSize: '22px',
    fontWeight: '500',
  },
  cardBody: {
    padding: '30px',
  },
  question: {
    marginBottom: '25px',
    color: '#202124',
    fontSize: '18px',
    fontWeight: '500',
  },
  emojiButtons: {
    display: 'flex',
    justifyContent: 'space-between',
    marginBottom: '40px',
  },
  emojiButton: {
    width: '55px',
    height: '55px',
    borderRadius: '50%',
    border: '2px solid #4285f4',
    backgroundColor: 'white',
    fontSize: '28px',
    cursor: 'pointer',
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    transition: 'transform 0.2s, background-color 0.2s',
  },
  selectedEmojiButton: {
    backgroundColor: '#e8f0fe',
    transform: 'scale(1.05)',
    borderWidth: '3px',
  },
  optionButtons: {
    display: 'flex',
    flexDirection: 'column',
    gap: '12px',
    marginBottom: '30px',
  },
  optionButton: {
    padding: '14px 16px',
    borderRadius: '20px',
    border: '1px solid #4285f4',
    textAlign: 'left',
    cursor: 'pointer',
    fontSize: '16px',
    color: '#4285f4',
    backgroundColor: '#f0f0f0',
    transition: 'all 0.2s',
  },
  selectedOptionButton: {
    // No background color change, using checkmark and bold text instead
    borderWidth: '3px',
  },
  submitButton: {
    display: 'block',
    width: '160px',
    padding: '14px',
    borderRadius: '24px',
    border: 'none',
    backgroundColor: '#4285f4',
    color: 'white',
    textAlign: 'center',
    fontSize: '18px',
    margin: '30px auto 0',
    cursor: 'pointer',
    transition: 'background-color 0.2s',
  },
  footer: {
    marginTop: '20px',
    textAlign: 'center',
    paddingBottom: '20px',
  },
  navLink: {
    color: '#4285f4',
    textDecoration: 'none',
    fontSize: '14px',
  },
  errorMessage: {
    color: 'red',
    textAlign: 'center',
    marginBottom: '15px',
    fontWeight: '500',
  },
};

export default MorningCheckin;
