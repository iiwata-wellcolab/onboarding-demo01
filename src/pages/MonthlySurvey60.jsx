import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';

const MonthlySurvey60 = () => {
  const navigate = useNavigate();
  const [currentStep, setCurrentStep] = useState(1);
  const totalSteps = 7;
  
  // State for each question
  const [autonomy, setAutonomy] = useState(null);
  const [relatedness, setRelatedness] = useState(null);
  const [competence, setCompetence] = useState(null);
  const [learningDevelopment, setLearningDevelopment] = useState(null);
  const [managerFeedback, setManagerFeedback] = useState('');
  const [companyImpression, setCompanyImpression] = useState(null);
  const [onboardingFeedback, setOnboardingFeedback] = useState('');
  
  // Error state
  const [error, setError] = useState('');
  
  // Progress calculation
  const progress = Math.round((currentStep / totalSteps) * 100);
  
  const handleNext = () => {
    // Validate current step
    if (currentStep === 1 && autonomy === null) {
      setError('回答を選択してください');
      return;
    }
    if (currentStep === 2 && relatedness === null) {
      setError('回答を選択してください');
      return;
    }
    if (currentStep === 3 && competence === null) {
      setError('回答を選択してください');
      return;
    }
    if (currentStep === 4 && learningDevelopment === null) {
      setError('回答を選択してください');
      return;
    }
    if (currentStep === 6 && companyImpression === null) {
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
      autonomy,
      relatedness,
      competence,
      learningDevelopment,
      managerFeedback,
      companyImpression,
      onboardingFeedback,
      timestamp: new Date().toISOString(),
      surveyType: '入社後2か月マンスリーサーベイ'
    };
    
    // Log data (in a real app, this would be sent to a server)
    console.log('Monthly Survey Data (60 days):', surveyData);
    
    // Save to localStorage
    const previousSurveys = JSON.parse(localStorage.getItem('monthlySurveys') || '[]');
    previousSurveys.push(surveyData);
    localStorage.setItem('monthlySurveys', JSON.stringify(previousSurveys));
    
    // Navigate to thank you page
    navigate('/monthly-survey-thanks');
  };
  
  // Render different question based on current step
  const renderQuestion = () => {
    switch (currentStep) {
      case 1:
        return (
          <div style={styles.questionContainer}>
            <h3 style={styles.questionTitle}>Q2-1. 業務において、自分で意思決定できる余地が明確に示されていますか？</h3>
            <div style={styles.likertContainer}>
              {[1, 2, 3, 4, 5].map((value) => (
                <div 
                  key={value} 
                  style={{
                    ...styles.likertOption,
                    ...(autonomy === value ? styles.selectedLikertOption : {})
                  }}
                  onClick={() => setAutonomy(value)}
                >
                  <div style={styles.likertNumber}>{value}</div>
                  <div style={styles.likertLabel}>
                    {value === 1 && 'まったく示されていない'}
                    {value === 2 && 'あまり示されていない'}
                    {value === 3 && 'どちらともいえない'}
                    {value === 4 && 'ある程度示されている'}
                    {value === 5 && '明確に示されている'}
                  </div>
                </div>
              ))}
            </div>
          </div>
        );
      
      case 2:
        return (
          <div style={styles.questionContainer}>
            <h3 style={styles.questionTitle}>Q2-2. チーム外の他部署や関連部門とも適切にコミュニケーションがとれていますか？</h3>
            <div style={styles.likertContainer}>
              {[1, 2, 3, 4, 5].map((value) => (
                <div 
                  key={value} 
                  style={{
                    ...styles.likertOption,
                    ...(relatedness === value ? styles.selectedLikertOption : {})
                  }}
                  onClick={() => setRelatedness(value)}
                >
                  <div style={styles.likertNumber}>{value}</div>
                  <div style={styles.likertLabel}>
                    {value === 1 && 'まったくとれていない'}
                    {value === 2 && 'あまりとれていない'}
                    {value === 3 && 'どちらともいえない'}
                    {value === 4 && 'ある程度とれている'}
                    {value === 5 && '十分とれている'}
                  </div>
                </div>
              ))}
            </div>
          </div>
        );
      
      case 3:
        return (
          <div style={styles.questionContainer}>
            <h3 style={styles.questionTitle}>Q2-3. この1か月で担当業務に対する自信はどの程度向上しましたか？</h3>
            <div style={styles.likertContainer}>
              {[1, 2, 3, 4, 5].map((value) => (
                <div 
                  key={value} 
                  style={{
                    ...styles.likertOption,
                    ...(competence === value ? styles.selectedLikertOption : {})
                  }}
                  onClick={() => setCompetence(value)}
                >
                  <div style={styles.likertNumber}>{value}</div>
                  <div style={styles.likertLabel}>
                    {value === 1 && 'まったく向上していない'}
                    {value === 2 && 'あまり向上していない'}
                    {value === 3 && 'どちらともいえない'}
                    {value === 4 && 'やや向上した'}
                    {value === 5 && '大きく向上した'}
                  </div>
                </div>
              ))}
            </div>
          </div>
        );
      
      case 4:
        return (
          <div style={styles.questionContainer}>
            <h3 style={styles.questionTitle}>Q2-4. 新たに受けた研修・トレーニングの効果はいかがでしたか？</h3>
            <div style={styles.optionsContainer}>
              {[
                '非常に効果あり', 
                '効果あり', 
                'どちらともいえない', 
                'あまり効果なし', 
                '全く効果なし'
              ].map((option) => (
                <div 
                  key={option} 
                  style={{
                    ...styles.radioOption,
                    ...(learningDevelopment === option ? styles.selectedRadioOption : {})
                  }}
                  onClick={() => setLearningDevelopment(option)}
                >
                  {option}
                </div>
              ))}
            </div>
          </div>
        );
      
      case 5:
        return (
          <div style={styles.questionContainer}>
            <h3 style={styles.questionTitle}>Q2-5. 最近の1on1やフィードバック機会で、特に良かった点・改善してほしい点は？</h3>
            <textarea
              style={styles.textArea}
              placeholder="自由にご記入ください"
              value={managerFeedback}
              onChange={(e) => setManagerFeedback(e.target.value)}
              rows={5}
            />
          </div>
        );
      
      case 6:
        return (
          <div style={styles.questionContainer}>
            <h3 style={styles.questionTitle}>Q2-6. 当社の文化・バリューは、自身の価値観に合っていると感じますか？</h3>
            <div style={styles.likertContainer}>
              {[1, 2, 3, 4, 5].map((value) => (
                <div 
                  key={value} 
                  style={{
                    ...styles.likertOption,
                    ...(companyImpression === value ? styles.selectedLikertOption : {})
                  }}
                  onClick={() => setCompanyImpression(value)}
                >
                  <div style={styles.likertNumber}>{value}</div>
                  <div style={styles.likertLabel}>
                    {value === 1 && 'まったく合っていない'}
                    {value === 2 && 'あまり合っていない'}
                    {value === 3 && 'どちらともいえない'}
                    {value === 4 && 'やや合っている'}
                    {value === 5 && '非常に合っている'}
                  </div>
                </div>
              ))}
            </div>
          </div>
        );
      
      case 7:
        return (
          <div style={styles.questionContainer}>
            <h3 style={styles.questionTitle}>Q2-7. オンボーディング期間（1～2か月目）で、特に改善が必要だと思うポイントを教えてください。</h3>
            <textarea
              style={styles.textArea}
              placeholder="自由にご記入ください（任意）"
              value={onboardingFeedback}
              onChange={(e) => setOnboardingFeedback(e.target.value)}
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
          <h2 style={styles.title}>入社後2か月マンスリーサーベイ</h2>
          <p style={styles.surveyInfo}>所要時間：5～8分</p>
        </div>
        
        <div style={styles.progressContainer}>
          <div style={styles.progressText}>進捗状況: {progress}%</div>
          <div style={styles.progressBarContainer}>
            <div style={{...styles.progressBar, width: `${progress}%`}}></div>
          </div>
        </div>
        
        {error && <div style={styles.errorMessage}>{error}</div>}
        
        {renderQuestion()}
        
        <div style={styles.buttonContainer}>
          <div style={styles.buttonWrapper}>
            {currentStep > 1 && (
              <button 
                style={styles.prevButton}
                onClick={handlePrevious}
              >
                前へ
              </button>
            )}
            
            {currentStep < totalSteps ? (
              <button 
                style={styles.nextButton}
                onClick={handleNext}
              >
                次へ
              </button>
            ) : (
              <button 
                style={styles.submitButton}
                onClick={handleSubmit}
              >
                送信
              </button>
            )}
          </div>
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
    maxWidth: '800px',
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
  surveyInfo: {
    fontSize: '16px',
    color: '#666',
    fontWeight: '500',
    marginTop: '8px',
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
  optionsContainer: {
    display: 'flex',
    flexDirection: 'column',
    gap: '15px',
    marginBottom: '20px',
  },
  radioOption: {
    backgroundColor: '#f0f0f0',
    borderRadius: '8px',
    padding: '15px',
    textAlign: 'center',
    cursor: 'pointer',
    transition: 'all 0.2s ease',
  },
  selectedRadioOption: {
    backgroundColor: '#e3f2fd',
    color: '#4285f4',
    fontWeight: 'bold',
    transform: 'scale(1.02)',
    boxShadow: '0 2px 5px rgba(66, 133, 244, 0.2)',
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
    justifyContent: 'center',
    marginTop: '30px',
  },
  buttonWrapper: {
    display: 'flex',
    justifyContent: 'center',
    gap: '20px',
    width: '100%',
    maxWidth: '400px',
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
    width: '120px',
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
    width: '120px',
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
    width: '120px',
  },
  errorMessage: {
    color: 'red',
    textAlign: 'center',
    marginBottom: '15px',
    fontWeight: '500',
  },
};

export default MonthlySurvey60;
