
import React from 'react';
import { Link } from 'react-router-dom';

const Completion = ({ daysUntilJoining }) => {
  return (
    <div>
      <header>
        <h1>入社準備完了！</h1>
      </header>

      <main>
        <div className="card completion-card">
          <div className="checkmark">✔︎</div>
          <h2>全ての準備が整いました！</h2>
          <p>入社日まであと<strong>{daysUntilJoining}</strong>日です！<br />私たちも楽しみに待っています！</p>
          <Link to="/dashboard">
            <button className="welcome-button">ホームに戻る</button>
          </Link>
        </div>
      </main>

      <footer>
        ご不明点はお気軽に人事までご連絡ください。
      </footer>
    </div>
  );
};

export default Completion;
