import React, { useState, useEffect } from 'react'
import './LayoutSettings.css'

function LayoutSettings({
  wheelPosition,
  wheelSize,
  awardListPosition,
  awardListSize,
  onWheelPositionChange,
  onWheelSizeChange,
  onAwardListPositionChange,
  onAwardListSizeChange
}) {
  const [localWheelPos, setLocalWheelPos] = useState(wheelPosition || { x: 20, y: 80 })
  const [localWheelSize, setLocalWheelSize] = useState(wheelSize || { width: 400, height: 400 })
  const [localAwardListPos, setLocalAwardListPos] = useState(awardListPosition || { x: 20, y: 20 })
  const [localAwardListSize, setLocalAwardListSize] = useState(awardListSize || { width: 120, height: 160 })

  useEffect(() => {
    if (wheelPosition) setLocalWheelPos(wheelPosition)
    if (wheelSize) setLocalWheelSize(wheelSize)
    if (awardListPosition) setLocalAwardListPos(awardListPosition)
    if (awardListSize) setLocalAwardListSize(awardListSize)
  }, [wheelPosition, wheelSize, awardListPosition, awardListSize])

  const handleWheelPosChange = (field, value) => {
    const newPos = { ...localWheelPos, [field]: parseInt(value) || 0 }
    setLocalWheelPos(newPos)
    if (onWheelPositionChange) {
      onWheelPositionChange(newPos)
    }
  }

  const handleWheelSizeChange = (field, value) => {
    const newSize = { ...localWheelSize, [field]: parseInt(value) || 100 }
    setLocalWheelSize(newSize)
    if (onWheelSizeChange) {
      onWheelSizeChange(newSize)
    }
  }

  const handleAwardListPosChange = (field, value) => {
    const newPos = { ...localAwardListPos, [field]: parseInt(value) || 0 }
    setLocalAwardListPos(newPos)
    if (onAwardListPositionChange) {
      onAwardListPositionChange(newPos)
    }
  }

  const handleAwardListSizeChange = (field, value) => {
    const newSize = { ...localAwardListSize, [field]: parseInt(value) || 100 }
    setLocalAwardListSize(newSize)
    if (onAwardListSizeChange) {
      onAwardListSizeChange(newSize)
    }
  }


  return (
    <div className="layout-settings">
      <div className="layout-section">
        <h3 className="section-title">转盘设置</h3>
        <div className="setting-group">
          <label className="setting-label">位置（右上角距离）</label>
          <div className="position-inputs">
            <div className="input-group">
              <span>右:</span>
              <input
                type="number"
                value={localWheelPos.x}
                onChange={(e) => handleWheelPosChange('x', e.target.value)}
                className="setting-input-number"
              />
              <span>px</span>
            </div>
            <div className="input-group">
              <span>上:</span>
              <input
                type="number"
                value={localWheelPos.y}
                onChange={(e) => handleWheelPosChange('y', e.target.value)}
                className="setting-input-number"
              />
              <span>px</span>
            </div>
          </div>
        </div>
        <div className="setting-group">
          <label className="setting-label">大小</label>
          <div className="position-inputs">
            <div className="input-group">
              <span>宽:</span>
              <input
                type="number"
                value={localWheelSize.width}
                onChange={(e) => handleWheelSizeChange('width', e.target.value)}
                className="setting-input-number"
                min="200"
                max="800"
              />
              <span>px</span>
            </div>
            <div className="input-group">
              <span>高:</span>
              <input
                type="number"
                value={localWheelSize.height}
                onChange={(e) => handleWheelSizeChange('height', e.target.value)}
                className="setting-input-number"
                min="200"
                max="800"
              />
              <span>px</span>
            </div>
          </div>
        </div>
      </div>

      <div className="layout-section">
        <h3 className="section-title">奖项图片列表设置</h3>
        <div className="setting-group">
          <label className="setting-label">位置（左下角距离）</label>
          <div className="position-inputs">
            <div className="input-group">
              <span>左:</span>
              <input
                type="number"
                value={localAwardListPos.x}
                onChange={(e) => handleAwardListPosChange('x', e.target.value)}
                className="setting-input-number"
              />
              <span>px</span>
            </div>
            <div className="input-group">
              <span>下:</span>
              <input
                type="number"
                value={localAwardListPos.y}
                onChange={(e) => handleAwardListPosChange('y', e.target.value)}
                className="setting-input-number"
              />
              <span>px</span>
            </div>
          </div>
        </div>
        <div className="setting-group">
          <label className="setting-label">单个图片大小</label>
          <div className="position-inputs">
            <div className="input-group">
              <span>宽:</span>
              <input
                type="number"
                value={localAwardListSize.width}
                onChange={(e) => handleAwardListSizeChange('width', e.target.value)}
                className="setting-input-number"
                min="80"
                max="300"
              />
              <span>px</span>
            </div>
            <div className="input-group">
              <span>高:</span>
              <input
                type="number"
                value={localAwardListSize.height}
                onChange={(e) => handleAwardListSizeChange('height', e.target.value)}
                className="setting-input-number"
                min="100"
                max="400"
              />
              <span>px</span>
            </div>
          </div>
        </div>
      </div>

      <div className="layout-section">
        <h3 className="section-title">布局预览</h3>
        <div className="preview-container">
          <div className="preview-screen">
            {/* 转盘预览 */}
            <div
              className="preview-wheel"
              style={{
                position: 'absolute',
                top: localWheelPos.y,
                right: localWheelPos.x,
                width: localWheelSize.width,
                height: localWheelSize.height
              }}
            >
              <div className="preview-wheel-circle"></div>
              <div className="preview-label">转盘</div>
            </div>

            {/* 奖项图片列表预览 */}
            <div
              className="preview-award-list"
              style={{
                position: 'absolute',
                bottom: localAwardListPos.y,
                left: localAwardListPos.x
              }}
            >
              <div
                className="preview-award-item"
                style={{
                  width: localAwardListSize.width,
                  height: localAwardListSize.height
                }}
              >
                <div className="preview-award-image"></div>
              </div>
              <div className="preview-label">奖项列表</div>
            </div>

          </div>
        </div>
      </div>
    </div>
  )
}

export default LayoutSettings

