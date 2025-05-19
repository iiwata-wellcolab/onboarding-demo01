import React from 'react';
import { Link } from 'react-router-dom';

const Welcome = ({ userName, daysUntilJoining }) => {
  return (
    <div>
      <header>
        <h1>ようこそ、{userName}さん！</h1>
      </header>

      <main>
        <div className="card welcome-card">
          <img 
            src="/images/welcome-team.png" 
            alt="ウェルカムイメージ" 
            className="welcome-img" 
          />
          <h2>私たちもあなたの入社を心待ちにしています！</h2>
          <p>一緒に準備を進めましょう。</p>
          <Link to="/dashboard">
            <button className="welcome-button">はじめる</button>
          </Link>
        </div>
      </main>

      <footer>
        入社日まであと <strong>{daysUntilJoining}</strong> 日です！
      </footer>
    </div>
  );
};

export default Welcome;