
import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';

const QuestionForm = ({ daysUntilJoining }) => {
  const [subject, setSubject] = useState('');
  const [content, setContent] = useState('');
  const [step, setStep] = useState('form'); // 'form', 'confirm', 'complete'
  const navigate = useNavigate();

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
    <>
      <div className="card faq">
        <h4>よくある質問</h4>
        <div className="faq-item">
          <strong>Q.</strong> 服装はどのようなものが望ましいですか？<br />
          <strong>A.</strong> ビジネスカジュアルでお願いします。
        </div>
        <div className="faq-item">
          <strong>Q.</strong> 出社初日の持ち物はありますか？<br />
          <strong>A.</strong> 身分証明書と銀行口座情報をお持ちください。
        </div>
      </div>

      <form onSubmit={handleSubmit} className="card">
        <h4>質問フォーム</h4>
        <label htmlFor="subject">件名</label>
        <input 
          type="text" 
          id="subject" 
          placeholder="件名を入力" 
          value={subject} 
          onChange={(e) => setSubject(e.target.value)} 
          required 
        />
        
        <label htmlFor="content">質問内容</label>
        <textarea 
          id="content" 
          rows="5" 
          placeholder="質問内容を入力" 
          value={content} 
          onChange={(e) => setContent(e.target.value)} 
          required 
        ></textarea>

        <button type="submit" className="full-width">送信する</button>
      </form>
    </>
  );

  // 確認画面
  const renderConfirm = () => (
    <div className="card">
      <h4>入力内容の確認</h4>
      <div className="confirm-item">
        <strong>件名：</strong>
        <p>{subject}</p>
      </div>
      <div className="confirm-item">
        <strong>質問内容：</strong>
        <p style={{ whiteSpace: 'pre-wrap' }}>{content}</p>
      </div>
      <div className="button-group">
        <button onClick={() => setStep('form')} className="secondary-button">戻る</button>
        <button onClick={handleConfirm} className="primary-button">送信</button>
      </div>
    </div>
  );

  // 送信完了画面
  const renderComplete = () => (
    <div className="card completion-card">
      <div className="checkmark">✓</div>
      <h3>送信しました</h3>
      <p>質問を受け付けました。回答をお待ちください。</p>
      <button onClick={handleGoHome} className="full-width">ホームへ戻る</button>
    </div>
  );

  return (
    <div>
      <header>
        <h1>人事への質問・お問い合わせ</h1>
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

export default QuestionForm;
