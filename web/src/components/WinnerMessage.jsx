import React, { useRef, useEffect, useState } from 'react'
import { makeDraggable } from '../utils/draggable'
import './WinnerMessage.css'

function WinnerMessage({ winner, winningAward, position, size, onPositionChange, onSizeChange }) {
  const messageRef = useRef(null)
  const [isResizing, setIsResizing] = useState(false)
  const [resizeStart, setResizeStart] = useState({ x: 0, y: 0, width: 0, height: 0 })

  // 初始化位置和大小
  useEffect(() => {
    if (messageRef.current && position) {
      messageRef.current.style.left = `${position.x}px`
      messageRef.current.style.top = `${position.y}px`
    }
  }, [position?.x, position?.y])

  useEffect(() => {
    if (messageRef.current && size) {
      messageRef.current.style.width = `${size.width}px`
      messageRef.current.style.height = `${size.height}px`
    }
  }, [size?.width, size?.height])

  // 设置拖拽功能（只初始化一次）
  useEffect(() => {
    if (messageRef.current) {
      // 如果没有初始位置，设置默认位置
      if (!position) {
        messageRef.current.style.left = '100px'
        messageRef.current.style.top = '100px'
      }
      
      const cleanup = makeDraggable(messageRef.current, (pos) => {
        if (onPositionChange) {
          onPositionChange(pos)
        }
      })
      return cleanup
    }
  }, []) // 只在组件挂载时初始化一次

  const handleResizeStart = (e) => {
    e.stopPropagation()
    setIsResizing(true)
    if (messageRef.current) {
      const rect = messageRef.current.getBoundingClientRect()
      setResizeStart({
        x: e.clientX,
        y: e.clientY,
        width: rect.width,
        height: rect.height
      })
    }
  }

  useEffect(() => {
    const handleResizeMove = (e) => {
      if (!isResizing) return
      const deltaX = e.clientX - resizeStart.x
      const deltaY = e.clientY - resizeStart.y
      const newWidth = Math.max(200, resizeStart.width + deltaX)
      const newHeight = Math.max(80, resizeStart.height + deltaY)
      
      if (messageRef.current) {
        messageRef.current.style.width = `${newWidth}px`
        messageRef.current.style.height = `${newHeight}px`
      }
      
      if (onSizeChange) {
        onSizeChange({ width: newWidth, height: newHeight })
      }
    }

    const handleResizeEnd = () => {
      setIsResizing(false)
    }

    if (isResizing) {
      document.addEventListener('mousemove', handleResizeMove)
      document.addEventListener('mouseup', handleResizeEnd)
    }

    return () => {
      document.removeEventListener('mousemove', handleResizeMove)
      document.removeEventListener('mouseup', handleResizeEnd)
    }
  }, [isResizing, resizeStart, onSizeChange])

  return (
    <div
      ref={messageRef}
      className="winner-message-box"
      style={{
        position: 'fixed',
        left: position?.x || 100,
        top: position?.y || 100,
        width: size?.width || 300,
        height: size?.height || 80
      }}
    >
      <div className="winner-message-content">
        {winner && winningAward 
          ? `恭喜 ${winner.name} 抽中了 ${winningAward.name}！`
          : '恭喜-------抽中了-------'
        }
      </div>
      <div 
        className="resize-handle"
        onMouseDown={handleResizeStart}
      />
    </div>
  )
}

export default WinnerMessage

