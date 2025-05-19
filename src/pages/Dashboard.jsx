
import React from 'react';
import { Link } from 'react-router-dom';
import { useProgress } from '../contexts/ProgressContext';

const Dashboard = ({ daysUntilJoining }) => {
  const { progress, calculateTotalProgress, resetProgress } = useProgress();
  const totalProgress = calculateTotalProgress();
  
  const handleReset = () => {
    if (window.confirm('進捗状況をリセットしますか？この操作は元に戻せません。')) {
      resetProgress();
    }
  };
  return (
    <div>
      <header>
        <h1>入社準備ダッシュボード</h1>
      </header>

      <main>
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
          <h3>入社までに確認すること</h3>
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
      </main>

      <footer>
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
      </footer>
    </div>
  );
};

export default Dashboard;
