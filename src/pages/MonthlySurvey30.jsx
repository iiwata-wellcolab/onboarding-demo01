import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';

const MonthlySurvey30 = () => {
  const navigate = useNavigate();
  const [currentStep, setCurrentStep] = useState(1);
  const totalSteps = 7;
  
  // State for each question
  const [autonomy, setAutonomy] = useState(null);
  const [relatedness, setRelatedness] = useState(null);
  const [competence, setCompetence] = useState(null);
  const [managerFeedback, setManagerFeedback] = useState('');
  const [companyImpression, setCompanyImpression] = useState('');
  const [companyImpressionDetail, setCompanyImpressionDetail] = useState('');
  const [onboardingFeedback, setOnboardingFeedback] = useState('');
  const [overallSatisfaction, setOverallSatisfaction] = useState(null);
  
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
    if (currentStep === 5 && companyImpression === '') {
      setError('回答を選択してください');
      return;
    }
    if (currentStep === 5 && companyImpression === '期待以下' && companyImpressionDetail === '') {
      setError('具体的なギャップについて記入してください');
      return;
    }
    if (currentStep === 7 && overallSatisfaction === null) {
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
      managerFeedback,
      companyImpression,
      companyImpressionDetail: companyImpression === '期待以下' ? companyImpressionDetail : '',
      onboardingFeedback,
      overallSatisfaction,
      timestamp: new Date().toISOString(),
      surveyType: '入社後1か月マンスリーサーベイ'
    };
    
    // Log data (in a real app, this would be sent to a server)
    console.log('Monthly Survey Data (30 days):', surveyData);
    
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
            <h3 style={styles.questionTitle}>Q1-1. 今の業務で、自分の判断で進められる範囲は十分だと感じますか？</h3>
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
                    {value === 1 && 'まったく感じない'}
                    {value === 2 && 'あまり感じない'}
                    {value === 3 && 'どちらともいえない'}
                    {value === 4 && 'やや感じる'}
                    {value === 5 && '十分感じる'}
                  </div>
                </div>
              ))}
            </div>
          </div>
        );
      
      case 2:
        return (
          <div style={styles.questionContainer}>
            <h3 style={styles.questionTitle}>Q1-2. チームメンバーや先輩との関係・協力体制に満足していますか？</h3>
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
                    {value === 1 && 'まったく満足していない'}
                    {value === 2 && 'あまり満足していない'}
                    {value === 3 && 'どちらともいえない'}
                    {value === 4 && 'やや満足'}
                    {value === 5 && '非常に満足'}
                  </div>
                </div>
              ))}
            </div>
          </div>
        );
      
      case 3:
        return (
          <div style={styles.questionContainer}>
            <h3 style={styles.questionTitle}>Q1-3. 必要なスキルや知識は、現状十分習得できていると感じますか？</h3>
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
                    {value === 1 && '全く自信がない'}
                    {value === 2 && 'あまり自信がない'}
                    {value === 3 && 'どちらともいえない'}
                    {value === 4 && 'やや自信がある'}
                    {value === 5 && '自信を持っている'}
                  </div>
                </div>
              ))}
            </div>
          </div>
        );
      
      case 4:
        return (
          <div style={styles.questionContainer}>
            <h3 style={styles.questionTitle}>Q1-4. 直属のマネージャーまたはメンターへのフィードバック（改善点や感謝したい点）があればご記入ください。</h3>
            <textarea
              style={styles.textArea}
              placeholder="自由にご記入ください（任意）"
              value={managerFeedback}
              onChange={(e) => setManagerFeedback(e.target.value)}
              rows={5}
            />
          </div>
        );
      
      case 5:
        return (
          <div style={styles.questionContainer}>
            <h3 style={styles.questionTitle}>Q1-5. 入社前に抱いていた期待と、実際の会社・業務とのギャップはありますか？</h3>
            <div style={styles.optionsContainer}>
              {['期待以上', '期待通り', '期待以下', 'わからない'].map((option) => (
                <div 
                  key={option} 
                  style={{
                    ...styles.radioOption,
                    ...(companyImpression === option ? styles.selectedRadioOption : {})
                  }}
                  onClick={() => setCompanyImpression(option)}
                >
                  {option}
                </div>
              ))}
            </div>
            
            {companyImpression === '期待以下' && (
              <div style={styles.conditionalInput}>
                <label style={styles.conditionalLabel}>具体的なギャップについて教えてください：</label>
                <textarea
                  style={styles.textArea}
                  placeholder="具体的に記入してください"
                  value={companyImpressionDetail}
                  onChange={(e) => setCompanyImpressionDetail(e.target.value)}
                  rows={4}
                />
              </div>
            )}
          </div>
        );
      
      case 6:
        return (
          <div style={styles.questionContainer}>
            <h3 style={styles.questionTitle}>Q1-6. 入社時のオリエンテーションや研修で、特に改善してほしいポイントはありますか？</h3>
            <textarea
              style={styles.textArea}
              placeholder="自由にご記入ください（任意）"
              value={onboardingFeedback}
              onChange={(e) => setOnboardingFeedback(e.target.value)}
              rows={5}
            />
          </div>
        );
      
      case 7:
        return (
          <div style={styles.questionContainer}>
            <h3 style={styles.questionTitle}>Q1-7. 1か月間を通じて、当社で働くことにどの程度満足していますか？</h3>
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
                    {value === 1 && '非常に不満'}
                    {value === 2 && 'やや不満'}
                    {value === 3 && 'どちらともいえない'}
                    {value === 4 && 'やや満足'}
                    {value === 5 && '非常に満足'}
                  </div>
                </div>
              ))}
            </div>
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
          <h2 style={styles.title}>入社後1か月マンスリーサーベイ</h2>
          <p style={styles.surveyInfo}>所要時間：5～7分</p>
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
    flexWrap: 'wrap',
    gap: '15px',
    marginBottom: '20px',
  },
  radioOption: {
    flex: '1 0 45%',
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
    transform: 'scale(1.05)',
    boxShadow: '0 2px 5px rgba(66, 133, 244, 0.2)',
  },
  conditionalInput: {
    marginTop: '20px',
    padding: '15px',
    backgroundColor: '#f9f9f9',
    borderRadius: '8px',
    borderLeft: '4px solid #4285f4',
  },
  conditionalLabel: {
    display: 'block',
    marginBottom: '10px',
    fontWeight: '500',
    color: '#333',
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

export default MonthlySurvey30;
