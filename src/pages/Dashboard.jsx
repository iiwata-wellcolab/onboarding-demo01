
import React from 'react';
import { Link } from 'react-router-dom';

const Dashboard = ({ daysUntilJoining }) => {
  return (
    <div>
      <header>
        <h1>入社準備ダッシュボード</h1>
      </header>

      <main>
        <div className="card">
          <h3>入社までに確認すること</h3>
          <ul>
            <li>
              <span>規定・書類の確認（3件）</span>
              <Link to="/documents">
                <button className="float-right">確認</button>
              </Link>
            </li>
            <li>
              <span>持参するもの（2件）</span>
              <button className="float-right">確認</button>
            </li>
            <li>
              <span>社員からのメッセージ（3件）</span>
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
      </footer>
    </div>
  );
};

export default Dashboard;
