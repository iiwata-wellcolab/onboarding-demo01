
import React from 'react';
import { Link } from 'react-router-dom';

const Messages = ({ daysUntilJoining }) => {
  const messages = [
    {
      name: "田中 一郎",
      position: "営業部 マネージャー",
      message: "チーム全員であなたの入社を楽しみにしています。一緒に頑張りましょう！"
    },
    {
      name: "佐藤 花子",
      position: "営業本部 本部長",
      message: "あなたの活躍を期待しています。共に成長していきましょう。"
    },
    {
      name: "鈴木 太郎",
      position: "代表取締役社長",
      message: "我々のチームへようこそ！新しい仲間として大いに期待しています。"
    }
  ];

  return (
    <div>
      <header>
        <h1>社員からのメッセージ</h1>
      </header>

      <main>
        {messages.map((msg, index) => (
          <div className="card message" key={index}>
            <img src={`https://via.placeholder.com/60?text=${index + 1}`} alt="avatar" />
            <div className="message-content">
              <h3>{msg.name}</h3>
              <div className="info">{msg.position}</div>
              <p>{msg.message}</p>
              <div className="reaction">
                <button>嬉しい！</button>
                <button>楽しみ！</button>
              </div>
            </div>
          </div>
        ))}

        <Link to="/completion">
          <button className="full-width">感謝の返信をする</button>
        </Link>
      </main>

      <footer>
        入社日まであと <strong>{daysUntilJoining}</strong> 日です！
      </footer>
    </div>
  );
};

export default Messages;
