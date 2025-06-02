import React, { useState, useEffect } from 'react';
import './AdminStyles.css';
import './employee-styles.css';
import './employee-profile-styles.css';
import './employee-detail-styles.css';

// MBTIのスタイル
import './mbti-styles.css';

// 社員詳細画面の情報タブコンテンツコンポーネント
const EmployeeInfoContent = ({ 
  employeeData, 
  employeeProfile, 
  employeeMaster, 
  organization, 
  photoUrl,
  loading,
  error 
}) => {
  // MBTIデータの状態管理
  const [mbtiData, setMbtiData] = useState({});
  
  // MBTIデータを取得する関数
  const fetchMbtiData = async () => {
    try {
      const response = await fetch('/data/mbti_j.json');
      if (!response.ok) {
        throw new Error(`MBTIデータの取得に失敗しました: ${response.status}`);
      }
      const data = await response.json();
      
      // MBTIデータをオブジェクト形式に変換して状態に保存
      const mbtiMap = {};
      data.forEach(item => {
        mbtiMap[item.mbti] = item.description;
      });
      
      setMbtiData(mbtiMap);
      console.log('MBTIデータを取得しました:', mbtiMap);
    } catch (error) {
      console.error('MBTIデータの取得中にエラーが発生しました:', error);
    }
  };
  
  // コンポーネントマウント時にMBTIデータを取得
  useEffect(() => {
    fetchMbtiData();
  }, []);
  // ローディング中の表示
  if (loading) {
    return (
      <div className="loading-container" style={{ textAlign: 'center', padding: '50px' }}>
        <p>データを読み込み中...しばらくお待ちください</p>
      </div>
    );
  }
  
  // エラーがある場合の表示
  if (error) {
    return (
      <div className="error-container" style={{ textAlign: 'center', padding: '50px', color: 'red' }}>
        <p>エラーが発生しました: {error}</p>
      </div>
    );
  }
  
  // データがない場合の表示
  if (!employeeData) {
    return (
      <div className="no-data-container" style={{ textAlign: 'center', padding: '50px' }}>
        <p>従業員データが見つかりません</p>
      </div>
    );
  }
  
  return (
    <div className="content-container">
      {/* プロフィールヘッダー */}
      <div className="profile-header">
        <div className="profile-photo">
          <img 
            src={photoUrl} 
            alt={`${employeeData.name}の写真`} 
            onError={(e) => {
              e.target.onerror = null;
              e.target.src = '/images/default_emp_icon.png';
            }}
            style={{ width: '100px', height: '100px', borderRadius: '50%', objectFit: 'cover' }}
          />
        </div>
        <div className="profile-basic">
          <div className="staff-label">{employeeData.position || 'Staff'}</div>
          <div className="employee-name" style={{ fontSize: '24px', fontWeight: 'bold' }}>{employeeData.name || '名前なし'}</div>
          {employeeData.name_en && (
            <div className="employee-name-en" style={{ fontSize: '14px', color: '#666' }}>{employeeData.name_en}</div>
          )}
          {/* 部署名を表示 */}
          <div className="employee-department" style={{ fontSize: '14px', color: '#666', marginTop: '8px' }}>
            {organization ? organization.division_name_local || organization.division_name : employeeData.department || '-'}
          </div>
          {/* マネージャー情報を表示 */}
          {employeeData.manager && (
            <div className="employee-manager" style={{ fontSize: '14px', color: '#666', marginTop: '4px' }}>
              マネージャー: 
              <a 
                href={`#/admin/employee-detail/${employeeData.manager.emp_no}`} 
                style={{ 
                  color: '#0a5275', 
                  textDecoration: 'none',
                  fontWeight: 'bold',
                  cursor: 'pointer'
                }}
                onClick={(e) => {
                  e.preventDefault();
                  window.location.hash = `#/admin/employee-detail/${employeeData.manager.emp_no}`;
                }}
              >
                {employeeData.manager.name}
                {employeeData.manager.name_alphabet && ` (${employeeData.manager.name_alphabet})`}
              </a>
            </div>
          )}
        </div>
      </div>

      {/* コンテンツグリッド */}
      <div className="content-grid">
        {/* 基本情報カード */}
        <div className="info-card">
          <div className="card-header">基本情報</div>
          <div className="card-content">
            <div className="basic-info-grid">
              <div className="basic-info-left">
                <div className="info-row">
                  <div className="info-label">氏名（現地表記）</div>
                  <div className="info-value">{employeeData.name || '名前なし'}</div>
                </div>
                {employeeData.name_en && (
                  <div className="info-row">
                    <div className="info-label">氏名（アルファベット）</div>
                    <div className="info-value">{employeeData.name_en}</div>
                  </div>
                )}
                <div className="info-row">
                  <div className="info-label">社員番号</div>
                  <div className="info-value">{employeeData.emp_no || '-'}</div>
                </div>
              </div>
              <div className="basic-info-right">
                <div className="info-row">
                  <div className="info-label">入社日</div>
                  <div className="info-value">
                    {employeeData.join_date ? (
                      typeof employeeData.join_date === 'string' ? (
                        // 文字列形式の場合
                        // "2025-02-01" 形式の場合は日本語表記に変換
                        employeeData.join_date.match(/^\d{4}-\d{2}-\d{2}$/) ? (
                          (() => {
                            try {
                              const parts = employeeData.join_date.split('-');
                              const year = parts[0];
                              const month = parseInt(parts[1], 10);
                              const day = parseInt(parts[2], 10);
                              return `${year}年${month}月${day}日`;
                            } catch (e) {
                              return employeeData.join_date;
                            }
                          })()
                        ) : employeeData.join_date
                      ) : typeof employeeData.join_date === 'object' && 'seconds' in employeeData.join_date ? (
                        // Timestamp形式の場合
                        (() => {
                          const date = new Date(employeeData.join_date.seconds * 1000);
                          return date.toLocaleDateString('ja-JP', {
                            year: 'numeric',
                            month: 'long',
                            day: 'numeric'
                          });
                        })()
                      ) : employeeData.join_date instanceof Date ? (
                        // Dateオブジェクトの場合
                        employeeData.join_date.toLocaleDateString('ja-JP', {
                          year: 'numeric',
                          month: 'long',
                          day: 'numeric'
                        })
                      ) : '-'
                    ) : '-'}
                  </div>
                </div>
                <div className="info-row">
                  <div className="info-label">メールアドレス</div>
                  <div className="info-value">{employeeData.email || '-'}</div>
                </div>
                <div className="info-row">
                  <div className="info-label">オフィス</div>
                  <div className="info-value">{employeeData.office || '-'}</div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* プロフィールカード */}
        {employeeProfile && (
          <div className="info-card">
            <div className="card-header">プロフィール</div>
            <div className="card-content">
              {employeeProfile.mbti && (
                <div className="info-row">
                  <div className="info-label">MBTI</div>
                  <div className="info-value">
                    <span className="mbti-display">
                      {employeeProfile.mbti}
                      <div className="mbti-tooltip">
                        {mbtiData[employeeProfile.mbti] 
                          ? <>
                              <strong>{employeeProfile.mbti}</strong><br />
                              {mbtiData[employeeProfile.mbti]}
                            </>
                          : <>MBTIは性格タイプを示す指標です。<br />
                            {employeeProfile.mbti_description || 'MBTIの詳細情報は登録されていません。'}
                          </>}
                      </div>
                    </span>
                  </div>
                </div>
              )}
              {employeeProfile.profile && (
                <div className="info-row">
                  <div className="info-label">コメント</div>
                  <div className="info-value comment-text">
                    {employeeProfile.profile}
                  </div>
                </div>
              )}
              {employeeProfile.skills && (
                <div className="info-row">
                  <div className="info-label">スキル</div>
                  <div className="info-value">{employeeProfile.skills}</div>
                </div>
              )}
              {employeeProfile.interests && (
                <div className="info-row">
                  <div className="info-label">興味・関心</div>
                  <div className="info-value">{employeeProfile.interests}</div>
                </div>
              )}
              {employeeProfile.birth_date && (
                <div className="info-row">
                  <div className="info-label">生年月日</div>
                  <div className="info-value">
                    {typeof employeeProfile.birth_date === 'string' 
                      ? employeeProfile.birth_date 
                      : employeeProfile.birth_date.seconds 
                        ? new Date(employeeProfile.birth_date.seconds * 1000).toLocaleDateString('ja-JP') 
                        : '-'
                    }
                  </div>
                </div>
              )}
              {employeeProfile.hometown && (
                <div className="info-row">
                  <div className="info-label">出身地</div>
                  <div className="info-value">{employeeProfile.hometown}</div>
                </div>
              )}
              {employeeProfile.hobby && (
                <div className="info-row">
                  <div className="info-label">趣味</div>
                  <div className="info-value">{employeeProfile.hobby}</div>
                </div>
              )}
              {employeeProfile.specialty && (
                <div className="info-row">
                  <div className="info-label">得意分野</div>
                  <div className="info-value">{employeeProfile.specialty}</div>
                </div>
              )}
            </div>
          </div>
        )}
        
        {/* 組織情報カードは削除 */}
        
        {/* 履歴セクション */}
        {employeeData.history && employeeData.history.length > 0 && (
          <div className="info-card">
            <div className="card-header">履歴</div>
            <div className="card-content">
              <div className="employee-history">
                {employeeData.history.map((item, index) => (
                  <div key={index} className={`history-item ${item.isCurrent ? 'current' : ''}`}>
                    <div className="history-date">{item.date}</div>
                    <div className="history-description">{item.description}</div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default EmployeeInfoContent;
