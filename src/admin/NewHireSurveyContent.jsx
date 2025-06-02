import React, { useState } from 'react';
import './AdminStyles.css';
import './employee-styles.css';

// 新入社員詳細画面のサーベイタブコンテンツコンポーネント
const NewHireSurveyContent = ({ employeeData }) => {
  // サーベイタブの状態管理
  const [activeSurveyTab, setActiveSurveyTab] = useState('summary');

  // サーベイアラートデータ（実際のアプリケーションではAPIから取得）
  const alertData = {
    id: 1632, 
    name: '渡辺 悠希', 
    department: 'エンジニアリング部',
    riskScore: 75, 
    triggers: [
      { type: '日次', detail: '朝のネガティブ連続: emojiスコア ≤2 が連続3日' },
      { type: '週次', detail: '低評価設問: 全設問のうち３問が１～２評価' },
      { type: '月次', detail: 'SDT低評価: 自律性で１評価' }
    ],
    joinDate: '2025/02/01'
  };
  
  // 日次サーベイデータ（実際のアプリケーションではAPIから取得）
  const dailySurveyData = [
    {
      date: '2025年6月10日',
      morning: {
        type: '朝のチェックイン',
        mood: 2,
        feeling: '業務について少し不安がある'
      },
      evening: {
        type: '夕方のチェックアウト',
        satisfaction: 4,
        experience: 'サポートが必要だと感じた'
      }
    },
    {
      date: '2025年6月9日',
      morning: {
        type: '朝のチェックイン',
        mood: 2,
        feeling: '業務について少し不安がある'
      },
      evening: {
        type: '夕方のチェックアウト',
        satisfaction: 5,
        experience: '新しいことを学べた'
      }
    },
    {
      date: '2025年6月8日',
      morning: {
        type: '朝のチェックイン',
        mood: 2,
        feeling: '業務について少し不安がある'
      },
      evening: {
        type: '夕方のチェックアウト',
        satisfaction: 3,
        experience: 'サポートが必要だと感じた'
      }
    }
  ];

  // 週次サーベイデータ（実際のアプリケーションではAPIから取得）
  const weeklySurveyData = [
    {
      date: '2025年6月5日',
      type: '週次サーベイ Week 9',
      workSatisfaction: 2.5,
      teamCommunication: 3.0,
      learningProgress: 2.0,
      overallSatisfaction: 2.5,
      comment: "チームとのコミュニケーションに課題を感じています。もう少しサポートがあると助かります。"
    },
    {
      date: '2025年5月29日',
      type: '週次サーベイ Week 8',
      workSatisfaction: 3.5,
      teamCommunication: 3.5,
      learningProgress: 3.0,
      overallSatisfaction: 3.3,
      comment: "先週よりは業務に慣れてきましたが、まだ自信が持てない部分があります。"
    },
    {
      date: '2025年5月22日',
      type: '週次サーベイ Week 7',
      workSatisfaction: 3.0,
      teamCommunication: 4.0,
      learningProgress: 3.5,
      overallSatisfaction: 3.5,
      comment: "チームの雰囲気は良く、サポートしてもらえていますが、業務の量が多く少し大変です。"
    }
  ];

  // マンスリーサーベイデータ（実際のアプリケーションではAPIから取得）
  const monthlySurveyData = [
    {
      date: '2025年6月1日',
      type: '入社60日サーベイ',
      autonomy: 1,
      relatedness: 3,
      competence: 2,
      overallSatisfaction: 2.0,
      comment: "自分で判断する機会が少なく、もっと補量を持ちたいと感じています。他部署とのコミュニケーションももっと必要だと感じます。"
    },
    {
      date: '2025年5月1日',
      type: '入社30日サーベイ',
      autonomy: 2,
      relatedness: 3,
      competence: 3,
      overallSatisfaction: 2.7,
      comment: "まだ業務に慣れていませんが、少しずつ理解できるようになってきました。マネージャーとの1on1は役立っていますが、もっと頑張りたいです。"
    }
  ];
  
  // 最新サーベイデータ（表示用）
  const surveyData = [
    {
      date: '2025年6月1日',
      type: '入社60日サーベイ',
      overallSatisfaction: 2.0,
      workEnvironment: 2.5,
      jobContent: 1.5,
      supportSystem: 3.0,
      comment: "自分で判断する機会が少なく、もっと補量を持ちたいと感じています。他部署とのコミュニケーションももっと必要だと感じます。"
    }
  ];

  // サーベイの評価ステータスを取得
  const getStatusClass = (score) => {
    if (score === null) return '';
    if (score >= 4.0) return 'status-good';
    if (score >= 3.0) return 'status-warning';
    return 'status-alert';
  };
  
  // サーベイタブ切り替え処理
  const handleSurveyTabChange = (tab) => {
    setActiveSurveyTab(tab);
  };

  // スタイル定義
  const contentContainerStyle = {
    padding: '20px',
    backgroundColor: '#fff',
    borderRadius: '4px',
    boxShadow: '0 1px 3px rgba(0, 0, 0, 0.1)',
    margin: '20px 0',
    height: 'calc(100vh - 180px)',
    overflowY: 'auto'
  };

  const headingStyle = {
    fontSize: '24px',
    fontWeight: 'bold',
    marginBottom: '16px',
    color: '#333',
    borderBottom: '1px solid #eee',
    paddingBottom: '10px'
  };

  // サーベイタブのスタイル
  const tabsContainerStyle = {
    display: 'flex',
    borderBottom: '1px solid #eee',
    marginBottom: '20px'
  };

  const tabStyle = {
    padding: '10px 20px',
    cursor: 'pointer',
    borderBottom: '3px solid transparent',
    color: '#666'
  };

  const activeTabStyle = {
    ...tabStyle,
    borderBottom: '3px solid #0a5275',
    color: '#0a5275',
    fontWeight: 'bold'
  };

  return (
    <div className="content-container" style={contentContainerStyle}>
      <h2 style={headingStyle}>サーベイ回答履歴</h2>
      
      {/* サーベイタブ */}
      <div style={tabsContainerStyle}>
        <div 
          style={activeSurveyTab === 'summary' ? activeTabStyle : tabStyle}
          onClick={() => handleSurveyTabChange('summary')}
        >
          サマリー
        </div>
        <div 
          style={activeSurveyTab === 'daily' ? activeTabStyle : tabStyle}
          onClick={() => handleSurveyTabChange('daily')}
        >
          日次
        </div>
        <div 
          style={activeSurveyTab === 'weekly' ? activeTabStyle : tabStyle}
          onClick={() => handleSurveyTabChange('weekly')}
        >
          週次
        </div>
        <div 
          style={activeSurveyTab === 'monthly' ? activeTabStyle : tabStyle}
          onClick={() => handleSurveyTabChange('monthly')}
        >
          月次
        </div>
      </div>

      {/* サーベイコンテンツ */}
      {activeSurveyTab === 'summary' && (
        <div className="survey-summary">
          {/* アラートセクション */}
          <div className="alert-section" style={{ 
            backgroundColor: '#fff8f8', 
            border: '1px solid #ffdddd', 
            borderRadius: '4px', 
            padding: '15px',
            marginBottom: '20px'
          }}>
            <h3 style={{ color: '#d32f2f', marginBottom: '10px' }}>アラート情報</h3>
            <div style={{ display: 'flex', alignItems: 'center', marginBottom: '10px' }}>
              <div style={{ 
                width: '50px', 
                height: '50px', 
                borderRadius: '50%', 
                backgroundColor: '#d32f2f', 
                color: 'white', 
                display: 'flex', 
                alignItems: 'center', 
                justifyContent: 'center',
                fontSize: '20px',
                fontWeight: 'bold',
                marginRight: '15px'
              }}>
                {alertData.riskScore}
              </div>
              <div>
                <div style={{ fontWeight: 'bold', fontSize: '16px' }}>{employeeData?.name || alertData.name}</div>
                <div style={{ color: '#666', fontSize: '14px' }}>{alertData.department}</div>
                <div style={{ color: '#666', fontSize: '14px' }}>入社日: {alertData.joinDate}</div>
              </div>
            </div>
            <div style={{ marginTop: '10px' }}>
              <div style={{ fontWeight: 'bold', marginBottom: '5px' }}>トリガー:</div>
              <ul style={{ margin: '0', paddingLeft: '20px' }}>
                {alertData.triggers.map((trigger, index) => (
                  <li key={index} style={{ marginBottom: '5px' }}>
                    <span style={{ fontWeight: 'bold' }}>{trigger.type}:</span> {trigger.detail}
                  </li>
                ))}
              </ul>
            </div>
          </div>

          {/* 最新サーベイ結果 */}
          <div className="latest-survey" style={{ marginBottom: '20px' }}>
            <h3 style={{ marginBottom: '10px' }}>最新サーベイ結果</h3>
            <div style={{ 
              backgroundColor: '#f5f5f5', 
              borderRadius: '4px', 
              padding: '15px',
              marginBottom: '10px'
            }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '10px' }}>
                <div>
                  <div style={{ fontWeight: 'bold' }}>{surveyData[0].type}</div>
                  <div style={{ color: '#666', fontSize: '14px' }}>{surveyData[0].date}</div>
                </div>
                <div style={{ 
                  backgroundColor: getStatusClass(surveyData[0].overallSatisfaction) === 'status-good' ? '#e8f5e9' : 
                                  getStatusClass(surveyData[0].overallSatisfaction) === 'status-warning' ? '#fff8e1' : '#ffebee',
                  padding: '5px 10px',
                  borderRadius: '4px',
                  fontWeight: 'bold',
                  color: getStatusClass(surveyData[0].overallSatisfaction) === 'status-good' ? '#2e7d32' : 
                         getStatusClass(surveyData[0].overallSatisfaction) === 'status-warning' ? '#f57f17' : '#c62828'
                }}>
                  総合評価: {surveyData[0].overallSatisfaction.toFixed(1)}
                </div>
              </div>
              
              {/* 評価項目 */}
              <div style={{ marginBottom: '10px' }}>
                <div style={{ marginBottom: '8px' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '3px' }}>
                    <span>仕事環境</span>
                    <span style={{ 
                      fontWeight: 'bold',
                      color: getStatusClass(surveyData[0].workEnvironment) === 'status-good' ? '#2e7d32' : 
                             getStatusClass(surveyData[0].workEnvironment) === 'status-warning' ? '#f57f17' : '#c62828'
                    }}>
                      {surveyData[0].workEnvironment.toFixed(1)}
                    </span>
                  </div>
                  <div style={{ 
                    height: '8px', 
                    backgroundColor: '#e0e0e0', 
                    borderRadius: '4px',
                    overflow: 'hidden'
                  }}>
                    <div style={{ 
                      height: '100%', 
                      width: `${surveyData[0].workEnvironment / 5 * 100}%`,
                      backgroundColor: getStatusClass(surveyData[0].workEnvironment) === 'status-good' ? '#4caf50' : 
                                       getStatusClass(surveyData[0].workEnvironment) === 'status-warning' ? '#ffc107' : '#f44336'
                    }}></div>
                  </div>
                </div>
                
                <div style={{ marginBottom: '8px' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '3px' }}>
                    <span>業務内容</span>
                    <span style={{ 
                      fontWeight: 'bold',
                      color: getStatusClass(surveyData[0].jobContent) === 'status-good' ? '#2e7d32' : 
                             getStatusClass(surveyData[0].jobContent) === 'status-warning' ? '#f57f17' : '#c62828'
                    }}>
                      {surveyData[0].jobContent.toFixed(1)}
                    </span>
                  </div>
                  <div style={{ 
                    height: '8px', 
                    backgroundColor: '#e0e0e0', 
                    borderRadius: '4px',
                    overflow: 'hidden'
                  }}>
                    <div style={{ 
                      height: '100%', 
                      width: `${surveyData[0].jobContent / 5 * 100}%`,
                      backgroundColor: getStatusClass(surveyData[0].jobContent) === 'status-good' ? '#4caf50' : 
                                       getStatusClass(surveyData[0].jobContent) === 'status-warning' ? '#ffc107' : '#f44336'
                    }}></div>
                  </div>
                </div>
                
                <div style={{ marginBottom: '8px' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '3px' }}>
                    <span>サポート体制</span>
                    <span style={{ 
                      fontWeight: 'bold',
                      color: getStatusClass(surveyData[0].supportSystem) === 'status-good' ? '#2e7d32' : 
                             getStatusClass(surveyData[0].supportSystem) === 'status-warning' ? '#f57f17' : '#c62828'
                    }}>
                      {surveyData[0].supportSystem.toFixed(1)}
                    </span>
                  </div>
                  <div style={{ 
                    height: '8px', 
                    backgroundColor: '#e0e0e0', 
                    borderRadius: '4px',
                    overflow: 'hidden'
                  }}>
                    <div style={{ 
                      height: '100%', 
                      width: `${surveyData[0].supportSystem / 5 * 100}%`,
                      backgroundColor: getStatusClass(surveyData[0].supportSystem) === 'status-good' ? '#4caf50' : 
                                       getStatusClass(surveyData[0].supportSystem) === 'status-warning' ? '#ffc107' : '#f44336'
                    }}></div>
                  </div>
                </div>
              </div>
              
              {/* コメント */}
              <div style={{ 
                backgroundColor: '#ffffff', 
                padding: '10px', 
                borderRadius: '4px',
                border: '1px solid #e0e0e0'
              }}>
                <div style={{ fontWeight: 'bold', marginBottom: '5px' }}>コメント:</div>
                <div style={{ fontSize: '14px' }}>{surveyData[0].comment}</div>
              </div>
            </div>
          </div>

          {/* サーベイ統計 */}
          <div className="survey-stats" style={{ marginBottom: '20px' }}>
            <h3 style={{ marginBottom: '10px' }}>サーベイ統計</h3>
            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '15px' }}>
              <div style={{ 
                flex: '1', 
                backgroundColor: '#f5f5f5', 
                padding: '15px', 
                borderRadius: '4px',
                marginRight: '10px',
                textAlign: 'center'
              }}>
                <div style={{ fontSize: '14px', color: '#666', marginBottom: '5px' }}>日次サーベイ</div>
                <div style={{ fontSize: '24px', fontWeight: 'bold' }}>{dailySurveyData.length * 2}</div>
                <div style={{ fontSize: '12px', color: '#666' }}>回答数</div>
              </div>
              <div style={{ 
                flex: '1', 
                backgroundColor: '#f5f5f5', 
                padding: '15px', 
                borderRadius: '4px',
                marginRight: '10px',
                textAlign: 'center'
              }}>
                <div style={{ fontSize: '14px', color: '#666', marginBottom: '5px' }}>週次サーベイ</div>
                <div style={{ fontSize: '24px', fontWeight: 'bold' }}>{weeklySurveyData.length}</div>
                <div style={{ fontSize: '12px', color: '#666' }}>回答数</div>
              </div>
              <div style={{ 
                flex: '1', 
                backgroundColor: '#f5f5f5', 
                padding: '15px', 
                borderRadius: '4px',
                textAlign: 'center'
              }}>
                <div style={{ fontSize: '14px', color: '#666', marginBottom: '5px' }}>月次サーベイ</div>
                <div style={{ fontSize: '24px', fontWeight: 'bold' }}>{monthlySurveyData.length}</div>
                <div style={{ fontSize: '12px', color: '#666' }}>回答数</div>
              </div>
            </div>
          </div>
        </div>
      )}
      
      {/* 日次サーベイタブ */}
      {activeSurveyTab === 'daily' && (
        <div className="daily-survey">
          <h3 style={{ marginBottom: '15px' }}>日次サーベイ回答履歴</h3>
          
          {dailySurveyData.map((day, index) => (
            <div key={index} style={{ 
              backgroundColor: '#f5f5f5', 
              borderRadius: '4px', 
              padding: '15px', 
              marginBottom: '15px',
              border: '1px solid #e0e0e0'
            }}>
              <div style={{ 
                fontWeight: 'bold', 
                marginBottom: '10px', 
                borderBottom: '1px solid #e0e0e0',
                paddingBottom: '5px'
              }}>
                {day.date}
              </div>
              
              {/* 朝のチェックイン */}
              <div style={{ 
                backgroundColor: '#ffffff', 
                padding: '10px', 
                borderRadius: '4px',
                marginBottom: '10px',
                border: '1px solid #e0e0e0'
              }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '5px' }}>
                  <div style={{ fontWeight: 'bold' }}>{day.morning.type}</div>
                  <div style={{ 
                    backgroundColor: day.morning.mood >= 4 ? '#e8f5e9' : day.morning.mood >= 3 ? '#fff8e1' : '#ffebee',
                    padding: '2px 8px',
                    borderRadius: '4px',
                    fontSize: '14px',
                    fontWeight: 'bold',
                    color: day.morning.mood >= 4 ? '#2e7d32' : day.morning.mood >= 3 ? '#f57f17' : '#c62828'
                  }}>
                    気分: {day.morning.mood}/5
                  </div>
                </div>
                <div style={{ fontSize: '14px', color: '#666' }}>
                  {day.morning.feeling}
                </div>
              </div>
              
              {/* 夕方のチェックアウト */}
              <div style={{ 
                backgroundColor: '#ffffff', 
                padding: '10px', 
                borderRadius: '4px',
                border: '1px solid #e0e0e0'
              }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '5px' }}>
                  <div style={{ fontWeight: 'bold' }}>{day.evening.type}</div>
                  <div style={{ 
                    backgroundColor: day.evening.satisfaction >= 4 ? '#e8f5e9' : day.evening.satisfaction >= 3 ? '#fff8e1' : '#ffebee',
                    padding: '2px 8px',
                    borderRadius: '4px',
                    fontSize: '14px',
                    fontWeight: 'bold',
                    color: day.evening.satisfaction >= 4 ? '#2e7d32' : day.evening.satisfaction >= 3 ? '#f57f17' : '#c62828'
                  }}>
                    満足度: {day.evening.satisfaction}/5
                  </div>
                </div>
                <div style={{ fontSize: '14px', color: '#666' }}>
                  {day.evening.experience}
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
      
      {/* 週次サーベイタブ */}
      {activeSurveyTab === 'weekly' && (
        <div className="weekly-survey">
          <h3 style={{ marginBottom: '15px' }}>週次サーベイ回答履歴</h3>
          
          {weeklySurveyData.map((survey, index) => (
            <div key={index} style={{ 
              backgroundColor: '#f5f5f5', 
              borderRadius: '4px', 
              padding: '15px', 
              marginBottom: '15px',
              border: '1px solid #e0e0e0'
            }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '10px' }}>
                <div>
                  <div style={{ fontWeight: 'bold' }}>{survey.type}</div>
                  <div style={{ color: '#666', fontSize: '14px' }}>{survey.date}</div>
                </div>
                <div style={{ 
                  backgroundColor: getStatusClass(survey.overallSatisfaction) === 'status-good' ? '#e8f5e9' : 
                                  getStatusClass(survey.overallSatisfaction) === 'status-warning' ? '#fff8e1' : '#ffebee',
                  padding: '5px 10px',
                  borderRadius: '4px',
                  fontWeight: 'bold',
                  color: getStatusClass(survey.overallSatisfaction) === 'status-good' ? '#2e7d32' : 
                         getStatusClass(survey.overallSatisfaction) === 'status-warning' ? '#f57f17' : '#c62828'
                }}>
                  総合評価: {survey.overallSatisfaction.toFixed(1)}
                </div>
              </div>
              
              {/* 評価項目 */}
              <div style={{ marginBottom: '15px' }}>
                <div style={{ marginBottom: '8px' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '3px' }}>
                    <span>業務満足度</span>
                    <span style={{ 
                      fontWeight: 'bold',
                      color: getStatusClass(survey.workSatisfaction) === 'status-good' ? '#2e7d32' : 
                             getStatusClass(survey.workSatisfaction) === 'status-warning' ? '#f57f17' : '#c62828'
                    }}>
                      {survey.workSatisfaction.toFixed(1)}
                    </span>
                  </div>
                  <div style={{ 
                    height: '8px', 
                    backgroundColor: '#e0e0e0', 
                    borderRadius: '4px',
                    overflow: 'hidden'
                  }}>
                    <div style={{ 
                      height: '100%', 
                      width: `${survey.workSatisfaction / 5 * 100}%`,
                      backgroundColor: getStatusClass(survey.workSatisfaction) === 'status-good' ? '#4caf50' : 
                                       getStatusClass(survey.workSatisfaction) === 'status-warning' ? '#ffc107' : '#f44336'
                    }}></div>
                  </div>
                </div>
                
                <div style={{ marginBottom: '8px' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '3px' }}>
                    <span>チームコミュニケーション</span>
                    <span style={{ 
                      fontWeight: 'bold',
                      color: getStatusClass(survey.teamCommunication) === 'status-good' ? '#2e7d32' : 
                             getStatusClass(survey.teamCommunication) === 'status-warning' ? '#f57f17' : '#c62828'
                    }}>
                      {survey.teamCommunication.toFixed(1)}
                    </span>
                  </div>
                  <div style={{ 
                    height: '8px', 
                    backgroundColor: '#e0e0e0', 
                    borderRadius: '4px',
                    overflow: 'hidden'
                  }}>
                    <div style={{ 
                      height: '100%', 
                      width: `${survey.teamCommunication / 5 * 100}%`,
                      backgroundColor: getStatusClass(survey.teamCommunication) === 'status-good' ? '#4caf50' : 
                                       getStatusClass(survey.teamCommunication) === 'status-warning' ? '#ffc107' : '#f44336'
                    }}></div>
                  </div>
                </div>
                
                <div style={{ marginBottom: '8px' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '3px' }}>
                    <span>学習進捗</span>
                    <span style={{ 
                      fontWeight: 'bold',
                      color: getStatusClass(survey.learningProgress) === 'status-good' ? '#2e7d32' : 
                             getStatusClass(survey.learningProgress) === 'status-warning' ? '#f57f17' : '#c62828'
                    }}>
                      {survey.learningProgress.toFixed(1)}
                    </span>
                  </div>
                  <div style={{ 
                    height: '8px', 
                    backgroundColor: '#e0e0e0', 
                    borderRadius: '4px',
                    overflow: 'hidden'
                  }}>
                    <div style={{ 
                      height: '100%', 
                      width: `${survey.learningProgress / 5 * 100}%`,
                      backgroundColor: getStatusClass(survey.learningProgress) === 'status-good' ? '#4caf50' : 
                                       getStatusClass(survey.learningProgress) === 'status-warning' ? '#ffc107' : '#f44336'
                    }}></div>
                  </div>
                </div>
              </div>
              
              {/* コメント */}
              <div style={{ 
                backgroundColor: '#ffffff', 
                padding: '10px', 
                borderRadius: '4px',
                border: '1px solid #e0e0e0'
              }}>
                <div style={{ fontWeight: 'bold', marginBottom: '5px' }}>コメント:</div>
                <div style={{ fontSize: '14px' }}>{survey.comment}</div>
              </div>
            </div>
          ))}
        </div>
      )}
      
      {/* 月次サーベイタブ */}
      {activeSurveyTab === 'monthly' && (
        <div className="monthly-survey">
          <h3 style={{ marginBottom: '15px' }}>月次サーベイ回答履歴</h3>
          
          {monthlySurveyData.map((survey, index) => (
            <div key={index} style={{ 
              backgroundColor: '#f5f5f5', 
              borderRadius: '4px', 
              padding: '15px', 
              marginBottom: '15px',
              border: '1px solid #e0e0e0'
            }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '10px' }}>
                <div>
                  <div style={{ fontWeight: 'bold' }}>{survey.type}</div>
                  <div style={{ color: '#666', fontSize: '14px' }}>{survey.date}</div>
                </div>
                <div style={{ 
                  backgroundColor: getStatusClass(survey.overallSatisfaction) === 'status-good' ? '#e8f5e9' : 
                                  getStatusClass(survey.overallSatisfaction) === 'status-warning' ? '#fff8e1' : '#ffebee',
                  padding: '5px 10px',
                  borderRadius: '4px',
                  fontWeight: 'bold',
                  color: getStatusClass(survey.overallSatisfaction) === 'status-good' ? '#2e7d32' : 
                         getStatusClass(survey.overallSatisfaction) === 'status-warning' ? '#f57f17' : '#c62828'
                }}>
                  総合評価: {survey.overallSatisfaction.toFixed(1)}
                </div>
              </div>
              
              {/* SDT評価項目 */}
              <div style={{ marginBottom: '15px' }}>
                <div style={{ marginBottom: '8px' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '3px' }}>
                    <span>自律性 (Autonomy)</span>
                    <span style={{ 
                      fontWeight: 'bold',
                      color: getStatusClass(survey.autonomy) === 'status-good' ? '#2e7d32' : 
                             getStatusClass(survey.autonomy) === 'status-warning' ? '#f57f17' : '#c62828'
                    }}>
                      {survey.autonomy}/5
                    </span>
                  </div>
                  <div style={{ 
                    height: '8px', 
                    backgroundColor: '#e0e0e0', 
                    borderRadius: '4px',
                    overflow: 'hidden'
                  }}>
                    <div style={{ 
                      height: '100%', 
                      width: `${survey.autonomy / 5 * 100}%`,
                      backgroundColor: getStatusClass(survey.autonomy) === 'status-good' ? '#4caf50' : 
                                       getStatusClass(survey.autonomy) === 'status-warning' ? '#ffc107' : '#f44336'
                    }}></div>
                  </div>
                </div>
                
                <div style={{ marginBottom: '8px' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '3px' }}>
                    <span>関係性 (Relatedness)</span>
                    <span style={{ 
                      fontWeight: 'bold',
                      color: getStatusClass(survey.relatedness) === 'status-good' ? '#2e7d32' : 
                             getStatusClass(survey.relatedness) === 'status-warning' ? '#f57f17' : '#c62828'
                    }}>
                      {survey.relatedness}/5
                    </span>
                  </div>
                  <div style={{ 
                    height: '8px', 
                    backgroundColor: '#e0e0e0', 
                    borderRadius: '4px',
                    overflow: 'hidden'
                  }}>
                    <div style={{ 
                      height: '100%', 
                      width: `${survey.relatedness / 5 * 100}%`,
                      backgroundColor: getStatusClass(survey.relatedness) === 'status-good' ? '#4caf50' : 
                                       getStatusClass(survey.relatedness) === 'status-warning' ? '#ffc107' : '#f44336'
                    }}></div>
                  </div>
                </div>
                
                <div style={{ marginBottom: '8px' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '3px' }}>
                    <span>有能感 (Competence)</span>
                    <span style={{ 
                      fontWeight: 'bold',
                      color: getStatusClass(survey.competence) === 'status-good' ? '#2e7d32' : 
                             getStatusClass(survey.competence) === 'status-warning' ? '#f57f17' : '#c62828'
                    }}>
                      {survey.competence}/5
                    </span>
                  </div>
                  <div style={{ 
                    height: '8px', 
                    backgroundColor: '#e0e0e0', 
                    borderRadius: '4px',
                    overflow: 'hidden'
                  }}>
                    <div style={{ 
                      height: '100%', 
                      width: `${survey.competence / 5 * 100}%`,
                      backgroundColor: getStatusClass(survey.competence) === 'status-good' ? '#4caf50' : 
                                       getStatusClass(survey.competence) === 'status-warning' ? '#ffc107' : '#f44336'
                    }}></div>
                  </div>
                </div>
              </div>
              
              {/* コメント */}
              <div style={{ 
                backgroundColor: '#ffffff', 
                padding: '10px', 
                borderRadius: '4px',
                border: '1px solid #e0e0e0'
              }}>
                <div style={{ fontWeight: 'bold', marginBottom: '5px' }}>コメント:</div>
                <div style={{ fontSize: '14px' }}>{survey.comment}</div>
              </div>
            </div>
          ))}
        </div>
      )}
      
    </div>
  );
};

export default NewHireSurveyContent;
