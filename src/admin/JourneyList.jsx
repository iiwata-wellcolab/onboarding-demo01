import React from 'react';

const JourneyList = () => {
  // iframeのスタイル設定
  const iframeStyle = {
    width: '100%',
    height: 'calc(100vh - 60px)', // ヘッダーの高さを考慮
    border: 'none',
    overflow: 'hidden'
  };


  return (
    <div className="journey-designer-container" style={{ width: '100%', height: '100%' }}>
      {/* iframeを使ってHTMLファイルを表示 */}
      <iframe 
        src="/mockups/onboarding-journey-designer.html" 
        title="オンボーディングジャーニーデザイナー" 
        style={iframeStyle}
      />
    </div>
  );
};

export default JourneyList;
