import React, { useState, useEffect } from 'react'
import './TitleSettings.css'

function TitleSettings({ titleStyle, onTitleStyleChange }) {
  const [localStyle, setLocalStyle] = useState({
    fontSize: titleStyle?.fontSize || 36,
    color: titleStyle?.color || '#1890ff',
    fontWeight: titleStyle?.fontWeight || 'bold',
    fontFamily: titleStyle?.fontFamily || 'Arial',
    textShadow: titleStyle?.textShadow || '2px 2px 4px rgba(0, 0, 0, 0.1)',
    letterSpacing: titleStyle?.letterSpacing || 2
  })

  useEffect(() => {
    if (titleStyle) {
      setLocalStyle({
        fontSize: titleStyle.fontSize || 36,
        color: titleStyle.color || '#1890ff',
        fontWeight: titleStyle.fontWeight || 'bold',
        fontFamily: titleStyle.fontFamily || 'Arial',
        textShadow: titleStyle.textShadow || '2px 2px 4px rgba(0, 0, 0, 0.1)',
        letterSpacing: titleStyle.letterSpacing || 2
      })
    }
  }, [titleStyle])

  const handleChange = (field, value) => {
    const newStyle = { ...localStyle, [field]: value }
    setLocalStyle(newStyle)
    onTitleStyleChange(newStyle)
  }

  return (
    <div className="title-settings">
      <div className="setting-group">
        <label className="setting-label">字体大小: {localStyle.fontSize}px</label>
        <input
          type="range"
          min="12"
          max="72"
          step="1"
          value={localStyle.fontSize}
          onChange={(e) => handleChange('fontSize', parseInt(e.target.value))}
          className="setting-slider"
        />
      </div>

      <div className="setting-group">
        <label className="setting-label">字体颜色</label>
        <input
          type="color"
          value={localStyle.color}
          onChange={(e) => handleChange('color', e.target.value)}
          className="setting-color"
        />
      </div>

      <div className="setting-group">
        <label className="setting-label">字体粗细</label>
        <select
          value={localStyle.fontWeight}
          onChange={(e) => handleChange('fontWeight', e.target.value)}
          className="setting-select"
        >
          <option value="normal">正常</option>
          <option value="bold">粗体</option>
          <option value="lighter">细体</option>
          <option value="bolder">更粗</option>
        </select>
      </div>

      <div className="setting-group">
        <label className="setting-label">字体</label>
        <select
          value={localStyle.fontFamily}
          onChange={(e) => handleChange('fontFamily', e.target.value)}
          className="setting-select"
        >
          <option value="Arial">Arial</option>
          <option value="Microsoft YaHei">微软雅黑</option>
          <option value="SimHei">黑体</option>
          <option value="SimSun">宋体</option>
          <option value="KaiTi">楷体</option>
          <option value="FangSong">仿宋</option>
          <option value="serif">Serif</option>
          <option value="sans-serif">Sans-serif</option>
        </select>
      </div>

      <div className="setting-group">
        <label className="setting-label">字间距: {localStyle.letterSpacing}px</label>
        <input
          type="range"
          min="0"
          max="10"
          step="0.5"
          value={localStyle.letterSpacing}
          onChange={(e) => handleChange('letterSpacing', parseFloat(e.target.value))}
          className="setting-slider"
        />
      </div>

      <div className="setting-group">
        <label className="setting-label">文字阴影</label>
        <input
          type="text"
          value={localStyle.textShadow}
          onChange={(e) => handleChange('textShadow', e.target.value)}
          placeholder="2px 2px 4px rgba(0, 0, 0, 0.1)"
          className="setting-input"
        />
        <div className="setting-hint">
          格式：水平偏移 垂直偏移 模糊半径 颜色（如：2px 2px 4px rgba(0, 0, 0, 0.1)）
        </div>
      </div>

      <div className="setting-group">
        <div className="preview-container">
          <h1
            className="preview-title"
            style={{
              fontSize: `${localStyle.fontSize}px`,
              color: localStyle.color,
              fontWeight: localStyle.fontWeight,
              fontFamily: localStyle.fontFamily,
              textShadow: localStyle.textShadow,
              letterSpacing: `${localStyle.letterSpacing}px`
            }}
          >
            我真是服啦百业周年庆！
          </h1>
        </div>
      </div>
    </div>
  )
}

export default TitleSettings

