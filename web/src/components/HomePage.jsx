import React, { useState } from 'react'
import LotteryWheel from './LotteryWheel'
import WinnerMessage from './WinnerMessage'
import WinnerStatsModal from './WinnerStatsModal'
import './HomePage.css'

function HomePage({ 
  participants, 
  awards, 
  awardRules, 
  backgroundImage, 
  backgroundOpacity, 
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
  const [showStatsModal, setShowStatsModal] = useState(false)
  const [winner, setWinner] = useState(null)
  const [winningAward, setWinningAward] = useState(null)
  const [drawnParticipants, setDrawnParticipants] = useState(new Set())
  const [drawnAwards, setDrawnAwards] = useState(new Set())
  const [disabledRule1Awards, setDisabledRule1Awards] = useState(new Set())
  const [disabledRule2Awards, setDisabledRule2Awards] = useState(new Set())
  const [selectedAwardId, setSelectedAwardId] = useState(null)
  const [awardWinners, setAwardWinners] = useState({}) // { awardId: [winnerName1, winnerName2, ...] }
  const [manualDrawnCounts, setManualDrawnCounts] = useState({}) // { awardId: drawnCount }
  const [drawHistory, setDrawHistory] = useState([]) // [{ index: 1, winnerName: 'xxx', awardName: 'xxx' }, ...]

  const handleDraw = (drawnParticipant, drawnAward) => {
    setWinner(drawnParticipant)
    setWinningAward(drawnAward)
    setDrawnParticipants(prev => new Set([...prev, drawnParticipant.id]))
    setDrawnAwards(prev => new Set([...prev, drawnAward.id]))
    
    // 记录中奖者
    setAwardWinners(prev => {
      const newWinners = { ...prev }
      if (!newWinners[drawnAward.id]) {
        newWinners[drawnAward.id] = []
      }
      newWinners[drawnAward.id].push(drawnParticipant.name)
      return newWinners
    })
    
    // 记录历史
    setDrawHistory(prev => [
      ...prev,
      {
        index: prev.length + 1,
        winnerName: drawnParticipant.name,
        awardName: drawnAward.name
      }
    ])
    
    // 如果抽中的是规则1的奖项，禁用所有其他规则1的奖项
    if (awardRules[drawnAward.id] === 'rule1') {
      const rule1AwardIds = Object.keys(awardRules).filter(
        id => awardRules[id] === 'rule1' && id !== drawnAward.id
      )
      setDisabledRule1Awards(prev => new Set([...prev, ...rule1AwardIds]))
    }
    
    // 如果抽中的是规则2的奖项，禁用所有其他规则2的奖项
    if (awardRules[drawnAward.id] === 'rule2') {
      const rule2AwardIds = Object.keys(awardRules).filter(
        id => awardRules[id] === 'rule2' && id !== drawnAward.id
      )
      setDisabledRule2Awards(prev => new Set([...prev, ...rule2AwardIds]))
    }
  }

  const handleReset = () => {
    if (window.confirm('确定要重新开始吗？这将清除所有抽奖记录。')) {
      setWinner(null)
      setWinningAward(null)
      setDrawnParticipants(new Set())
      setDrawnAwards(new Set())
      setDisabledRule1Awards(new Set())
      setDisabledRule2Awards(new Set())
      setAwardWinners({})
      setManualDrawnCounts({})
      setDrawHistory([])
    }
  }

  // 处理手动输入的已中奖数量
  const handleManualDrawnChange = (awardId, value) => {
    const count = parseInt(value) || 0
    setManualDrawnCounts(prev => ({
      ...prev,
      [awardId]: count
    }))
  }

  // 统计已中奖和剩余数量
  const getAwardStats = () => {
    return awards.map(award => {
      // 使用手动输入的数量，如果没有则使用自动统计的数量
      const manualCount = manualDrawnCounts[award.id]
      const autoCount = Array.from(drawnAwards).filter(id => id === award.id).length
      const drawnCount = manualCount !== undefined ? manualCount : autoCount
      
      // 计算剩余数量
      const remaining = Math.max(0, award.quantity - drawnCount)
      
      return {
        ...award,
        drawn: drawnCount,
        remaining: remaining
      }
    })
  }

  const awardStats = getAwardStats()
  
  // 默认选中第一个奖项
  React.useEffect(() => {
    if (awards.length > 0 && !selectedAwardId) {
      setSelectedAwardId(awards[0].id)
    }
  }, [awards, selectedAwardId])
  
  const selectedAward = awards.find(a => a.id === selectedAwardId)


  return (
    <div 
      className="home-page"
      style={{
        backgroundImage: backgroundImage ? `url(${backgroundImage})` : 'none',
        backgroundSize: 'cover',
        backgroundPosition: 'center',
        backgroundRepeat: 'no-repeat',
        position: 'relative'
      }}
    >
      {backgroundImage && (
        <div 
          className="background-overlay"
          style={{
            backgroundColor: `rgba(255, 255, 255, ${1 - backgroundOpacity})`,
            position: 'absolute',
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            zIndex: 0,
            pointerEvents: 'none'
          }}
        />
      )}
      <div className="home-page-content" style={{ position: 'relative', zIndex: 1 }}>
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
            fontWeight: titleStyle?.fontWeight || 'bold',
            fontFamily: titleStyle?.fontFamily || 'Arial',
            textShadow: titleStyle?.textShadow || '2px 2px 4px rgba(0, 0, 0, 0.1)',
            letterSpacing: `${titleStyle?.letterSpacing || 2}px`
          }}
        >
          我真是服啦百业周年庆！
        </h1>
        <div className="header-actions">
          <button className="action-btn share-btn">分享</button>
          <button className="action-btn edit-btn">编辑</button>
          <button className="icon-btn">🔍</button>
          <button className="icon-btn">📄</button>
          <button className="icon-btn">⋯</button>
        </div>
      </div>

      {/* 转盘 - 右上角 */}
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
              awardRules={awardRules}
              drawnParticipants={drawnParticipants}
              drawnAwards={drawnAwards}
              disabledRule1Awards={disabledRule1Awards}
              disabledRule2Awards={disabledRule2Awards}
              selectedAwardId={selectedAwardId}
              manualDrawnCounts={manualDrawnCounts}
              wheelSize={wheelSize}
              onDraw={handleDraw}
            />
      </div>

      {/* 奖项图片列表 - 左下角 */}
      <div 
        className="award-list-bottom-left"
        style={{
          position: 'fixed',
          bottom: awardListPosition?.y ?? 20,
          left: awardListPosition?.x ?? 20,
          zIndex: 50
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
              onError={(e) => {
                e.target.src = '/素材库/奖项1.png'
              }}
            />
          </div>
        ))}
      </div>

      {/* 中奖消息 - 可拖拽和调整大小 */}
      <WinnerMessage
        winner={winner}
        winningAward={winningAward}
        position={winnerMessagePosition}
        size={winnerMessageSize}
        onPositionChange={onWinnerMessagePositionChange}
        onSizeChange={onWinnerMessageSizeChange}
      />

      {/* 右下角按钮 */}
      <div className="bottom-right-actions">
        <button className="reset-btn" onClick={handleReset}>
          重新开始
        </button>
        <button className="admin-btn" onClick={onGoToAdmin}>
          后台管理
        </button>
      </div>

      {/* 中奖历史弹窗 */}
      {showStatsModal && (
        <WinnerStatsModal
          drawHistory={drawHistory}
          onClose={() => setShowStatsModal(false)}
        />
      )}
      </div>
    </div>
  )
}

export default HomePage

