
import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useProgress } from '../contexts/ProgressContext';
import '../styles/Messages.css';

const Messages = ({ daysUntilJoining }) => {
  const { progress, markItemCompleted, markCategoryCompleted } = useProgress();
  const [expandedMessages, setExpandedMessages] = useState({});
  const [messageReactions, setMessageReactions] = useState({});
  const [showReactionPopup, setShowReactionPopup] = useState(null);
  
  const messages = [
    {
      name: "吉村 和夫",
      position: "第二技術三課 マネージャー",
      preview: "渡辺さん、いよいよですね。チーム全員で入社をお待ちしています！",
      full: "渡辺さん、いよいよですね。チーム全員で入社をお待ちしています！",
      image: "/images/1056.png",
      short: true
    },
    {
      name: "西尾 道夫",
      position: "第二技術部 部長",
      preview: "渡辺さん、ご入社まで後少しですね。いかがお過ごしですか？...",
      full: "渡辺さん、ご入社まで後少しですね。いかがお過ごしですか？<br>面接で伺った、技術への興味を、ご入社後も持ち続けて頂いて、より幅広いエンジニアとして活躍して頂けることを楽しみにしています。<br>第二技術部全体で、ご入社を歓迎します！",
      image: "/images/1019.png",
      short: false
    },
    {
      name: "鈴木 清",
      position: "エンジニアリング本部 本部長",
      preview: "渡辺さん、初めまして、鈴木と申します。...",
      full: "渡辺さん、初めまして、鈴木と申します。<br>エンジニアリング本部のメンバーとしてJoinいただけるのを心待ちにしています。<br>普段はフロアをうろうろしていますので、見かけたら気軽にお声かけくださいね！<br>私も、お見かけしたらお声かけしますので、逃げないでくださいね（笑）。<br><br>元気にご入社頂けるのを、楽しみにしています！",
      image: "/images/1032.png",
      short: false
    }
  ];

  // 初期状態の設定
  useEffect(() => {
    const initialReactions = {};
    messages.forEach((_, index) => {
      initialReactions[index] = { icon: '👍', text: 'いいね！', active: false };
    });
    setMessageReactions(initialReactions);
  }, []);

  // メッセージの展開・折りたたみを切り替える
  const toggleMessage = (index) => {
    setExpandedMessages(prev => ({
      ...prev,
      [index]: !prev[index]
    }));
    
    // メッセージを読んだことを記録
    markItemCompleted('messages', `msg${index + 1}`);
  };

  // リアクションポップアップの表示・非表示
  const handleReactionHover = (index, show) => {
    if (show) {
      setShowReactionPopup(index);
    }
  };

  // ポップアップからマウスが離れたときの処理
  const handlePopupLeave = () => {
    setShowReactionPopup(null);
  };

  // リアクションの選択
  const selectReaction = (index, emoji, text) => {
    setMessageReactions(prev => ({
      ...prev,
      [index]: { icon: emoji, text, active: true }
    }));
    setShowReactionPopup(null);
    
    // メッセージを読んだことを記録
    markItemCompleted('messages', `msg${index + 1}`);
  };

  // リアクションボタンの切り替え
  const toggleLike = (index) => {
    setMessageReactions(prev => ({
      ...prev,
      [index]: { ...prev[index], active: !prev[index].active }
    }));
    
    // メッセージを読んだことを記録
    markItemCompleted('messages', `msg${index + 1}`);
  };

  // 戻るボタンの処理
  const handleBack = () => {
    window.history.back();
  };

  return (
    <div className="messages-page">
      <div className="header">
        社員からのメッセージ
      </div>

      <div className="content">
        {messages.map((msg, index) => (
          <div 
            key={index} 
            className={`message-container ${expandedMessages[index] ? 'expanded' : ''} ${msg.short ? 'message-short' : ''}`}
          >
            <div className="profile-section">
              <img 
                src={msg.image} 
                alt={`${msg.name}の写真`} 
                className="profile-image"
                onError={(e) => {
                  e.target.onerror = null;
                  e.target.src = "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='60' height='60' viewBox='0 0 60 60'%3E%3Ccircle cx='30' cy='30' r='30' fill='%23ddd'/%3E%3Ccircle cx='30' cy='25' r='8' fill='%23999'/%3E%3Cpath d='M15 45c0-8 7-12 15-12s15 4 15 12' fill='%23999'/%3E%3C/svg%3E";
                }}
              />
              <div className="profile-info">
                <div className="name">{msg.name}</div>
                <div className="position">{msg.position}</div>
                <div className="message-content" onClick={() => toggleMessage(index)}>
                  <div className="message-preview" style={{ display: expandedMessages[index] ? 'none' : 'block' }}>
                    {msg.preview}
                  </div>
                  <div 
                    className="message-full" 
                    style={{ display: expandedMessages[index] ? 'block' : 'none' }}
                    dangerouslySetInnerHTML={{ __html: msg.full }}
                  />
                </div>
                <div 
                  className="reaction-container" 
                  style={{ display: (expandedMessages[index] || msg.short) ? 'block' : 'none' }}
                >
                  <button 
                    className={`like-button ${messageReactions[index]?.active ? 'liked' : ''}`}
                    onClick={() => toggleLike(index)}
                    onMouseEnter={() => handleReactionHover(index, true)}
                    onMouseLeave={() => handleReactionHover(index, false)}
                  >
                    <span className="reaction-icon">{messageReactions[index]?.icon}</span>
                    <span className="reaction-text">{messageReactions[index]?.text}</span>
                  </button>
                  <div 
                    className={`reaction-popup ${showReactionPopup === index ? 'show' : ''}`}
                    onMouseEnter={() => setShowReactionPopup(index)}
                    onMouseLeave={handlePopupLeave}
                  >
                    <button className="reaction-option" onClick={() => selectReaction(index, '👍', 'いいね！')} title="いいね">👍</button>
                    <button className="reaction-option" onClick={() => selectReaction(index, '❤️', '超いいね！')} title="超いいね">❤️</button>
                    <button className="reaction-option" onClick={() => selectReaction(index, '😊', 'うれしいね')} title="うれしいね">😊</button>
                    <button className="reaction-option" onClick={() => selectReaction(index, '😮', 'すごいね')} title="すごいね">😮</button>
                    <button className="reaction-option" onClick={() => selectReaction(index, '👏', 'おめでとう')} title="おめでとう">👏</button>
                  </div>
                </div>
              </div>
            </div>
            <div className="expand-icon" onClick={() => toggleMessage(index)}>＞</div>
          </div>
        ))}

        <button 
          className="back-button"
          onClick={handleBack}
        >
          戻る
        </button>
      </div>

      <div className="footer">
        入社日まであと <strong>{daysUntilJoining}</strong> 日です！
      </div>
    </div>
  );
};

export default Messages;
