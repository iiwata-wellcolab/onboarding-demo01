import React from 'react';
import { Link } from 'react-router-dom';
import { useProgress } from '../contexts/ProgressContext';

const ItemsToBring = ({ daysUntilJoining }) => {
  const { progress, markCategoryCompleted } = useProgress();
  
  // カテゴリの完了状態を確認
  const isAllCompleted = progress.items.completed === progress.items.total;
  const completedItem = isAllCompleted ? progress.items.items.find(item => item.completed) : null;
  const itemCategories = [
    {
      title: "人事関係",
      items: [
        "健康診断個人票",
        "健康診断の領収書",
        "パスポート・在留カード（外国人むけ）"
      ]
    },
    {
      title: "給与関係",
      items: [
        "年金手帳",
        "雇用（失業保険）保険被保険者証",
        "扶養控除等申請書",
        "源泉徴収票",
        "住民税の特別徴収にかかる異動届"
      ]
    }
  ];

  return (
    <div>
      <header>
        <h1>入社日に持参するもの</h1>
      </header>

      <main>
        <div className="nav">
          <Link to="/dashboard">
            <button>戻る</button>
          </Link>
        </div>

        {itemCategories.map((category, index) => (
          <div className="card" key={index}>
            <h3>{category.title}</h3>
            <ol className="items-list">
              {category.items.map((item, itemIndex) => (
                <li key={itemIndex}>
                  {item}
                </li>
              ))}
            </ol>
          </div>
        ))}

        <div className="card">
          <p className="note">
            <strong>注意事項：</strong> 上記の書類は入社日当日に必要となります。
            忘れずに持参してください。書類に不備がある場合、手続きが遅れる可能性があります。
          </p>
        </div>

        {isAllCompleted ? (
          <div className="completed-status">
            {completedItem && completedItem.completedAt} に確認済み
            <Link to="/dashboard">
              <button className="secondary-button mt-10">ダッシュボードに戻る</button>
            </Link>
          </div>
        ) : (
          <Link to="/dashboard">
            <button 
              className="full-width"
              onClick={() => markCategoryCompleted('items')}
            >
              確認しました
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

export default ItemsToBring;
