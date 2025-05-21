import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';

const WeeklySurvey = () => {
  const navigate = useNavigate();
  const [currentStep, setCurrentStep] = useState(1);
  const totalSteps = 8;
  
  // State for each question
  const [overallSatisfaction, setOverallSatisfaction] = useState(null);
  const [taskClarity, setTaskClarity] = useState(null);
  const [managerSupport, setManagerSupport] = useState(null);
  const [newLearning, setNewLearning] = useState(null);
  const [learningType, setLearningType] = useState('');
  const [concernLevel, setConcernLevel] = useState(null);
  const [selfPerformance, setSelfPerformance] = useState(null);
  const [memorableEvent, setMemorableEvent] = useState('');
  const [otherComments, setOtherComments] = useState('');
  
  // Error state
  const [error, setError] = useState('');
  
  // Progress calculation
  const progress = Math.round((currentStep / totalSteps) * 100);
  
  const handleNext = () => {
    // Validate current step
    if (currentStep === 1 && overallSatisfaction === null) {
      setError('回答を選択してください');
      return;
    }
    if (currentStep === 2 && taskClarity === null) {
      setError('回答を選択してください');
      return;
    }
    if (currentStep === 3 && managerSupport === null) {
      setError('回答を選択してください');
      return;
    }
    if (currentStep === 4 && newLearning === null) {
      setError('回答を選択してください');
      return;
    }
    if (currentStep === 4 && newLearning === 'yes' && learningType === '') {
      setError('学びの種類を選択してください');
      return;
    }
    if (currentStep === 5 && concernLevel === null) {
      setError('回答を選択してください');
      return;
    }
    if (currentStep === 6 && selfPerformance === null) {
      setError('回答を選択してください');
      return;
    }
    
    // Clear error and move to next step
    setError('');
    if (currentStep < totalSteps) {
      setCurrentStep(currentStep + 1);
    }
  };
  
  const handlePrevious = () => {
    if (currentStep > 1) {
      setCurrentStep(currentStep - 1);
      setError('');
    }
  };
  
  const handleSubmit = () => {
    // Prepare survey data
    const surveyData = {
      overallSatisfaction,
      taskClarity,
      managerSupport,
      newLearning,
      learningType: newLearning === 'yes' ? learningType : null,
      concernLevel,
      selfPerformance,
      memorableEvent,
      otherComments,
      timestamp: new Date().toISOString(),
      weekNumber: getWeekNumber()
    };
    
    // Log data (in a real app, this would be sent to a server)
    console.log('Weekly Survey Data:', surveyData);
    
    // Save to localStorage
    const previousSurveys = JSON.parse(localStorage.getItem('weeklySurveys') || '[]');
    previousSurveys.push(surveyData);
    localStorage.setItem('weeklySurveys', JSON.stringify(previousSurveys));
    
    // Navigate to thank you page
    navigate('/weekly-survey-thanks');
  };
  
  // Helper function to get the current week number
  const getWeekNumber = () => {
    const now = new Date();
    const onejan = new Date(now.getFullYear(), 0, 1);
    return Math.ceil((((now.getTime() - onejan.getTime()) / 86400000) + onejan.getDay() + 1) / 7);
  };
  
  // Render different question based on current step
  const renderQuestion = () => {
    switch (currentStep) {
      case 1:
        return (
          <div style={styles.questionContainer}>
            <h3 style={styles.questionTitle}>今週のオンボーディング全体の満足度を教えてください</h3>
            <div style={styles.likertContainer}>
              {[1, 2, 3, 4, 5].map((value) => (
                <div 
                  key={value} 
                  style={{
                    ...styles.likertOption,
                    ...(overallSatisfaction === value ? styles.selectedLikertOption : {})
                  }}
                  onClick={() => setOverallSatisfaction(value)}
                >
                  <div style={styles.likertNumber}>{value}</div>
                  <div style={styles.likertLabel}>
                    {value === 1 ? '非常に不満' : 
                     value === 2 ? '不満' : 
                     value === 3 ? 'どちらともいえない' : 
                     value === 4 ? '満足' : '非常に満足'}
                  </div>
                </div>
              ))}
            </div>
          </div>
        );
        
      case 2:
        return (
          <div style={styles.questionContainer}>
            <h3 style={styles.questionTitle}>今週取り組んだ業務内容は明確でしたか？</h3>
            <div style={styles.likertContainer}>
              {[1, 2, 3, 4, 5].map((value) => (
                <div 
                  key={value} 
                  style={{
                    ...styles.likertOption,
                    ...(taskClarity === value ? styles.selectedLikertOption : {})
                  }}
                  onClick={() => setTaskClarity(value)}
                >
                  <div style={styles.likertNumber}>{value}</div>
                  <div style={styles.likertLabel}>
                    {value === 1 ? '全く不明確' : 
                     value === 2 ? '不明確' : 
                     value === 3 ? 'どちらともいえない' : 
                     value === 4 ? '明確' : '非常に明確'}
                  </div>
                </div>
              ))}
            </div>
          </div>
        );
        
      case 3:
        return (
          <div style={styles.questionContainer}>
            <h3 style={styles.questionTitle}>マネージャー／メンターからのサポートを実感できましたか？</h3>
            <div style={styles.likertContainer}>
              {[1, 2, 3, 4, 5].map((value) => (
                <div 
                  key={value} 
                  style={{
                    ...styles.likertOption,
                    ...(managerSupport === value ? styles.selectedLikertOption : {})
                  }}
                  onClick={() => setManagerSupport(value)}
                >
                  <div style={styles.likertNumber}>{value}</div>
                  <div style={styles.likertLabel}>
                    {value === 1 ? '全く感じない' : 
                     value === 2 ? 'あまり感じない' : 
                     value === 3 ? 'どちらともいえない' : 
                     value === 4 ? '感じる' : '非常に感じる'}
                  </div>
                </div>
              ))}
            </div>
          </div>
        );
        
      case 4:
        return (
          <div style={styles.questionContainer}>
            <h3 style={styles.questionTitle}>今週、新しく学んだこと・得た気づきはありますか？</h3>
            <div style={styles.binaryOptions}>
              <div 
                style={{
                  ...styles.binaryOption,
                  ...(newLearning === 'yes' ? styles.selectedBinaryOption : {})
                }}
                onClick={() => setNewLearning('yes')}
              >
                有
              </div>
              <div 
                style={{
                  ...styles.binaryOption,
                  ...(newLearning === 'no' ? styles.selectedBinaryOption : {})
                }}
                onClick={() => setNewLearning('no')}
              >
                無
              </div>
            </div>
            
            {newLearning === 'yes' && (
              <div style={styles.dropdownContainer}>
                <label style={styles.dropdownLabel}>どのような学びでしたか？</label>
                <select 
                  style={styles.dropdown}
                  value={learningType}
                  onChange={(e) => setLearningType(e.target.value)}
                >
                  <option value="">選択してください</option>
                  <option value="knowledge">知識</option>
                  <option value="skill">スキル</option>
                  <option value="organization">組織理解</option>
                  <option value="other">その他</option>
                </select>
              </div>
            )}
          </div>
        );
        
      case 5:
        return (
          <div style={styles.questionContainer}>
            <h3 style={styles.questionTitle}>今週の業務や職場環境に対して、どの程度不安やモヤモヤを感じましたか？</h3>
            <div style={styles.emojiContainer}>
              <div 
                style={{
                  ...styles.emojiOption,
                  ...(concernLevel === 'none' ? styles.selectedEmojiOption : {})
                }}
                onClick={() => setConcernLevel('none')}
              >
                <div style={styles.emoji}>😃</div>
                <div style={styles.emojiLabel}>問題なし</div>
              </div>
              <div 
                style={{
                  ...styles.emojiOption,
                  ...(concernLevel === 'slight' ? styles.selectedEmojiOption : {})
                }}
                onClick={() => setConcernLevel('slight')}
              >
                <div style={styles.emoji}>😐</div>
                <div style={styles.emojiLabel}>やや気になる</div>
              </div>
              <div 
                style={{
                  ...styles.emojiOption,
                  ...(concernLevel === 'moderate' ? styles.selectedEmojiOption : {})
                }}
                onClick={() => setConcernLevel('moderate')}
              >
                <div style={styles.emoji}>😟</div>
                <div style={styles.emojiLabel}>かなり気になる</div>
              </div>
              <div 
                style={{
                  ...styles.emojiOption,
                  ...(concernLevel === 'severe' ? styles.selectedEmojiOption : {})
                }}
                onClick={() => setConcernLevel('severe')}
              >
                <div style={styles.emoji}>😰</div>
                <div style={styles.emojiLabel}>非常に不安</div>
              </div>
              <div 
                style={{
                  ...styles.emojiOption,
                  ...(concernLevel === 'unknown' ? styles.selectedEmojiOption : {})
                }}
                onClick={() => setConcernLevel('unknown')}
              >
                <div style={styles.emoji}>❓</div>
                <div style={styles.emojiLabel}>どちらともいえない・その他</div>
              </div>
            </div>
          </div>
        );
        
      case 6:
        return (
          <div style={styles.questionContainer}>
            <h3 style={styles.questionTitle}>あなた自身の1週間のパフォーマンスを自己評価してください</h3>
            <div style={styles.likertContainer}>
              {[1, 2, 3, 4, 5].map((value) => (
                <div 
                  key={value} 
                  style={{
                    ...styles.likertOption,
                    ...(selfPerformance === value ? styles.selectedLikertOption : {})
                  }}
                  onClick={() => setSelfPerformance(value)}
                >
                  <div style={styles.likertNumber}>{value}</div>
                  <div style={styles.likertLabel}>
                    {value === 1 ? '全く発揮できなかった' : 
                     value === 2 ? 'あまり発揮できなかった' : 
                     value === 3 ? 'どちらともいえない' : 
                     value === 4 ? '発揮できた' : '十分に発揮できた'}
                  </div>
                </div>
              ))}
            </div>
          </div>
        );
        
      case 7:
        return (
          <div style={styles.questionContainer}>
            <h3 style={styles.questionTitle}>今週、最も印象に残った出来事や課題は何ですか？（任意）</h3>
            <textarea
              style={styles.textArea}
              value={memorableEvent}
              onChange={(e) => setMemorableEvent(e.target.value)}
              placeholder="自由に記入してください"
              rows={5}
            />
          </div>
        );
        
      case 8:
        return (
          <div style={styles.questionContainer}>
            <h3 style={styles.questionTitle}>その他ご意見・ご要望、相談したいことがあればご記入ください。（任意）</h3>
            <textarea
              style={styles.textArea}
              value={otherComments}
              onChange={(e) => setOtherComments(e.target.value)}
              placeholder="自由に記入してください"
              rows={5}
            />
          </div>
        );
        
      default:
        return null;
    }
  };
  
  return (
    <div style={styles.container}>
      <div style={styles.card}>
        <div style={styles.header}>
          <h2 style={styles.title}>週次サーベイ</h2>
          <div style={styles.weekInfo}>第{getWeekNumber()}週</div>
        </div>
        
        <div style={styles.progressContainer}>
          <div style={styles.progressText}>質問 {currentStep} / {totalSteps}</div>
          <div style={styles.progressBarContainer}>
            <div style={{...styles.progressBar, width: `${progress}%`}}></div>
          </div>
        </div>
        
        {renderQuestion()}
        
        {error && <div style={styles.errorMessage}>{error}</div>}
        
        <div style={styles.buttonContainer}>
          {currentStep > 1 && (
            <button style={styles.prevButton} onClick={handlePrevious}>
              前へ
            </button>
          )}
          
          {currentStep < totalSteps ? (
            <button style={styles.nextButton} onClick={handleNext}>
              次へ
            </button>
          ) : (
            <button style={styles.submitButton} onClick={handleSubmit}>
              送信
            </button>
          )}
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
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  title: {
    margin: 0,
    fontSize: '24px',
    fontWeight: '600',
    color: '#333',
  },
  weekInfo: {
    fontSize: '16px',
    color: '#666',
    fontWeight: '500',
  },
  progressContainer: {
    marginBottom: '30px',
  },
  progressText: {
    fontSize: '14px',
    color: '#666',
    marginBottom: '8px',
  },
  progressBarContainer: {
    height: '8px',
    backgroundColor: '#eee',
    borderRadius: '4px',
    overflow: 'hidden',
  },
  progressBar: {
    height: '100%',
    backgroundColor: '#4285f4',
    borderRadius: '4px',
    transition: 'width 0.3s ease',
  },
  questionContainer: {
    marginBottom: '30px',
  },
  questionTitle: {
    fontSize: '18px',
    fontWeight: '500',
    marginBottom: '20px',
    color: '#333',
  },
  likertContainer: {
    display: 'flex',
    justifyContent: 'space-between',
    flexWrap: 'wrap',
    gap: '10px',
  },
  likertOption: {
    flex: '1 0 18%',
    backgroundColor: '#f0f0f0',
    borderRadius: '8px',
    padding: '15px 10px',
    textAlign: 'center',
    cursor: 'pointer',
    transition: 'all 0.2s ease',
  },
  selectedLikertOption: {
    backgroundColor: '#e3f2fd',
    borderColor: '#4285f4',
    transform: 'scale(1.05)',
    boxShadow: '0 2px 5px rgba(66, 133, 244, 0.2)',
  },
  likertNumber: {
    fontSize: '18px',
    fontWeight: 'bold',
    marginBottom: '8px',
    color: '#4285f4',
  },
  likertLabel: {
    fontSize: '12px',
    color: '#666',
  },
  binaryOptions: {
    display: 'flex',
    justifyContent: 'center',
    gap: '20px',
    marginBottom: '20px',
  },
  binaryOption: {
    padding: '15px 40px',
    backgroundColor: '#f0f0f0',
    borderRadius: '8px',
    cursor: 'pointer',
    fontSize: '16px',
    transition: 'all 0.2s ease',
  },
  selectedBinaryOption: {
    backgroundColor: '#e3f2fd',
    color: '#4285f4',
    fontWeight: 'bold',
    transform: 'scale(1.05)',
    boxShadow: '0 2px 5px rgba(66, 133, 244, 0.2)',
  },
  dropdownContainer: {
    marginTop: '20px',
  },
  dropdownLabel: {
    display: 'block',
    marginBottom: '10px',
    fontSize: '16px',
    color: '#333',
  },
  dropdown: {
    width: '100%',
    padding: '12px',
    fontSize: '16px',
    borderRadius: '8px',
    border: '1px solid #ddd',
    backgroundColor: '#fff',
  },
  emojiContainer: {
    display: 'flex',
    justifyContent: 'space-between',
    flexWrap: 'wrap',
    gap: '10px',
  },
  emojiOption: {
    flex: '1 0 18%',
    backgroundColor: '#f0f0f0',
    borderRadius: '8px',
    padding: '15px 10px',
    textAlign: 'center',
    cursor: 'pointer',
    transition: 'all 0.2s ease',
  },
  selectedEmojiOption: {
    backgroundColor: '#e3f2fd',
    borderColor: '#4285f4',
    transform: 'scale(1.05)',
    boxShadow: '0 2px 5px rgba(66, 133, 244, 0.2)',
  },
  emoji: {
    fontSize: '24px',
    marginBottom: '8px',
  },
  emojiLabel: {
    fontSize: '12px',
    color: '#666',
  },
  textArea: {
    width: '100%',
    padding: '15px',
    fontSize: '16px',
    borderRadius: '8px',
    border: '1px solid #ddd',
    resize: 'vertical',
  },
  buttonContainer: {
    display: 'flex',
    justifyContent: 'space-between',
    marginTop: '30px',
  },
  prevButton: {
    padding: '12px 25px',
    backgroundColor: '#f0f0f0',
    color: '#333',
    border: 'none',
    borderRadius: '8px',
    fontSize: '16px',
    cursor: 'pointer',
    transition: 'background-color 0.2s',
  },
  nextButton: {
    padding: '12px 25px',
    backgroundColor: '#4285f4',
    color: 'white',
    border: 'none',
    borderRadius: '8px',
    fontSize: '16px',
    cursor: 'pointer',
    transition: 'background-color 0.2s',
    marginLeft: 'auto',
  },
  submitButton: {
    padding: '12px 25px',
    backgroundColor: '#34a853',
    color: 'white',
    border: 'none',
    borderRadius: '8px',
    fontSize: '16px',
    cursor: 'pointer',
    transition: 'background-color 0.2s',
    marginLeft: 'auto',
  },
  errorMessage: {
    color: 'red',
    textAlign: 'center',
    marginBottom: '15px',
    fontWeight: '500',
  },
};

export default WeeklySurvey;
