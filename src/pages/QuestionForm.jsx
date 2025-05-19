
import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';

const QuestionForm = ({ daysUntilJoining }) => {
  const [subject, setSubject] = useState('');
  const [content, setContent] = useState('');
  const navigate = useNavigate();

  const handleSubmit = (e) => {
    e.preventDefault();
    // ここで送信処理を行う（実際のAPI連携はモックなので省略）
    alert('質問が送信されました！');
    navigate('/dashboard');
  };

  return (
    <div>
      <header>
        <h1>人事への質問・お問い合わせ</h1>
      </header>

      <main>
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
      </main>

      <footer>
        入社日まであと <strong>{daysUntilJoining}</strong> 日です！
      </footer>
    </div>
  );
};

export default QuestionForm;
