import React from 'react';
import './AdminStyles.css';
import './employee-styles.css';
import './employee-profile-styles.css';

// 各タブのコンテンツコンポーネントをインポート
import NewHireInfoContent from './NewHireInfoContent';
import NewHireSurveyContent from './NewHireSurveyContent';
import NewHireOneOnOneContent from './NewHireOneOnOneContent';

// 新入社員詳細画面のコンテンツエリアコンポーネント
const NewHireContent = ({ 
  activeTab, 
  employeeData, 
  employeeProfile, 
  employeeMaster, 
  organization, 
  photoUrl,
  loading,
  error
}) => {
  
  // コンテンツエリアのスタイル
  const contentStyle = {
    flex: 1,
    padding: '20px',
    backgroundColor: '#fff',
    overflowY: 'auto',
  };

  // アクティブなタブに応じてコンテンツを切り替える

  // オンボーディングタブ用のコンテンツコンポーネント
  const OnboardingContent = () => {
    const iframeStyle = {
      width: '100%',
      height: 'calc(100vh - 140px)', // ヘッダーの高さを考慮
      border: 'none',
      overflow: 'hidden'
    };

    return (
      <div style={{ width: '100%', height: '100%' }}>
        <iframe 
          src="/mockups/onboarding-journey-progress.html" 
          title="オンボーディング進捗" 
          style={iframeStyle}
        />
      </div>
    );
  };

  // アクティブなタブに応じてコンテンツを切り替える
  const renderContent = () => {
    switch (activeTab) {
      case 'info':
        return (
          <NewHireInfoContent 
            employeeData={employeeData}
            employeeProfile={employeeProfile}
            employeeMaster={employeeMaster}
            organization={organization}
            photoUrl={photoUrl}
            loading={loading}
            error={error}
          />
        );
      case 'onboarding':
        return <OnboardingContent />;
      case 'survey':
        return <NewHireSurveyContent employeeData={employeeData} />;
      case '1on1':
        return <NewHireOneOnOneContent employeeData={employeeData} />;
      default:
        return (
          <NewHireInfoContent 
            employeeData={employeeData}
            employeeProfile={employeeProfile}
            employeeMaster={employeeMaster}
            organization={organization}
            photoUrl={photoUrl}
            loading={loading}
            error={error}
          />
        );
    }
  };

  return (
    <div style={contentStyle}>
      {renderContent()}
    </div>
  );
};

export default NewHireContent;
