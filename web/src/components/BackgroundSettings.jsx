import React, { useState, useEffect } from 'react'
import './BackgroundSettings.css'

function BackgroundSettings({ backgroundImage, backgroundOpacity, onBackgroundImageChange, onBackgroundOpacityChange }) {
  const [localImage, setLocalImage] = useState(backgroundImage || '')
  const [localOpacity, setLocalOpacity] = useState(backgroundOpacity || 0.5)

  useEffect(() => {
    setLocalImage(backgroundImage || '')
    setLocalOpacity(backgroundOpacity || 0.5)
  }, [backgroundImage, backgroundOpacity])

  const handleImageChange = (e) => {
    const value = e.target.value
    setLocalImage(value)
    onBackgroundImageChange(value)
  }

  const handleOpacityChange = (e) => {
    const value = parseFloat(e.target.value)
    setLocalOpacity(value)
    onBackgroundOpacityChange(value)
  }

  const handleClear = () => {
    setLocalImage('')
    setLocalOpacity(0.5)
    onBackgroundImageChange('')
    onBackgroundOpacityChange(0.5)
  }

  return (
    <div className="background-settings">
      <div className="setting-group">
        <label className="setting-label">背景图片路径</label>
        <input
          type="text"
          value={localImage}
          onChange={handleImageChange}
          placeholder="/素材库/背景图片.jpg 或 图片URL"
          className="setting-input"
        />
        <div className="setting-hint">
          支持本地路径（如：/素材库/背景图片.jpg）或网络图片URL
        </div>
      </div>

      <div className="setting-group">
        <label className="setting-label">
          透明度: {Math.round(localOpacity * 100)}%
        </label>
        <input
          type="range"
          min="0"
          max="1"
          step="0.01"
          value={localOpacity}
          onChange={handleOpacityChange}
          className="setting-slider"
        />
        <div className="setting-hint">
          调整背景图片的透明度，0为完全透明，1为完全不透明
        </div>
      </div>

      <div className="setting-group">
        <div className="preview-container">
          <div
            className="preview-box"
            style={{
              backgroundImage: localImage ? `url(${localImage})` : 'none',
              backgroundSize: 'cover',
              backgroundPosition: 'center',
              opacity: localOpacity
            }}
          >
            <div className="preview-content">
              预览效果
            </div>
          </div>
        </div>
      </div>

      <div className="setting-actions">
        <button className="clear-btn" onClick={handleClear}>
          清除背景
        </button>
      </div>
    </div>
  )
}

export default BackgroundSettings

