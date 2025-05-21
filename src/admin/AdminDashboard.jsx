import React from 'react';
import { useNavigate } from 'react-router-dom';
import './AdminStyles.css';

const AdminDashboard = () => {
  const navigate = useNavigate();
  // ダッシュボードの概要データ（実際のアプリではAPIから取得）
  const summaryData = {
    totalEmployees: 12,
    completedOnboarding: 5,
    inProgressOnboarding: 7,
    upcomingJoiners: 3
  };

  // 最近の活動（実際のアプリではAPIから取得）
  const recentActivities = [
    { id: 1, employee: '山田 太郎', action: '書類確認完了', date: '2025/05/19 08:30' },
    { id: 2, employee: '佐藤 花子', action: 'メッセージ返信', date: '2025/05/18 15:45' },
    { id: 3, employee: '鈴木 一郎', action: '質問送信', date: '2025/05/18 10:20' },
    { id: 4, employee: '田中 美咲', action: 'アカウント作成', date: '2025/05/17 14:10' }
  ];
  
  // サーベイアラートデータ（実際のアプリではサーベイ結果から算出）
  const employeesNeedingCare = [
    { 
      id: 1632, 
      name: '渡辺 悠希', 
      department: 'エンジニアリング部',
      riskScore: 75, 
      triggers: [
        { type: '日次', detail: '朝のネガティブ連続: emojiスコア ≤2 が連続3日' },
        { type: '週次', detail: '低評価設問: 全設問のうち3問が1～2評価' },
        { type: '月次', detail: 'SDT低評価: 自律性で1評価' }
      ],
      joinDate: '2025/02/01'
    },
    { 
      id: 1633, 
      name: '中村 太陽', 
      department: 'エンジニアリング部',
      riskScore: 55, 
      triggers: [
        { type: '日次', detail: '不安／サポート必要選択: 「業務について不安がある」を3回/週' },
        { type: '週次', detail: '急激な低下: 前週平均スコアから△1.8点低下' }
      ],
      joinDate: '2025/03/01'
    },
    { 
      id: 1634, 
      name: '大原 孝之', 
      department: 'エンジニアリング部',
      riskScore: 45, 
      triggers: [
        { type: '週次', detail: '自由記述ネガティブ度: ネガティブキーワード出現率35%' },
        { type: '月次', detail: '定着意向低評価: 「長く働きたいと思わない」評価2' }
      ],
      joinDate: '2025/04/01'
    }
  ];

  return (
    <div>
      {/* 概要カード */}
      <div className="admin-dashboard-summary">
        <div className="admin-card">
          <h3>新入社員数</h3>
          <div className="admin-summary-number">{summaryData.totalEmployees}</div>
        </div>
        <div className="admin-card">
          <h3>準備完了</h3>
          <div className="admin-summary-number">{summaryData.completedOnboarding}</div>
        </div>
        <div className="admin-card">
          <h3>準備中</h3>
          <div className="admin-summary-number">{summaryData.inProgressOnboarding}</div>
        </div>
        <div className="admin-card">
          <h3>入社予定者</h3>
          <div className="admin-summary-number">{summaryData.upcomingJoiners}</div>
        </div>
      </div>

      {/* 最近の活動 */}
      <div className="admin-card">
        <h3 className="admin-card-title">最近の活動</h3>
        <table className="admin-table">
          <thead>
            <tr>
              <th>社員名</th>
              <th>アクション</th>
              <th>日時</th>
            </tr>
          </thead>
          <tbody>
            {recentActivities.map(activity => (
              <tr key={activity.id}>
                <td>{activity.employee}</td>
                <td>{activity.action}</td>
                <td>{activity.date}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* サーベイアラート */}
      <div className="admin-card">
        <h3 className="admin-card-title">サーベイアラート</h3>
        <div className="care-needed-container">
          {employeesNeedingCare.map(employee => (
            <div 
              key={employee.id} 
              className={`care-needed-card risk-${employee.riskScore >= 60 ? 'high' : employee.riskScore >= 40 ? 'medium' : 'low'}`}
            >
              <div className="care-needed-header">
                <div className="care-needed-photo">
                  <img src={`/images/${employee.id}.png`} alt={employee.name} />
                </div>
                <div className="care-needed-info">
                  <div className="care-needed-name">{employee.name}</div>
                  <div className="care-needed-department">{employee.department}</div>
                  <div className="care-needed-join-date">入社日: {employee.joinDate}</div>
                </div>
              </div>
              <div className="care-needed-risk">
                <div className="care-needed-risk-label">リスクスコア</div>
                <div className="care-needed-risk-score">{employee.riskScore}</div>
              </div>
              <div className="care-needed-triggers">
                <div className="care-needed-triggers-label">トリガー</div>
                <ul className="care-needed-triggers-list">
                  {employee.triggers.map((trigger, index) => (
                    <li key={index}>
                      <span className={`trigger-type ${trigger.type}`}>{trigger.type}</span>
                      <span className="trigger-detail">{trigger.detail}</span>
                    </li>
                  ))}
                </ul>
              </div>
              <div className="care-needed-actions">
                <button 
                  className="care-action-button"
                  onClick={() => navigate(`/admin/employees/${employee.id}`)}
                >
                  詳細
                </button>
                <button className="care-action-button">連絡</button>
                <button className="care-action-button">メモ</button>
              </div>
            </div>
          ))}
        </div>
      </div>
      
      {/* クイックアクション */}
      <div className="admin-card">
        <h3 className="admin-card-title">クイックアクション</h3>
        <div className="admin-quick-actions">
          <button className="admin-button">新入社員を追加</button>
          <button className="admin-button">メッセージを送信</button>
          <button className="admin-button">書類テンプレートを編集</button>
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard;
