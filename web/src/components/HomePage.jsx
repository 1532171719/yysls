import React, { useState } from 'react';
import LotteryWheel from './LotteryWheel';
import WinnerMessage from './WinnerMessage';
import WinnerStatsModal from './WinnerStatsModal';
import './HomePage.css';

function HomePage({
  participants,
  awards,
  backgroundImage,
  backgroundOpacity,
  titleText,
  titleStyle,
  wheelPosition,
  wheelSize,
  awardListPosition,
  awardListSize,
  winnerMessagePosition,
  winnerMessageSize,
  onWinnerMessagePositionChange,
  onWinnerMessageSizeChange,
  onGoToAdmin
}) {
  const [showStatsModal, setShowStatsModal] = useState(false);
  const [winner, setWinner] = useState(null);
  const [winningAward, setWinningAward] = useState(null);
  const [selectedAwardId, setSelectedAwardId] = useState(null);

  // { awardId: [participantId, ...] }
  const [awardWinners, setAwardWinners] = useState({});

  // { awardId: count }
  const [manualDrawnCounts, setManualDrawnCounts] = useState({});

  // 已中奖参与者（全局仅一次中奖）
  const [drawnParticipants, setDrawnParticipants] = useState(new Set());

  const [drawHistory, setDrawHistory] = useState([]);

  // 🎯 抽奖
  const handleDraw = (drawnParticipant, drawnAward) => {
    setWinner(drawnParticipant);
    setWinningAward(drawnAward);

    // 标记为已中奖（全局）
    setDrawnParticipants(prev => new Set([...prev, drawnParticipant.id]));

    // 记录中奖名单（用于可视化，但不用于计数）
    setAwardWinners(prev => {
      const newWinners = { ...prev };
      if (!newWinners[drawnAward.id]) newWinners[drawnAward.id] = [];
      newWinners[drawnAward.id].push(drawnParticipant.id);
      return newWinners;
    });

    // 🎯 正确计数：真实的抽奖次数
    setManualDrawnCounts(prev => ({
      ...prev,
      [drawnAward.id]: (prev[drawnAward.id] || 0) + 1
    }));

    // 历史记录
    setDrawHistory(prev => [
      ...prev,
      {
        index: prev.length + 1,
        winnerName: drawnParticipant.name,
        awardName: drawnAward.name
      }
    ]);
  };

  // 🎯 重置当前奖项（允许这些人再次中奖）
  const handleReset = () => {
    if (!selectedAwardId) {
      alert('请先选择一个奖项！');
      return;
    }

    const award = awards.find(a => a.id === selectedAwardId);
    if (!window.confirm(`确定要重新抽取奖项 "${award.name}" 吗？`)) return;

    // 找到当前奖项所有中奖者
    const winnerIds = awardWinners[selectedAwardId] || [];

    // 从全局已中奖集合中移除这些人
    setDrawnParticipants(prev => {
      const newSet = new Set(prev);
      winnerIds.forEach(id => newSet.delete(id));
      return newSet;
    });

    // 清空该奖项的中奖记录
    setAwardWinners(prev => {
      const newWinners = { ...prev };
      delete newWinners[selectedAwardId];
      return newWinners;
    });

    // 重置该奖项的抽取次数
    setManualDrawnCounts(prev => {
      const newCounts = { ...prev };
      delete newCounts[selectedAwardId];
      return newCounts;
    });

    // 清掉显示中的中奖者
    if (winningAward && winningAward.id === selectedAwardId) {
      setWinner(null);
      setWinningAward(null);
    }
  };

  const getSelectedAwardDrawnCount = () => {
    if (!selectedAwardId) return 0;
    return manualDrawnCounts[selectedAwardId] || 0;
  };

  // 默认选中第一个奖项
  React.useEffect(() => {
    if (awards.length > 0 && !selectedAwardId) {
      setSelectedAwardId(awards[0].id);
    }
  }, [awards, selectedAwardId]);

  const selectedAward = awards.find(a => a.id === selectedAwardId);

  // 调试：检查背景图片和透明度
  console.log('背景图片路径:', backgroundImage);
  console.log('背景透明度:', backgroundOpacity);

  return (
    <div
      className="home-page"
      style={{
        backgroundImage: backgroundImage ? `url(${backgroundImage})` : 'none',
        backgroundSize: 'cover',
        backgroundPosition: 'center',
        backgroundAttachment: 'fixed',
        backgroundColor: '#ffffff'
      }}
    >
      {backgroundImage && (
        <div
          className="background-overlay"
          style={{
            position: 'fixed',
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            backgroundColor: 'rgba(255, 255, 255, ' + (1 - backgroundOpacity) + ')',
            pointerEvents: 'none',
            zIndex: 0
          }}
        />
      )}

      <div className="home-page-content">
        <div className="header">
          <div className="header-left">
            <button className="back-btn">主页</button>
            <button className="stats-btn" onClick={() => setShowStatsModal(true)}>
              中奖历史
            </button>
          </div>
          <h1
            className="title"
            style={{
              fontSize: `${titleStyle?.fontSize || 36}px`,
              color: titleStyle?.color || '#1890ff',
              fontWeight: titleStyle?.fontWeight || 'bold'
            }}
          >
            {titleText || '我真是服啦百业周年庆！'}
          </h1>
        </div>

        {/* 转盘 */}
        <div
          className="wheel-container-absolute"
          style={{
            position: 'fixed',
            top: wheelPosition?.y ?? 80,
            right: wheelPosition?.x ?? 20,
            width: `${wheelSize?.width ?? 400}px`,
            height: `${wheelSize?.height ?? 400}px`,
            zIndex: 10
          }}
        >
          <LotteryWheel
            participants={participants}
            awards={awards}
            selectedAwardId={selectedAwardId}
            selectedAwardDrawnCount={getSelectedAwardDrawnCount()}
            manualDrawnCounts={manualDrawnCounts}
            wheelSize={wheelSize}
            drawnParticipants={drawnParticipants}
            onDraw={handleDraw}
          />
        </div>

        {/* 奖项图片列表 */}
        <div
          className="award-list-bottom-left"
          style={{
            position: 'fixed',
            bottom: awardListPosition?.y ?? 20,
            left: awardListPosition?.x ?? 20
          }}
        >
          {awards.map((award, index) => (
            <div
              key={award.id || index}
              className={`award-item ${selectedAwardId === award.id ? 'selected' : ''}`}
              onClick={() => setSelectedAwardId(award.id)}
              style={{
                width: awardListSize?.width ?? 120,
                height: awardListSize?.height ?? 160
              }}
            >
              <img
                src={award.image || '/素材库/奖项1.png'}
                alt={award.name || `奖项${index + 1}`}
                className="award-item-image"
              />
            </div>
          ))}
        </div>

        {/* 中奖消息 */}
        <WinnerMessage
          winner={winner}
          winningAward={winningAward}
          position={winnerMessagePosition}
          size={winnerMessageSize}
          onPositionChange={onWinnerMessagePositionChange}
          onSizeChange={onWinnerMessageSizeChange}
        />

        <div className="bottom-right-actions">
          <button className="reset-btn" onClick={handleReset}>
            重新开始
          </button>
          <button className="admin-btn" onClick={onGoToAdmin}>
            后台管理
          </button>
        </div>

        {showStatsModal && (
          <WinnerStatsModal drawHistory={drawHistory} onClose={() => setShowStatsModal(false)} />
        )}
      </div>
    </div>
  );
}

export default HomePage;
