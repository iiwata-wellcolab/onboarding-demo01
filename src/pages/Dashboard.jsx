
import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useProgress } from '../contexts/ProgressContext';

const Dashboard = ({ daysUntilJoining, toggleJoiningStatus }) => {
  const { progress, calculateTotalProgress, resetProgress } = useProgress();
  const totalProgress = calculateTotalProgress();
  const [hasJoined, setHasJoined] = useState(false);
  
  // 入社日が過ぎているかどうかを判断
  useEffect(() => {
    // daysUntilJoiningが0以下の場合、入社日を過ぎている
    setHasJoined(daysUntilJoining <= 0);
  }, [daysUntilJoining]);
  
  const handleReset = () => {
    if (window.confirm('進捗状況をリセットしますか？この操作は元に戻せません。')) {
      resetProgress();
    }
  };
  return (
    <div>
      <header>
        <h1>{hasJoined ? 'オンボーディングダッシュボード' : '入社準備ダッシュボード'}</h1>
      </header>

      <main>
        {!hasJoined ? (
          // 入社前のダッシュボード
          <>
            <div className="card progress-overview">
              <h3>入社準備の進捗</h3>
              <div className="progress-bar-container">
                <div 
                  className="progress-bar" 
                  style={{ width: `${totalProgress}%` }}
                ></div>
              </div>
              <div className="progress-text">{totalProgress}% 完了</div>
            </div>
            
            <div className="card">
              <h3>入社までにご確認頂くこと</h3>
              <ul>
                <li>
                  <span>規定・書類の確認（{progress.documents.completed}/{progress.documents.total}件）</span>
                  <Link to="/documents">
                    <button className="float-right">確認</button>
                  </Link>
                </li>
                <li>
                  <span>入社日に持参するもの（{progress.items.completed}/{progress.items.total}件）</span>
                  <Link to="/items">
                    <button className="float-right">確認</button>
                  </Link>
                </li>
                <li>
                  <span>社員からのメッセージ（{progress.messages.completed}/{progress.messages.total}件）</span>
                  <Link to="/messages">
                    <button className="float-right">確認</button>
                  </Link>
                </li>
              </ul>
            </div>

            <div className="card">
              <h3>人事への質問・お問い合わせ</h3>
              <p>気になることはお気軽にご質問ください。</p>
              <Link to="/question">
                <button>質問する</button>
              </Link>
            </div>
          </>
        ) : (
          // 入社後のダッシュボード
          <>
            <div className="card">
              <h3>デイリーチェックイン・チェックアウト</h3>
              <p>毎日の気分や状況を共有しましょう。</p>
              <div style={{ display: 'flex', gap: '10px', marginTop: '15px' }}>
                <Link to="/morning-checkin">
                  <button style={{ backgroundColor: '#4285f4' }}>朝のチェックイン</button>
                </Link>
                <Link to="/evening-checkout">
                  <button style={{ backgroundColor: '#34a853' }}>夕方のチェックアウト</button>
                </Link>
              </div>
            </div>

            <div className="card">
              <h3>週次サーベイ</h3>
              <p>週に一度、オンボーディングに関するフィードバックをお願いします。</p>
              <Link to="/weekly-survey">
                <button style={{ backgroundColor: '#673ab7' }}>サーベイに回答する</button>
              </Link>
            </div>

            <div className="card">
              <h3>人事への質問・お問い合わせ</h3>
              <p>気になることはお気軽にご質問ください。</p>
              <Link to="/question">
                <button>質問する</button>
              </Link>
            </div>
          </>
        )}
      </main>

      <footer>
        {!hasJoined ? (
          <>
            入社日まであと <strong>{daysUntilJoining}</strong> 日です！
            {totalProgress > 0 && (
              <button 
                className="reset-button" 
                onClick={handleReset}
                title="進捗状況をリセットします"
              >
                進捗をリセット
              </button>
            )}
          </>
        ) : (
          <>
            入社おめでとうございます！
          </>
        )}
        
        {/* 開発用テストボタン - 入社前/入社後の切り替え */}
        <div style={{ marginTop: '5px', textAlign: 'right', paddingRight: '10px' }}>
          <button 
            onClick={toggleJoiningStatus}
            style={{
              padding: '2px 4px',
              backgroundColor: 'transparent',
              border: '1px solid rgba(221, 221, 221, 0.3)',
              borderRadius: '2px',
              cursor: 'pointer',
              fontSize: '8px',
              color: 'rgba(153, 153, 153, 0.5)',
              opacity: 0.5,
              boxShadow: 'none',
              outline: 'none'
            }}
          >
            {hasJoined ? '切替' : '切替'}
          </button>
        </div>
      </footer>
    </div>
  );
};

export default Dashboard;
