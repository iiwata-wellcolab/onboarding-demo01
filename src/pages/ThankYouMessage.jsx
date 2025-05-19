import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';

const ThankYouMessage = ({ daysUntilJoining }) => {
  const [message, setMessage] = useState('');
  const [step, setStep] = useState('form'); // 'form', 'confirm', 'complete'
  const navigate = useNavigate();

  const recipients = [
    {
      name: "原田 一郎",
      position: "第一営業二課 マネージャー",
      image: "/images/1085.png"
    },
    {
      name: "野村 育子",
      position: "第一営業部 部長",
      image: "/images/1012.png"
    },
    {
      name: "小林 美樹",
      position: "営業本部 本部長",
      image: "/images/1057.png"
    }
  ];

  const handleSubmit = (e) => {
    e.preventDefault();
    setStep('confirm');
  };
  
  const handleConfirm = () => {
    // ここで送信処理を行う（実際のAPI連携はモックなので省略）
    setStep('complete');
  };
  
  const handleGoHome = () => {
    navigate('/dashboard');
  };

  // 入力フォーム
  const renderForm = () => (
    <div className="card">
      <h3>感謝のメッセージを送る</h3>
      <p className="note">
        以下の方々全員にメッセージが送信されます：
      </p>
      <div className="recipients-list">
        {recipients.map((recipient, index) => (
          <div className="recipient-item" key={index}>
            <img src={recipient.image} alt={recipient.name} className="recipient-avatar" />
            <div>
              <div className="recipient-name">{recipient.name}</div>
              <div className="recipient-position">{recipient.position}</div>
            </div>
          </div>
        ))}
      </div>
      
      <form onSubmit={handleSubmit}>
        <label htmlFor="message">メッセージ</label>
        <textarea 
          id="message" 
          rows="5" 
          placeholder="感謝のメッセージを入力してください" 
          value={message} 
          onChange={(e) => setMessage(e.target.value)} 
          required 
        ></textarea>

        <button type="submit" className="full-width">確認する</button>
      </form>
    </div>
  );

  // 確認画面
  const renderConfirm = () => (
    <div className="card">
      <h3>メッセージの確認</h3>
      <div className="confirm-item">
        <strong>宛先：</strong>
        <p>
          {recipients.map(recipient => recipient.name).join('、')} 宛
        </p>
      </div>
      <div className="confirm-item">
        <strong>メッセージ内容：</strong>
        <p style={{ whiteSpace: 'pre-wrap' }}>{message}</p>
      </div>
      <div className="button-group">
        <button onClick={() => setStep('form')} className="secondary-button">戻る</button>
        <button onClick={handleConfirm} className="primary-button">送信する</button>
      </div>
    </div>
  );

  // 送信完了画面
  const renderComplete = () => (
    <div className="card completion-card">
      <div className="checkmark">✓</div>
      <h3>メッセージを送信しました</h3>
      <p>あなたの感謝の気持ちが伝わりました。</p>
      <Link to="/completion">
        <button className="full-width">入社準備を完了する</button>
      </Link>
    </div>
  );

  return (
    <div>
      <header>
        <h1>感謝の返信</h1>
      </header>

      <main>
        {step === 'form' && renderForm()}
        {step === 'confirm' && renderConfirm()}
        {step === 'complete' && renderComplete()}
      </main>

      <footer>
        入社日まであと <strong>{daysUntilJoining}</strong> 日です！
      </footer>
    </div>
  );
};

export default ThankYouMessage;
