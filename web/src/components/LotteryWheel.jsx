import React, { useState, useRef, useEffect } from 'react'
import './LotteryWheel.css'

function LotteryWheel({ participants, awards, awardRules, drawnParticipants, drawnAwards, disabledRule2Awards, selectedAwardId, manualDrawnCounts, wheelSize, onDraw }) {
  const [isSpinning, setIsSpinning] = useState(false)
  const [rotation, setRotation] = useState(0)
  const canvasRef = useRef(null)

  // 计算可用的参与者和奖项
  const getAvailableParticipants = () => {
    return participants.filter(p => !drawnParticipants.has(p.id))
  }

  const getAvailableAwards = () => {
    // 如果指定了选中的奖项，只从该奖项中抽取
    if (selectedAwardId) {
      const selectedAward = awards.find(a => a.id === selectedAwardId)
      if (!selectedAward) return []
      
      // 检查是否被规则2禁用
      if (disabledRule2Awards.has(selectedAward.id)) {
        return []
      }
      
      // 检查数量限制（规则1）- 使用手动输入的数量或自动统计的数量
      const manualCount = manualDrawnCounts && manualDrawnCounts[selectedAward.id]
      const autoCount = Array.from(drawnAwards).filter(id => id === selectedAward.id).length
      const drawnCount = manualCount !== undefined ? manualCount : autoCount
      
      if (drawnCount >= selectedAward.quantity) {
        return []
      }
      
      return [selectedAward]
    }
    
    // 如果没有选中奖项，从所有可用奖项中随机选择
    return awards.filter(award => {
      // 检查是否被规则2禁用
      if (disabledRule2Awards.has(award.id)) {
        return false
      }
      
      // 检查数量限制（规则1）- 使用手动输入的数量或自动统计的数量
      const manualCount = manualDrawnCounts && manualDrawnCounts[award.id]
      const autoCount = Array.from(drawnAwards).filter(id => id === award.id).length
      const drawnCount = manualCount !== undefined ? manualCount : autoCount
      
      return drawnCount < award.quantity
    })
  }


  // 绘制转盘 - 始终显示所有参与者（平均分配）
  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return

    const ctx = canvas.getContext('2d')
    
    // 使用传入的wheelSize或默认大小
    const containerSize = wheelSize ? Math.min(wheelSize.width, wheelSize.height) - 20 : 380
    canvas.width = containerSize
    canvas.height = containerSize

    const centerX = canvas.width / 2
    const centerY = canvas.height / 2
    const radius = Math.min(centerX, centerY) - 20

    ctx.clearRect(0, 0, canvas.width, canvas.height)

    const segmentCount = participants.length || 1
    
    if (segmentCount === 0 || participants.length === 0) {
      // 如果没有参与者，绘制一个空转盘
      ctx.fillStyle = '#f5f5f5'
      ctx.strokeStyle = '#ddd'
      ctx.lineWidth = 2
      ctx.beginPath()
      ctx.arc(centerX, centerY, radius, 0, 2 * Math.PI)
      ctx.fill()
      ctx.stroke()
    } else {
      const anglePerSegment = (2 * Math.PI) / segmentCount

      // 绘制转盘 - 显示所有参与者
      participants.forEach((participant, index) => {
        const startAngle = index * anglePerSegment - Math.PI / 2
        const endAngle = (index + 1) * anglePerSegment - Math.PI / 2

        // 交替颜色，不再根据是否抽中来改变颜色
        ctx.fillStyle = index % 2 === 0 ? '#e6f7ff' : '#bae7ff'
        ctx.strokeStyle = '#91d5ff'
        ctx.lineWidth = 2

        ctx.beginPath()
        ctx.moveTo(centerX, centerY)
        ctx.arc(centerX, centerY, radius, startAngle, endAngle)
        ctx.closePath()
        ctx.fill()
        ctx.stroke()

        // 绘制文字
        ctx.save()
        ctx.translate(centerX, centerY)
        ctx.rotate(startAngle + anglePerSegment / 2)
        ctx.textAlign = 'left'
        ctx.textBaseline = 'middle'
        ctx.fillStyle = '#000'
        ctx.font = '16px Arial'
        const text = participant.name || `参与者${index + 1}`
        ctx.fillText(text, radius * 0.6, 0)
        ctx.restore()
      })
    }

    // 指针在转盘外部绘制，固定在正下方
    // 指针不随转盘旋转，所以在这里不绘制
    
    // 监听容器大小变化
    let resizeObserver = null
    if (typeof ResizeObserver !== 'undefined') {
      resizeObserver = new ResizeObserver(() => {
        // 延迟执行，避免频繁重绘
        setTimeout(() => {
          const canvas = canvasRef.current
          if (canvas) {
            const container = canvas.parentElement
            if (container) {
              const containerWidth = container.clientWidth
              const containerHeight = container.clientHeight
              const size = Math.min(containerWidth, containerHeight)
              
              if (canvas.width !== size || canvas.height !== size) {
                canvas.width = size
                canvas.height = size
                
                // 重新绘制
                const ctx = canvas.getContext('2d')
                const centerX = canvas.width / 2
                const centerY = canvas.height / 2
                const radius = Math.min(centerX, centerY) - 20
                
                ctx.clearRect(0, 0, canvas.width, canvas.height)
                
                const segmentCount = participants.length || 1
                if (segmentCount > 0 && participants.length > 0) {
                  const anglePerSegment = (2 * Math.PI) / segmentCount
                  participants.forEach((participant, index) => {
                    const startAngle = index * anglePerSegment - Math.PI / 2
                    const endAngle = (index + 1) * anglePerSegment - Math.PI / 2
                    
                    ctx.fillStyle = index % 2 === 0 ? '#e6f7ff' : '#bae7ff'
                    ctx.strokeStyle = '#91d5ff'
                    ctx.lineWidth = 2
                    
                    ctx.beginPath()
                    ctx.moveTo(centerX, centerY)
                    ctx.arc(centerX, centerY, radius, startAngle, endAngle)
                    ctx.closePath()
                    ctx.fill()
                    ctx.stroke()
                    
                    ctx.save()
                    ctx.translate(centerX, centerY)
                    ctx.rotate(startAngle + anglePerSegment / 2)
                    ctx.textAlign = 'left'
                    ctx.textBaseline = 'middle'
                    ctx.fillStyle = '#000'
                    ctx.font = '16px Arial'
                    const text = participant.name || `参与者${index + 1}`
                    ctx.fillText(text, radius * 0.6, 0)
                    ctx.restore()
                  })
                }
              }
            }
          }
        }, 100)
      })
      
      const container = canvas.parentElement
      if (container) {
        resizeObserver.observe(container)
      }
    }
    
    return () => {
      if (resizeObserver) {
        resizeObserver.disconnect()
      }
    }
  }, [participants, drawnParticipants, rotation, wheelSize])

  const handleSpin = () => {
    if (isSpinning) return

    const availableParticipants = getAvailableParticipants()
    let availableAwards = getAvailableAwards()

    // 如果选中的奖项已经抽完，尝试从所有可用奖项中抽取
    if (selectedAwardId && availableAwards.length === 0) {
      // 从所有可用奖项中查找（不包括被规则2禁用的）
      availableAwards = awards.filter(award => {
        // 检查是否被规则2禁用
        if (disabledRule2Awards.has(award.id)) {
          return false
        }
        // 检查数量限制（规则1）- 按奖项ID统计
        const drawnCount = Array.from(drawnAwards).filter(id => id === award.id).length
        return drawnCount < award.quantity
      })
      
      if (availableAwards.length === 0) {
        alert('所有奖项都已抽完！')
        return
      } else {
        alert(`选中的奖项已抽完，将从其他可用奖项中抽取。`)
      }
    }

    if (availableParticipants.length === 0 || availableAwards.length === 0) {
      alert('没有可用的参与者或奖项！')
      return
    }

    setIsSpinning(true)

    // 选择奖项（如果指定了选中奖项，直接使用；否则随机选择）
    let selectedAward = null
    if (selectedAwardId) {
      selectedAward = availableAwards.find(a => a.id === selectedAwardId)
    }
    if (!selectedAward && availableAwards.length > 0) {
      const randomAwardIndex = Math.floor(Math.random() * availableAwards.length)
      selectedAward = availableAwards[randomAwardIndex]
    }

    // 根据奖项规则选择参与者
    let selectedParticipant = null
    const awardRule = awardRules[selectedAward.id] || 'rule1'
    
    if (awardRule === 'rule1') {
      // 规则1：平均分配，不考虑权重
      const randomIndex = Math.floor(Math.random() * availableParticipants.length)
      selectedParticipant = availableParticipants[randomIndex]
    } else {
      // 规则2：根据权重计算概率
      const totalWeight = availableParticipants.reduce((sum, p) => sum + (p.weight || 1), 0)
      const random = Math.random() * totalWeight
      let cumulativeWeight = 0

      for (const participant of availableParticipants) {
        cumulativeWeight += participant.weight || 1
        if (random <= cumulativeWeight) {
          selectedParticipant = participant
          break
        }
      }

      if (!selectedParticipant) {
        selectedParticipant = availableParticipants[0]
      }
    }

    // 计算旋转角度 - 指针在正上方（-90度或270度），需要让选中的参与者停在正上方
    const participantIndex = participants.findIndex(p => p.id === selectedParticipant.id)
    const segmentCount = participants.length
    const anglePerSegment = 360 / segmentCount
    
    // 计算选中参与者的中心角度（从顶部-90度开始，顺时针）
    // 转盘从顶部（-90度）开始绘制，所以：
    // 第0个参与者的中心角度 = -90度 + anglePerSegment / 2
    // 转换为0-360度系统：(-90 + anglePerSegment / 2 + 360) % 360
    const participantCenterAngle = (-90 + participantIndex * anglePerSegment + anglePerSegment / 2 + 360) % 360
    
    // 指针在正上方（-90度或270度位置）
    // 需要让参与者的中心角度转到-90度位置（即270度）
    // 目标：participantCenterAngle + 当前角度 + 新旋转角度 = 270度
    // 新旋转角度 = 270 - participantCenterAngle - (当前角度 % 360)
    const currentAngle = rotation % 360
    let targetAngle = 270 - participantCenterAngle - currentAngle
    
    // 确保角度在合理范围内
    if (targetAngle < 0) {
      targetAngle += 360
    }
    
    // 转多圈增加视觉效果
    const spins = 5 * 360
    const finalRotation = rotation + spins + targetAngle

    setRotation(finalRotation)

    // 动画结束后触发抽奖结果
    setTimeout(() => {
      setIsSpinning(false)
      onDraw(selectedParticipant, selectedAward)
    }, 3000)
  }

  const containerSize = wheelSize ? Math.min(wheelSize.width, wheelSize.height) : 400

  return (
    <div className="lottery-wheel">
      <div 
        className="wheel-container-wrapper"
        style={{
          width: `${containerSize}px`,
          height: `${containerSize}px`
        }}
      >
        {/* 指针固定在正上方 */}
        <div className="wheel-pointer-top"></div>
        <div
          className="wheel-wrapper"
          style={{
            transform: `rotate(${rotation}deg)`,
            transition: isSpinning ? 'transform 3s cubic-bezier(0.17, 0.67, 0.12, 0.99)' : 'none'
          }}
        >
          <canvas
            ref={canvasRef}
            width={containerSize - 20}
            height={containerSize - 20}
            className="wheel-canvas"
          />
        </div>
      </div>
      <button
        className="spin-button"
        onClick={handleSpin}
        disabled={isSpinning}
      >
        {isSpinning ? '抽奖中...' : '开始抽奖'}
      </button>
    </div>
  )
}

export default LotteryWheel

