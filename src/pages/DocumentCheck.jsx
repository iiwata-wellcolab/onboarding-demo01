
import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useProgress } from '../contexts/ProgressContext';

const DocumentCheck = ({ daysUntilJoining }) => {
  const [currentPage, setCurrentPage] = useState(1);
  const totalPages = 4;
  const navigate = useNavigate();
  const { progress, markItemCompleted, markCategoryCompleted } = useProgress();
  
  // 現在のドキュメントの完了状態を確認
  const currentDocument = progress.documents.items[currentPage - 1];
  const isCompleted = currentDocument && currentDocument.completed;
  
  const documents = [
    {
      title: "就業規則",
      content: "この会社で勤務するにあたっての基本的なルールや働き方のガイドラインについて記載されています。よく確認してください。",
      pdfUrl: "/documents/rule_general.pdf"
    },
    {
      title: "リモートワーク規定",
      content: "リモートワークに関するルールや実施方法について記載されています。よく確認してください。",
      pdfUrl: "/documents/rule_remotework.pdf"
    },
    {
      title: "秘密保持契約書",
      content: "会社の機密情報の取り扱いについて定めています。内容をよく理解した上で入社時に署名していただきます。",
      pdfUrl: "/documents/nda.pdf"
    },
    {
      title: "個人情報の取り扱いに関する同意書",
      content: "当社が収集する個人情報の種類、利用目的、管理方法などについて記載されています。内容をよく確認してください。",
      pdfUrl: "/documents/personalinfo_agreement.pdf"
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
          <div className="pdf-viewer">
            <object
              data={documents[currentPage - 1].pdfUrl}
              type="application/pdf"
              width="100%"
              height="500px"
            >
              <p>PDFを表示できません。 <a href={documents[currentPage - 1].pdfUrl} target="_blank" rel="noopener noreferrer">こちら</a>から開いてください。</p>
            </object>
          </div>
        </div>

        {isCompleted ? (
          <div className="completed-status">
            {currentDocument.completedAt} に確認済み
          </div>
        ) : (
          <button 
            className="full-width" 
            onClick={() => {
              // 現在のページに対応するアイテムを完了としてマーク
              markItemCompleted('documents', `doc${currentPage}`);
              goToNextPage();
              
              // 最後のページだった場合、カテゴリ全体を完了としてマークするオプションもあり
              // if (currentPage === totalPages) {
              //   markCategoryCompleted('documents');
              // }
            }}
          >
            確認しました
          </button>
        )}
      </main>

      <footer>
        入社日まであと <strong>{daysUntilJoining}</strong> 日です！
      </footer>
    </div>
  );
};

export default DocumentCheck;
