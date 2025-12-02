import React, { useState } from 'react'
import './PasswordModal.css'

function PasswordModal({ onClose, onSubmit }) {
  const [password, setPassword] = useState('')

  const handleSubmit = (e) => {
    e.preventDefault()
    onSubmit(password)
    setPassword('')
  }

  return (
    <div className="password-modal-overlay" onClick={onClose}>
      <div className="password-modal" onClick={(e) => e.stopPropagation()}>
        <h2>请输入密码</h2>
        <form onSubmit={handleSubmit}>
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="请输入密码"
            autoFocus
            className="password-input"
          />
          <div className="password-modal-actions">
            <button type="button" onClick={onClose} className="cancel-btn">
              取消
            </button>
            <button type="submit" className="submit-btn">
              确定
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}

export default PasswordModal

