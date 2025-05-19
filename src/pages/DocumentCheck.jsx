
import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';

const DocumentCheck = ({ daysUntilJoining }) => {
  const [currentPage, setCurrentPage] = useState(1);
  const totalPages = 3;
  const navigate = useNavigate();
  
  const documents = [
    {
      title: "就業規則",
      content: "この会社で勤務するにあたっての基本的なルールや働き方のガイドラインについて記載されています。よく確認してください。"
    },
    {
      title: "給与規定",
      content: "給与の計算方法、支払日、昇給制度などについて記載されています。よく確認してください。"
    },
    {
      title: "機密保持契約書",
      content: "会社の機密情報の取り扱いについて定めています。内容をよく理解した上で入社時に署名していただきます。"
    }
  ];

  const goToNextPage = () => {
    if (currentPage < totalPages) {
      setCurrentPage(currentPage + 1);
    } else {
      navigate('/dashboard');
    }
  };

  const goToPrevPage = () => {
    if (currentPage > 1) {
      setCurrentPage(currentPage - 1);
    } else {
      navigate('/dashboard');
    }
  };

  return (
    <div>
      <header>
        <h1>規定・書類の確認 ({currentPage}/{totalPages})</h1>
      </header>

      <main>
        <div className="nav">
          <button onClick={goToPrevPage}>戻る</button>
          <button onClick={goToNextPage}>次へ</button>
        </div>

        <div className="card">
          <h3>{documents[currentPage - 1].title}</h3>
          <p>{documents[currentPage - 1].content}</p>
        </div>

        <button className="full-width" onClick={goToNextPage}>確認しました</button>
      </main>

      <footer>
        入社日まであと <strong>{daysUntilJoining}</strong> 日です！
      </footer>
    </div>
  );
};

export default DocumentCheck;
