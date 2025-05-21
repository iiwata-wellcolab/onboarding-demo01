import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

const EveningCheckout = () => {
  const [satisfaction, setSatisfaction] = useState(5);
  const [selectedOption, setSelectedOption] = useState(null);
  const [error, setError] = useState('');
  const navigate = useNavigate();

  // 朝のチェックインデータを取得（オプション）
  useEffect(() => {
    try {
      const morningData = JSON.parse(localStorage.getItem('morningCheckin'));
      if (morningData && morningData.mood) {
        console.log('今朝の気分:', morningData.mood);
        // 朝のデータを使用して何か表示する場合はここに処理を追加
      }
    } catch (e) {
      console.error('朝のデータの読み込みエラー:', e);
    }
  }, []);

  const handleSatisfactionChange = (e) => {
    setSatisfaction(e.target.value);
  };

  const handleOptionSelect = (option) => {
    setSelectedOption(option);
  };

  const handleSubmit = () => {
    // 設問２に回答しているかチェック
    if (!selectedOption) {
      setError('回答されていません');
      return;
    }
    
    // エラーをクリア
    setError('');
    
    // チェックアウトデータ収集
    const formData = {
      type: 'evening_checkout',
      satisfaction: satisfaction,
      experience: selectedOption,
      timestamp: new Date().toISOString()
    };
    
    // 実際のアプリケーションでは、ここでサーバーにデータを送信します
    console.log('夕方のチェックアウトデータ:', formData);
    
    // ローカルストレージに保存
    localStorage.setItem('eveningCheckout', JSON.stringify(formData));
    
    // 送信成功後、サンクスページに遷移
    navigate('/evening-thanks');
  };

  return (
    <div className="container" style={styles.container}>
      <div className="card" style={styles.card}>
        <div className="card-header" style={styles.cardHeader}>夕方のチェックアウト</div>
        <div className="card-body" style={styles.cardBody}>
          <div className="question" style={styles.question}>今日の充実度は？</div>
          <div className="slider-container" style={styles.sliderContainer}>
            <input
              type="range"
              min="1"
              max="10"
              value={satisfaction}
              className="slider"
              id="satisfaction-slider"
              style={styles.slider}
              onChange={handleSatisfactionChange}
            />
            <div className="slider-labels" style={styles.sliderLabels}>
              <span>あまり充実していなかった</span>
              <span>非常に充実していた</span>
            </div>
          </div>
          
          <div className="question" style={styles.question}>今日最も当てはまることは？</div>
          <div className="option-buttons" style={styles.optionButtons}>
            {[
              '新しいことを学べた',
              'チームの一員と感じられた',
              'サポートが必要だと感じた'
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
              navigate('/morning-checkin');
            }}
          >
            &larr; 朝のチェックインへ
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
    backgroundColor: '#34a853',
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
  sliderContainer: {
    marginBottom: '40px',
  },
  slider: {
    WebkitAppearance: 'none',
    width: '100%',
    height: '8px',
    borderRadius: '4px',
    background: '#e0e0e0',
    outline: 'none',
    marginBottom: '15px',
  },
  sliderLabels: {
    display: 'flex',
    justifyContent: 'space-between',
    fontSize: '14px',
    color: '#5f6368',
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
    border: '1px solid #34a853',
    textAlign: 'left',
    cursor: 'pointer',
    fontSize: '16px',
    color: '#34a853',
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
    backgroundColor: '#34a853',
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
    color: '#34a853',
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

export default EveningCheckout;
