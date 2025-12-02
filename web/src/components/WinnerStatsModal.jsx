import React from 'react'
import './WinnerStatsModal.css'

function WinnerStatsModal({ drawHistory, onClose }) {
  return (
    <div className="winner-stats-modal-overlay" onClick={onClose}>
      <div className="winner-stats-modal" onClick={(e) => e.stopPropagation()}>
        <div className="modal-header">
          <h2>中奖历史</h2>
          <button className="close-btn" onClick={onClose}>×</button>
        </div>
        <div className="modal-content">
          <table className="stats-table">
            <thead>
              <tr>
                <th>序号</th>
                <th>中奖人名</th>
                <th>中奖奖项</th>
              </tr>
            </thead>
            <tbody>
              {drawHistory && drawHistory.length > 0 ? (
                drawHistory.map((record, index) => (
                  <tr key={index}>
                    <td>{record.index}</td>
                    <td>{record.winnerName}</td>
                    <td>{record.awardName}</td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan="3" style={{ textAlign: 'center', color: '#999' }}>
                    暂无中奖记录
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

