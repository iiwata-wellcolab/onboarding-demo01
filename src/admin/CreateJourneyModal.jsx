import React, { useState } from 'react';
import './modal-styles.css';

// ステップコンポーネント
import Step1BasicInfo from './journey-steps/Step1BasicInfo';
import Step2Tasks from './journey-steps/Step2Tasks';
import Step3Resources from './journey-steps/Step3Resources';
import Step4Confirm from './journey-steps/Step4Confirm';

const CreateJourneyModal = ({ isOpen, onClose, onSave }) => {
  const [currentStep, setCurrentStep] = useState(1);
  const [journeyData, setJourneyData] = useState({
    title: '',
    description: '',
    department: '',
    duration: '',
    status: 'draft',
    tasks: [],
    resources: []
  });

  // 各ステップのデータを更新する関数
  const updateJourneyData = (data) => {
    setJourneyData(prevData => ({
      ...prevData,
      ...data
    }));
  };

  // 次のステップに進む
  const goToNextStep = () => {
    if (currentStep < 4) {
      setCurrentStep(currentStep + 1);
    } else {
      // 最終ステップで保存
      onSave(journeyData);
      onClose();
    }
  };

  // 前のステップに戻る
  const goToPrevStep = () => {
    if (currentStep > 1) {
      setCurrentStep(currentStep - 1);
    } else {
      onClose();
    }
  };

  // モーダルが閉じている場合は何も表示しない
  if (!isOpen) return null;

  // 現在のステップに応じたコンポーネントを表示
  const renderStepContent = () => {
    switch (currentStep) {
      case 1:
        return (
          <Step1BasicInfo 
            journeyData={journeyData} 
            updateJourneyData={updateJourneyData} 
            onNext={goToNextStep} 
            onCancel={onClose} 
          />
        );
      case 2:
        return (
          <Step2Tasks 
            journeyData={journeyData} 
            updateJourneyData={updateJourneyData} 
            onNext={goToNextStep} 
            onBack={goToPrevStep} 
          />
        );
      case 3:
        return (
          <Step3Resources 
            journeyData={journeyData} 
            updateJourneyData={updateJourneyData} 
            onNext={goToNextStep} 
            onBack={goToPrevStep} 
          />
        );
      case 4:
        return (
          <Step4Confirm 
            journeyData={journeyData} 
            onSave={goToNextStep} 
            onBack={goToPrevStep} 
          />
        );
      default:
        return null;
    }
  };

  return (
    <div className="modal-overlay">
      <div className="modal-container">
        <div className="modal-header">
          <h2>オンボーディングジャーニー作成</h2>
          <div className="step-indicator">
            <div className={`step-circle ${currentStep >= 1 ? 'active' : ''}`}>1</div>
            <div className={`step-line ${currentStep >= 2 ? 'active' : ''}`}></div>
            <div className={`step-circle ${currentStep >= 2 ? 'active' : ''}`}>2</div>
            <div className={`step-line ${currentStep >= 3 ? 'active' : ''}`}></div>
            <div className={`step-circle ${currentStep >= 3 ? 'active' : ''}`}>3</div>
            <div className={`step-line ${currentStep >= 4 ? 'active' : ''}`}></div>
            <div className={`step-circle ${currentStep >= 4 ? 'active' : ''}`}>4</div>
          </div>
          <button className="modal-close-btn" onClick={onClose}>×</button>
        </div>
        <div className="modal-content">
          {renderStepContent()}
        </div>
      </div>
    </div>
  );
};

export default CreateJourneyModal;
