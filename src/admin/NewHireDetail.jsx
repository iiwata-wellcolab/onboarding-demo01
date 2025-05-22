import React, { useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import './AdminStyles.css';
import OneOnOneCard from './OneOnOneCard';

const NewHireDetail = () => {
  const [activeTab, setActiveTab] = useState('info');
  const [activeSurveyTab, setActiveSurveyTab] = useState('daily');
  const [activeOneOnOneTab, setActiveOneOnOneTab] = useState('upcoming');
  const navigate = useNavigate();
  const { id } = useParams();

  // 新入社員データ（実際のアプリケーションではAPIから取得）
  const employeeData = {
    id: id || '1632',
    name: '渡辺 悠希',
    nameKana: 'ワタナベ ユウキ',
    title: '新入社員',
    department: 'エンジニアリング部',
    joinDate: '2025年2月1日',
    email: 'y.watanabe@example.co.jp',
    extension: '1056',
    manager: '中村 太陽',
    mentor: '大原 孝之',
    organization: ['株式会社Example', 'エンジニアリング本部', 'エンジニアリング部'],
    history: [
      { date: '2025年2月1日 - 現在', description: 'エンジニアリング部 新入社員チーム', isCurrent: true }
    ],
    certifications: [
      { title: 'AWS Certified Solutions Architect – Associate', date: '2025年2月取得' }
    ],
    profile: '大学では情報工学を専攻し、特に機械学習とデータサイエンスに興味を持っています。趣味はプログラミングで、個人プロジェクトとしてWebアプリケーションの開発を行っています。',
    profileExtended: '技術的な成長を重視し、特にAIや機械学習の分野で専門性を高めたいと考えています。チームでの協力を大切にし、コミュニケーションを通じてプロジェクトを成功に導きたいと考えています。座右の銘は「学び続ける者が成長する」です。',
  };

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

  // タブ切り替え処理
  const handleTabChange = (tab) => {
    setActiveTab(tab);
  };
  
  // サーベイタブ切り替え処理
  const handleSurveyTabChange = (tab) => {
    setActiveSurveyTab(tab);
  };

  // 1on1タブ切り替え処理
  const handleOneOnOneTabChange = (tab) => {
    setActiveOneOnOneTab(tab);
  };

  // 1on1ミーティングデータ（実際のアプリケーションではAPIから取得）
  const oneOnOneMeetings = [
    {
      id: 1,
      date: '2025年6月15日',
      time: '14:00 - 15:00',
      status: 'upcoming',
      location: 'オンライン（Zoom）',
      participants: [
        { id: 1632, name: '渡辺 悠希', position: 'スタッフ', photo: '/onboarding-demo01/images/1632.png' },
        { id: 1056, name: '吉村 和夫', position: 'セクションマネージャー', photo: '/onboarding-demo01/images/1056.png' }
      ],
      agenda: [
        '前回からの進捗確認',
        '現在の課題や困っていること',
        '今後の目標設定',
        'キャリアプランの相談'
      ],
      notes: ''
    },
    {
      id: 2,
      date: '2025年5月30日',
      time: '10:00 - 11:00',
      status: 'completed',
      location: '会議室A',
      participants: [
        { id: 1632, name: '渡辺 悠希', position: 'スタッフ', photo: '/onboarding-demo01/images/1632.png' },
        { id: 1404, name: '森 隼人', position: 'メンター', photo: '/onboarding-demo01/images/1404.png' }
      ],
      agenda: [
        '入社後の適応状況確認',
        '現在の業務内容の確認',
        'チーム内でのコミュニケーション'
      ],
      notes: '渡辺さんは技術的な面では順調に成長しているが、チーム内でのコミュニケーションに不安を感じている様子。特に質問や相談をする際に躊躇している。メンターの森さんからは、同じ部署の先輩として気軽に相談できるようサポートしていくことを提案。次回までに小さなペアプログラミングの機会を設けることにした。',
      action_items: [
        { task: 'ペアプログラミングセッションの実施', assignee: '森 隼人', due_date: '2025年6月5日' },
        { task: 'チーム内勉強会への参加', assignee: '渡辺 悠希', due_date: '2025年6月10日' }
      ]
    },
    {
      id: 3,
      date: '2025年5月15日',
      time: '13:00 - 14:00',
      status: 'completed',
      location: 'オンライン（Zoom）',
      participants: [
        { id: 1632, name: '渡辺 悠希', position: 'スタッフ', photo: '/onboarding-demo01/images/1632.png' },
        { id: 1056, name: '吉村 和夫', position: 'セクションマネージャー', photo: '/onboarding-demo01/images/1056.png' }
      ],
      agenda: [
        '入社後の初回1on1',
        '業務環境の確認',
        '初期目標の設定'
      ],
      notes: '入社後2週間が経過し、基本的な業務環境には慣れてきた様子。技術的なスキルは高いが、まだ社内の業務フローに不慣れな部分がある。今後は吉村マネージャーとの定期的な1on1を通じて、業務の進め方や疑問点を解消していくことを確認した。',
      action_items: [
        { task: '社内システムのアクセス権限確認', assignee: '吉村 和夫', due_date: '2025年5月20日', status: 'completed' },
        { task: '開発環境のセットアップ完了', assignee: '渡辺 悠希', due_date: '2025年5月18日', status: 'completed' }
      ]
    }
  ];

  return (
    <div className="admin-container">
      {/* 詳細エリア - 縦並びメニューとコンテンツを横に配置 */}
      <div className="detail-container">
        {/* 縦並びメニュー */}
        <div className="vertical-menu">
          {/* 一覧へ戻るリンク */}
          <div 
            className="menu-item back-link"
            onClick={() => navigate('/admin/employees')}
          >
            &lt; 一覧へ戻る
          </div>
          <div 
            className={`menu-item ${activeTab === 'info' ? 'active' : ''}`} 
            onClick={() => handleTabChange('info')}
          >
            情報
          </div>
          <div 
            className={`menu-item ${activeTab === 'survey' ? 'active' : ''}`} 
            onClick={() => handleTabChange('survey')}
          >
            サーベイ結果
          </div>
          <div 
            className={`menu-item ${activeTab === 'oneOnOne' ? 'active' : ''}`} 
            onClick={() => handleTabChange('oneOnOne')}
          >
            1on1ミーティング
          </div>
        </div>
        
        {/* コンテンツエリア */}
        <div className="content-area">
        {/* 「情報」タブ */}
        <div className={`tab-content ${activeTab === 'info' ? 'active' : ''}`} id="info">
          <div className="employee-details">
            {/* 組織パス */}
            <div className="organization-path">
              {employeeData.organization.map((org, index) => (
                <React.Fragment key={index}>
                  <span className={`org-path-item ${index === employeeData.organization.length - 1 ? 'current' : ''}`}>
                    {org}
                  </span>
                  {index < employeeData.organization.length - 1 && (
                    <span className="org-path-separator">›</span>
                  )}
                </React.Fragment>
              ))}
            </div>
            
            {/* プロフィール詳細 */}
            <div className="profile-container">
              <button className="edit-button">編集</button>
              <div className="profile-header">
                <div className="profile-photo-container">
                  <img 
                    src={`/onboarding-demo01/images/${employeeData.id}.png`} 
                    alt={employeeData.name} 
                    className="profile-photo photo-frame-regular" 
                  />
                </div>
                <div className="profile-info">
                  <div className="profile-name">{employeeData.name}</div>
                  <div className="profile-name-kana">{employeeData.nameKana}</div>
                  <div className="profile-title">{employeeData.title}</div>
                  <div className="profile-department">{employeeData.department}</div>
                </div>
              </div>
              
              {/* 基本情報 */}
            <div className="employee-info-section">
              <h4>基本情報</h4>
              <div className="info-grid">
                  <div className="info-label">入社日</div>
                  <div className="info-value">{employeeData.joinDate}</div>
                </div>
                <div className="info-item">
                  <div className="info-label">メールアドレス</div>
                  <div className="info-value">
                    <a href={`mailto:${employeeData.email}`}>{employeeData.email}</a>
                  </div>
                </div>
                <div className="info-item">
                  <div className="info-label">内線番号</div>
                  <div className="info-value">{employeeData.extension}</div>
                </div>
                <div className="info-item">
                  <div className="info-label">マネージャー</div>
                  <div className="info-value">
                    <a href="#">{employeeData.manager}</a>
                  </div>
                </div>
                <div className="info-item">
                  <div className="info-label">メンター</div>
                  <div className="info-value">
                    <a href="#">{employeeData.mentor}</a>
                  </div>
                </div>
              </div>
              
              {/* 社歴・職歴／認定資格 */}
              <div className="content-section">
                <h3 className="section-title">社歴・職歴</h3>
                {employeeData.history.map((item, index) => (
                  <div className="history-item" key={index}>
                    <div className="history-date">{item.date}</div>
                    <div className={`history-description ${item.isCurrent ? 'history-current' : ''}`}>
                      {item.description}
                    </div>
                  </div>
                ))}
                
                <h3 className="section-title">認定資格</h3>
                <div className="certification-list">
                  {employeeData.certifications.map((cert, index) => (
                    <div className="certification-card" key={index}>
                      <div className="certification-title">{cert.title}</div>
                      <div className="certification-date">{cert.date}</div>
                    </div>
                  ))}
                </div>
              </div>
              
              {/* プロフィール */}
              <div className="content-section">
                <h3 className="section-title">プロフィール</h3>
                <div className="profile-free-text">
                  <p>{employeeData.profile}</p>
                  <div className="profile-free-text-hidden" style={{ display: 'none' }}>
                    <p>{employeeData.profileExtended}</p>
                  </div>
                  <button className="read-more-btn" id="read-more-btn" onClick={(e) => {
                    const hiddenText = e.target.previousElementSibling;
                    if (hiddenText.style.display === 'none') {
                      hiddenText.style.display = 'block';
                      e.target.textContent = '折りたたむ';
                    } else {
                      hiddenText.style.display = 'none';
                      e.target.textContent = '続きを読む';
                    }
                  }}>続きを読む</button>
                </div>
              </div>
            </div>
          </div>
        </div>
        
        {/* 「サーベイ結果」タブ */}
        <div className={`tab-content ${activeTab === 'survey' ? 'active' : ''}`} id="survey">
          {/* サーベイアラート表示 */}
          <div className="survey-section">
            <h3 className="meeting-title">サーベイアラート</h3>
            <div className={`survey-alert risk-${alertData.riskScore >= 60 ? 'high' : alertData.riskScore >= 40 ? 'medium' : 'low'}`}>
              <div className="survey-alert-header">
                <div className="survey-alert-score">{alertData.riskScore}</div>
                <div className="survey-alert-title">
                  リスクスコア: {alertData.riskScore}
                  {alertData.riskScore >= 60 ? ' (要即時フォロー)' : 
                   alertData.riskScore >= 40 ? ' (要注意)' : ' (良好)'}
                </div>
              </div>
              <div className="survey-alert-triggers">
                <ul>
                  {alertData.triggers.map((trigger, index) => (
                    <li key={index}>
                      <span className={`trigger-type ${trigger.type}`}>{trigger.type}</span>
                      <span className="trigger-detail">{trigger.detail}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          </div>
          
          <div className="survey-section">
            <h3 className="meeting-title">最新サーベイ結果</h3>
            <div className="latest-survey">
              <div className="survey-date">最新サーベイ: {surveyData[0].date}（{surveyData[0].type}）</div>
              <div className="survey-status">
                <div className="status-item">
                  <div className="status-label">総合満足度</div>
                  <div className={`status-value ${getStatusClass(surveyData[0].overallSatisfaction)}`}>
                    {surveyData[0].overallSatisfaction}/5.0
                  </div>
                </div>
                <div className="status-item">
                  <div className="status-label">職場環境</div>
                  <div className={`status-value ${getStatusClass(surveyData[0].workEnvironment)}`}>
                    {surveyData[0].workEnvironment}/5.0
                  </div>
                </div>
                <div className="status-item">
                  <div className="status-label">仕事内容</div>
                  <div className={`status-value ${getStatusClass(surveyData[0].jobContent)}`}>
                    {surveyData[0].jobContent}/5.0
                  </div>
                </div>
                <div className="status-item">
                  <div className="status-label">サポート体制</div>
                  <div className={`status-value ${getStatusClass(surveyData[0].supportSystem)}`}>
                    {surveyData[0].supportSystem}/5.0
                  </div>
                </div>
              </div>
              <div className="survey-comment">
                "{surveyData[0].comment}"
              </div>
            </div>
          </div>
          
          <div className="survey-section">
            <h3 className="meeting-title">サーベイ履歴</h3>
            
            {/* サーベイタブ */}
            <div className="survey-tabs">
              <div 
                className={`survey-tab ${activeSurveyTab === 'daily' ? 'active' : ''}`}
                onClick={() => handleSurveyTabChange('daily')}
              >
                日次
              </div>
              <div 
                className={`survey-tab ${activeSurveyTab === 'weekly' ? 'active' : ''}`}
                onClick={() => handleSurveyTabChange('weekly')}
              >
                週次
              </div>
              <div 
                className={`survey-tab ${activeSurveyTab === 'monthly' ? 'active' : ''}`}
                onClick={() => handleSurveyTabChange('monthly')}
              >
                マンスリー
              </div>
            </div>
            
            {/* 日次サーベイタブコンテンツ */}
            <div className={`survey-tab-content ${activeSurveyTab === 'daily' ? 'active' : ''}`}>
              <div className="survey-history">
                {dailySurveyData.map((survey, index) => (
                  <div key={index} className="survey-item daily-survey-item">
                    <div className="survey-item-header">
                      <div className="survey-item-date">{survey.date}</div>
                    </div>
                    <div className="daily-survey-container">
                      {/* 朝のチェックイン */}
                      <div className="daily-survey-half">
                        <div className="survey-item-type">{survey.morning.type}</div>
                        <div className="survey-item-scores">
                          <div className="survey-score-item">
                            <div className="survey-score-label">気分</div>
                            <div className={`survey-score-value ${survey.morning.mood >= 4 ? 'good' : survey.morning.mood >= 3 ? 'warning' : 'alert'}`}>
                              {['😣', '🙁', '😐', '😊', '😄'][survey.morning.mood - 1]}
                            </div>
                          </div>
                          <div className="survey-score-item">
                            <div className="survey-score-label">状態</div>
                            <div className="survey-score-value">
                              {survey.morning.feeling}
                            </div>
                          </div>
                        </div>
                      </div>
                      
                      {/* 夕方のチェックアウト */}
                      <div className="daily-survey-half">
                        <div className="survey-item-type">{survey.evening.type}</div>
                        <div className="survey-item-scores">
                          <div className="survey-score-item">
                            <div className="survey-score-label">充実度</div>
                            <div className={`survey-score-value ${survey.evening.satisfaction >= 7 ? 'good' : survey.evening.satisfaction >= 4 ? 'warning' : 'alert'}`}>
                              {survey.evening.satisfaction}/10
                            </div>
                          </div>
                          <div className="survey-score-item">
                            <div className="survey-score-label">経験</div>
                            <div className="survey-score-value">
                              {survey.evening.experience}
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
            
            {/* 週次サーベイタブコンテンツ */}
            <div className={`survey-tab-content ${activeSurveyTab === 'weekly' ? 'active' : ''}`}>
              <div className="survey-history">
                {weeklySurveyData.map((survey, index) => (
                  <div key={index} className="survey-item">
                    <div className="survey-item-header">
                      <div className="survey-item-date">{survey.date}</div>
                      <div className="survey-item-type">{survey.type}</div>
                    </div>
                    <div className="survey-item-scores">
                      <div className="survey-score-item">
                        <div className="survey-score-label">業務満足度</div>
                        <div className={`survey-score-value ${survey.workSatisfaction >= 4.0 ? 'good' : survey.workSatisfaction >= 3.0 ? 'warning' : 'alert'}`}>
                          {survey.workSatisfaction}/5.0
                        </div>
                      </div>
                      <div className="survey-score-item">
                        <div className="survey-score-label">チームコミュニケーション</div>
                        <div className={`survey-score-value ${survey.teamCommunication >= 4.0 ? 'good' : survey.teamCommunication >= 3.0 ? 'warning' : 'alert'}`}>
                          {survey.teamCommunication}/5.0
                        </div>
                      </div>
                      <div className="survey-score-item">
                        <div className="survey-score-label">学習進捗度</div>
                        <div className={`survey-score-value ${survey.learningProgress >= 4.0 ? 'good' : survey.learningProgress >= 3.0 ? 'warning' : 'alert'}`}>
                          {survey.learningProgress}/5.0
                        </div>
                      </div>
                    </div>
                    <div className="survey-item-comment">"{survey.comment}"</div>
                  </div>
                ))}
              </div>
            </div>
            
            {/* マンスリーサーベイタブコンテンツ */}
            <div className={`survey-tab-content ${activeSurveyTab === 'monthly' ? 'active' : ''}`}>
              <div className="survey-history">
                {monthlySurveyData.map((survey, index) => (
                  <div key={index} className="survey-item">
                    <div className="survey-item-header">
                      <div className="survey-item-date">{survey.date}</div>
                      <div className="survey-item-type">{survey.type}</div>
                    </div>
                    <div className="survey-item-scores">
                      <div className="survey-score-item">
                        <div className="survey-score-label">自律性</div>
                        <div className={`survey-score-value ${survey.autonomy >= 4 ? 'good' : survey.autonomy >= 3 ? 'warning' : 'alert'}`}>
                          {survey.autonomy}/5
                        </div>
                      </div>
                      <div className="survey-score-item">
                        <div className="survey-score-label">関係性</div>
                        <div className={`survey-score-value ${survey.relatedness >= 4 ? 'good' : survey.relatedness >= 3 ? 'warning' : 'alert'}`}>
                          {survey.relatedness}/5
                        </div>
                      </div>
                      <div className="survey-score-item">
                        <div className="survey-score-label">有能感</div>
                        <div className={`survey-score-value ${survey.competence >= 4 ? 'good' : survey.competence >= 3 ? 'warning' : 'alert'}`}>
                          {survey.competence}/5
                        </div>
                      </div>
                    </div>
                    <div className="survey-item-comment">"{survey.comment}"</div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
        
        {/* 「1on1ミーティング」タブ */}
        <div className={`tab-content ${activeTab === 'oneOnOne' ? 'active' : ''}`} id="oneOnOne">
          <div className="oneOnOne-container">
            <h2 className="section-title">1on1ミーティング</h2>
            
            {/* アラートセクション */}
            <div className="oneOnOne-alert-section">
              <div className="alert-card">
                <div className="alert-icon warning">
                  <i className="fas fa-exclamation-triangle"></i>
                </div>
                <div className="alert-content">
                  <h3>注意点</h3>
                  <p>最近のサーベイ結果から、チーム内コミュニケーションに不安を感じている可能性があります。1on1では特にこの点について話し合うことをおすすめします。</p>
                </div>
              </div>
            </div>
            
            {/* タブメニュー */}
            <div className="oneOnOne-tabs">
              <div 
                className={`oneOnOne-tab ${activeOneOnOneTab === 'upcoming' ? 'active' : ''}`}
                onClick={() => handleOneOnOneTabChange('upcoming')}
              >
                予定されたミーティング
              </div>
              <div 
                className={`oneOnOne-tab ${activeOneOnOneTab === 'history' ? 'active' : ''}`}
                onClick={() => handleOneOnOneTabChange('history')}
              >
                過去のミーティング
              </div>
            </div>
            
            {/* 予定されたミーティングタブコンテンツ */}
            <div className={`oneOnOne-tab-content ${activeOneOnOneTab === 'upcoming' ? 'active' : ''}`}>
                {oneOnOneMeetings.filter(meeting => meeting.status === 'upcoming').length > 0 ? (
                <div className="oneOnOne-list">
                  {oneOnOneMeetings
                    .filter(meeting => meeting.status === 'upcoming')
                    .map((meeting) => (
                      <OneOnOneCard key={meeting.id} meeting={meeting} />
                    ))
                  }
                </div>
              ) : (
                <div className="no-meetings">
                  <p>予定されたミーティングはありません。</p>
                  <button className="btn-primary">新しいミーティングを予定する</button>
                </div>
              )}
              
              {oneOnOneMeetings.filter(meeting => meeting.status === 'upcoming').length > 0 && (
                <div className="oneOnOne-actions">
                  <button className="btn-primary">
                    <i className="fas fa-plus"></i> 新しいミーティングを予定する
                  </button>
                </div>
              )}
            </div>
            
            {/* 過去のミーティングタブコンテンツ */}
            <div className={`oneOnOne-tab-content ${activeOneOnOneTab === 'history' ? 'active' : ''}`}>
              {oneOnOneMeetings.filter(meeting => meeting.status === 'completed').length > 0 ? (
                <div className="oneOnOne-list">
                  {oneOnOneMeetings
                    .filter(meeting => meeting.status === 'completed')
                    .map((meeting) => (
                      <OneOnOneCard key={meeting.id} meeting={meeting} />
                    ))
                  }
                </div>
              ) : (
                <div className="no-meetings">
                  <p>過去のミーティング記録はありません。</p>
                </div>
              )}
            </div>
          </div>
        </div>
        </div>
      </div>
    </div>
  );
};

// スタイル定義
const styles = {
  // スタイルは既存のAdminStyles.cssに依存
};

export default NewHireDetail;
