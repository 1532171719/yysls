// 拖拽工具函数
export const makeDraggable = (element, onPositionChange) => {
  if (!element) return

  let isDragging = false
  let startX = 0
  let startY = 0
  let currentX = 0
  let currentY = 0

  // 获取当前transform值
  const getCurrentPosition = () => {
    const transform = element.style.transform || ''
    const match = transform.match(/translate\(([^,]+)px,\s*([^)]+)px\)/)
    if (match) {
      currentX = parseFloat(match[1]) || 0
      currentY = parseFloat(match[2]) || 0
    }
  }

  getCurrentPosition()

  const handleMouseDown = (e) => {
    isDragging = true
    const rect = element.getBoundingClientRect()
    const position = window.getComputedStyle(element).position
    
    // 获取当前元素的位置
    if (position === 'fixed') {
      // 对于fixed定位，从left和top获取位置
      const left = parseFloat(element.style.left) || rect.left
      const top = parseFloat(element.style.top) || rect.top
      currentX = left
      currentY = top
    } else {
      getCurrentPosition()
    }
    
    startX = e.clientX
    startY = e.clientY
    element.style.cursor = 'grabbing'
    element.style.zIndex = '1000'
    e.preventDefault()
    e.stopPropagation()
  }

  const handleMouseMove = (e) => {
    if (!isDragging) return
    e.preventDefault()
    
    const deltaX = e.clientX - startX
    const deltaY = e.clientY - startY
    const position = window.getComputedStyle(element).position
    
    if (position === 'fixed') {
      // 对于fixed定位，更新left和top
      const newLeft = currentX + deltaX
      const newTop = currentY + deltaY
      element.style.left = `${newLeft}px`
      element.style.top = `${newTop}px`
      // 清除right和bottom，避免冲突
      element.style.right = 'auto'
      element.style.bottom = 'auto'
    } else {
      currentX = e.clientX - startX + (currentX || 0)
      currentY = e.clientY - startY + (currentY || 0)
      element.style.transform = `translate(${currentX}px, ${currentY}px)`
    }
  }

  const handleMouseUp = () => {
    if (isDragging) {
      isDragging = false
      element.style.cursor = 'grab'
      element.style.zIndex = '1'
      if (onPositionChange) {
        const position = window.getComputedStyle(element).position
        if (position === 'fixed') {
          const left = parseFloat(element.style.left) || 0
          const top = parseFloat(element.style.top) || 0
          onPositionChange({ x: left, y: top })
        } else {
          onPositionChange({ x: currentX, y: currentY })
        }
      }
    }
  }

  element.style.cursor = 'grab'
  element.style.userSelect = 'none'
  // 不要覆盖原有的position设置
  element.addEventListener('mousedown', handleMouseDown)
  document.addEventListener('mousemove', handleMouseMove)
  document.addEventListener('mouseup', handleMouseUp)

  return () => {
    element.removeEventListener('mousedown', handleMouseDown)
    document.removeEventListener('mousemove', handleMouseMove)
    document.removeEventListener('mouseup', handleMouseUp)
  }
}

