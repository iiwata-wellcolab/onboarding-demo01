import React from 'react';
import './AdminStyles.css';

const AdminDashboard = () => {
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
