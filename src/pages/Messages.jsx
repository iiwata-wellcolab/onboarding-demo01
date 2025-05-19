
import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { useProgress } from '../contexts/ProgressContext';

const Messages = ({ daysUntilJoining }) => {
  const { progress, markItemCompleted, markCategoryCompleted } = useProgress();
  const [reactions, setReactions] = useState({
    0: { happy: false, excited: false },
    1: { happy: false, excited: false },
    2: { happy: false, excited: false }
  });
  const messages = [
    {
      name: "原田 一郎",
      position: "第一営業二課 マネージャー",
      message: "チーム全員であなたの入社を楽しみにしています。一緒に頑張りましょう！",
      image: "/images/1085.png"
    },
    {
      name: "野村 育子",
      position: "第一営業部 部長",
      message: "あなたの活躍を期待しています。共に成長していきましょう。",
      image: "/images/1012.png"
    },
    {
      name: "小林 美樹",
      position: "営業本部 本部長",
      message: "我々のチームへようこそ！新しい仲間として大いに期待しています。",
      image: "/images/1057.png"
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
            <img src={msg.image} alt={`${msg.name}の写真`} className="avatar" />
            <div className="message-content">
              <h3>{msg.name}</h3>
              <div className="info">{msg.position}</div>
              <p>{msg.message}</p>
              <div className="reaction">
                <button 
                  className={reactions[index].happy ? 'active' : ''}
                  onClick={() => {
                    const newReactions = {...reactions};
                    newReactions[index].happy = !newReactions[index].happy;
                    setReactions(newReactions);
                    
                    // メッセージを読んだことを記録
                    markItemCompleted('messages', `msg${index + 1}`);
                  }}
                >
                  {reactions[index].happy ? '嬉しい！ ✓' : '嬉しい！'}
                </button>
                <button 
                  className={reactions[index].excited ? 'active' : ''}
                  onClick={() => {
                    const newReactions = {...reactions};
                    newReactions[index].excited = !newReactions[index].excited;
                    setReactions(newReactions);
                    
                    // メッセージを読んだことを記録
                    markItemCompleted('messages', `msg${index + 1}`);
                  }}
                >
                  {reactions[index].excited ? '楽しみ！ ✓' : '楽しみ！'}
                </button>
              </div>
            </div>
          </div>
        ))}

        {progress.messages.completed === progress.messages.total ? (
          <div className="completed-status">
            {progress.messages.items[0].completedAt} に確認済み
            <Link to="/thank-you">
              <button className="full-width mt-10">感謝の返信をする</button>
            </Link>
          </div>
        ) : (
          <Link to="/thank-you">
            <button 
              className="full-width"
              onClick={() => markCategoryCompleted('messages')}
            >
              感謝の返信をする
            </button>
          </Link>
        )}
      </main>

      <footer>
        入社日まであと <strong>{daysUntilJoining}</strong> 日です！
      </footer>
    </div>
  );
};

export default Messages;
