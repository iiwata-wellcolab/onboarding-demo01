import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';

const MonthlySurvey90 = () => {
  const navigate = useNavigate();
  const [currentStep, setCurrentStep] = useState(1);
  const totalSteps = 7;
  
  // State for each question
  const [autonomy, setAutonomy] = useState(null);
  const [relatedness, setRelatedness] = useState(null);
  const [competence, setCompetence] = useState(null);
  const [careerGrowth, setCareerGrowth] = useState('');
  const [careerGrowthDetail, setCareerGrowthDetail] = useState('');
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
    if (currentStep === 4 && careerGrowth === '') {
      setError('回答を選択してください');
      return;
    }
    if (currentStep === 4 && careerGrowth === 'はい' && careerGrowthDetail === '') {
      setError('詳細を記入してください');
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
      careerGrowth,
      careerGrowthDetail: careerGrowth === 'はい' ? careerGrowthDetail : '',
      managerFeedback,
      companyImpression,
      onboardingFeedback,
      timestamp: new Date().toISOString(),
      surveyType: '入社後3か月マンスリーサーベイ'
    };
    
    // Log data (in a real app, this would be sent to a server)
    console.log('Monthly Survey Data (90 days):', surveyData);
    
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
            <h3 style={styles.questionTitle}>Q3-1. 自分の仕事に対して責任感を持ち、自律的に動けていると感じますか？</h3>
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
                    {value === 5 && '強く感じる'}
                  </div>
                </div>
              ))}
            </div>
          </div>
        );
      
      case 2:
        return (
          <div style={styles.questionContainer}>
            <h3 style={styles.questionTitle}>Q3-2. 会社全体や他部署とのつながりを感じられていますか？</h3>
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
                    {value === 1 && 'まったく感じない'}
                    {value === 2 && 'あまり感じない'}
                    {value === 3 && 'どちらともいえない'}
                    {value === 4 && 'やや感じる'}
                    {value === 5 && '強く感じる'}
                  </div>
                </div>
              ))}
            </div>
          </div>
        );
      
      case 3:
        return (
          <div style={styles.questionContainer}>
            <h3 style={styles.questionTitle}>Q3-3. これまでの1～3か月で、自身の成長や成果に自信を持てていますか？</h3>
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
                    {value === 1 && 'まったく自信がない'}
                    {value === 2 && 'あまり自信がない'}
                    {value === 3 && 'どちらともいえない'}
                    {value === 4 && 'やや自信がある'}
                    {value === 5 && '強く自信がある'}
                  </div>
                </div>
              ))}
            </div>
          </div>
        );
      
      case 4:
        return (
          <div style={styles.questionContainer}>
            <h3 style={styles.questionTitle}>Q3-4. 今後のキャリア（1年後、3年後）について、マネージャーと具体的に話しましたか？</h3>
            <div style={styles.binaryOptions}>
              <div 
                style={{
                  ...styles.binaryOption,
                  ...(careerGrowth === 'はい' ? styles.selectedBinaryOption : {})
                }}
                onClick={() => setCareerGrowth('はい')}
              >
                はい
              </div>
              <div 
                style={{
                  ...styles.binaryOption,
                  ...(careerGrowth === 'いいえ' ? styles.selectedBinaryOption : {})
                }}
                onClick={() => setCareerGrowth('いいえ')}
              >
                いいえ
              </div>
            </div>
            
            {careerGrowth === 'はい' && (
              <div style={styles.conditionalInput}>
                <label style={styles.conditionalLabel}>話し合った内容を簡単に要約してください：</label>
                <textarea
                  style={styles.textArea}
                  placeholder="キャリアについて話し合った内容を簡潔に記入してください"
                  value={careerGrowthDetail}
                  onChange={(e) => setCareerGrowthDetail(e.target.value)}
                  rows={4}
                />
              </div>
            )}
          </div>
        );
      
      case 5:
        return (
          <div style={styles.questionContainer}>
            <h3 style={styles.questionTitle}>Q3-5. マネージャー／メンターのサポートで、特に有効だった点と、今後期待したい点を教えてください。</h3>
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
            <h3 style={styles.questionTitle}>Q3-6. 当社で今後長く働きたいと思えますか？</h3>
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
                    {value === 1 && '全く思わない'}
                    {value === 2 && 'あまり思わない'}
                    {value === 3 && 'どちらともいえない'}
                    {value === 4 && 'やや思う'}
                    {value === 5 && '強く思う'}
                  </div>
                </div>
              ))}
            </div>
          </div>
        );
      
      case 7:
        return (
          <div style={styles.questionContainer}>
            <h3 style={styles.questionTitle}>Q3-7. 入社時～3か月のオンボーディング体験全体を振り返り、最も改善してほしい点を教えてください。</h3>
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
          <h2 style={styles.title}>入社後3か月マンスリーサーベイ</h2>
          <p style={styles.surveyInfo}>所要時間：6～8分</p>
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

export default MonthlySurvey90;
