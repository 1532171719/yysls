import React from 'react'
import './WinnerStatsModal.css'

function WinnerStatsModal({ awards, manualDrawnCounts, onClose }) {
  const getAwardStats = () => {
    return awards.map(award => {
      const manualCount = manualDrawnCounts && manualDrawnCounts[award.id]
      const drawnCount = manualCount !== undefined ? manualCount : 0
      return {
        ...award,
        drawn: drawnCount
      }
    })
  }

  const awardStats = getAwardStats()

  return (
    <div className="winner-stats-modal-overlay" onClick={onClose}>
      <div className="winner-stats-modal" onClick={(e) => e.stopPropagation()}>
        <div className="modal-header">
          <h2>中奖情况</h2>
          <button className="close-btn" onClick={onClose}>×</button>
        </div>
        <div className="modal-content">
          <table className="stats-table">
            <thead>
              <tr>
                <th>奖项</th>
                <th>奖励数量</th>
                <th>已中奖</th>
              </tr>
            </thead>
            <tbody>
              {awardStats.map((award, index) => (
                <tr key={award.id || index}>
                  <td>{award.name || `奖项${index + 1}`}</td>
                  <td>{award.quantity || 0}</td>
                  <td>{award.drawn || 0}</td>
                </tr>
              ))}
              {awardStats.length === 0 && (
                <tr>
                  <td colSpan="3" style={{ textAlign: 'center', color: '#999' }}>
                    暂无奖项数据
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  )
}

export default WinnerStatsModal

