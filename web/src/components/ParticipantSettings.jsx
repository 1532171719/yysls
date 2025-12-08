import React, { useState, useEffect } from 'react'
import './ParticipantSettings.css'

function ParticipantSettings({ participants, awards, onParticipantsChange }) {
  const [localParticipants, setLocalParticipants] = useState(
    participants.length > 0 ? participants : [{ id: Date.now(), name: '', weight: 0, level: 0 }]
  )
  const [isCalculated, setIsCalculated] = useState(false)
  const [showAwardProbabilities, setShowAwardProbabilities] = useState({}) // { awardId: boolean }
  const [awardProbabilities, setAwardProbabilities] = useState({}) // { awardId: [{ name, probability }] }

  useEffect(() => {
    if (participants.length > 0) {
      setLocalParticipants(participants.map(p => ({
        ...p,
        level: p.level !== undefined ? p.level : 0,
        weight: p.weight !== undefined ? p.weight : 0
      })))
    }
  }, [participants])

  const handleAddRow = () => {
    setLocalParticipants([
      ...localParticipants,
      { id: Date.now(), name: '', weight: 0, level: 0 }
    ])
    setIsCalculated(false)
  }

  const handleDeleteRow = (id) => {
    if (localParticipants.length > 1) {
      setLocalParticipants(localParticipants.filter(p => p.id !== id))
      setIsCalculated(false)
    }
  }

  const handleChange = (id, field, value) => {
    const updatedParticipants = localParticipants.map(p => {
      if (p.id === id) {
        if (field === 'weight') {
          const weight = parseFloat(value)
          return { ...p, weight: isNaN(weight) ? 0 : Math.max(0, weight) }
        } else if (field === 'level') {
          const level = parseInt(value)
          return { ...p, level: isNaN(level) ? 0 : Math.max(0, level) }
        }
        return { ...p, [field]: value }
      }
      return p
    })
    
    setLocalParticipants(updatedParticipants)
    setIsCalculated(false)
  }

  const handleCalculate = () => {
    // 验证所有姓名都已填写
    const hasEmptyFields = localParticipants.some(p => !p.name)
    if (hasEmptyFields) {
      alert('请填写所有参与者的姓名！')
      return
    }

    // 检查重名
    const names = localParticipants.map(p => p.name.trim())
    const duplicateNames = names.filter((name, index) => names.indexOf(name) !== index)
    if (duplicateNames.length > 0) {
      const uniqueDuplicates = [...new Set(duplicateNames)]
      alert(`发现重名：${uniqueDuplicates.join('、')}，请修改后再试！`)
      return
    }

    // 验证等级字段
    const hasInvalidLevel = localParticipants.some(p => p.level === undefined || p.level === null || p.level < 0)
    if (hasInvalidLevel) {
      alert('请填写所有参与者的等级（必须大于等于0）！')
      return
    }

    // 保存参与者数据
    onParticipantsChange(localParticipants)
    
    // 计算每个奖项对应的概率列表
    const newAwardProbabilities = {}
    awards.forEach(award => {
      const awardLevel = award.level !== undefined ? award.level : 0
      
      // 筛选等级大于等于奖项等级的参与者
      const eligibleParticipants = localParticipants.filter(p => 
        (p.level !== undefined ? p.level : 0) >= awardLevel
      )
      
      if (eligibleParticipants.length === 0) {
        newAwardProbabilities[award.id] = []
        return
      }
      
      // 计算概率：等级0和1用平均概率，等级>=2用权重
      let probabilities = []
      if (awardLevel <= 1) {
        // 平均概率
        const avgProb = 100 / eligibleParticipants.length
        probabilities = eligibleParticipants.map(p => ({
          name: p.name,
          probability: avgProb.toFixed(2)
        }))
      } else {
        // 使用权重计算
        const totalWeight = eligibleParticipants.reduce((sum, p) => sum + (p.weight || 0), 0)
        if (totalWeight > 0) {
          probabilities = eligibleParticipants.map(p => ({
            name: p.name,
            probability: ((p.weight || 0) / totalWeight * 100).toFixed(2)
          }))
        } else {
          // 如果总权重为0，使用平均概率
          const avgProb = 100 / eligibleParticipants.length
          probabilities = eligibleParticipants.map(p => ({
            name: p.name,
            probability: avgProb.toFixed(2)
          }))
        }
      }
      
      newAwardProbabilities[award.id] = probabilities
    })
    
    setAwardProbabilities(newAwardProbabilities)
    setIsCalculated(true)
    alert('保存并计算成功！')
  }

  const handleImport = () => {
    const input = document.createElement('input')
    input.type = 'file'
    input.accept = '.json'
    input.onchange = (e) => {
      const file = e.target.files[0]
      if (!file) return

      const reader = new FileReader()
      reader.onload = (event) => {
        try {
          const data = JSON.parse(event.target.result)
          
          // 验证数据格式
          if (!Array.isArray(data)) {
            alert('导入失败：文件格式不正确，应为JSON数组格式')
            return
          }

          // 验证每个对象是否有必要的字段
          const isValid = data.every(item => 
            item && 
            (typeof item.name === 'string' || item.name === '') &&
            (typeof item.weight === 'number' || typeof item.weight === 'string')
          )

          if (!isValid) {
            alert('导入失败：数据格式不正确，每个对象应包含 name 和 weight 字段')
            return
          }

          // 转换数据格式，添加id
          const importedParticipants = data.map((item, index) => ({
            id: Date.now() + index,
            name: item.name || '',
            weight: item.weight !== undefined ? parseFloat(item.weight) || 0 : 0,
            level: item.level !== undefined ? parseInt(item.level) || 0 : 0
          }))

          setLocalParticipants(importedParticipants)
          setIsCalculated(false)
          alert(`成功导入 ${importedParticipants.length} 条记录`)
        } catch (error) {
          alert('导入失败：' + error.message)
        }
      }
      reader.readAsText(file)
    }
    input.click()
  }

  return (
    <div className="participant-settings">
      <table className="participant-table">
        <thead>
          <tr>
            <th>姓名</th>
            <th>等级</th>
            <th>权重</th>
            <th>操作</th>
          </tr>
        </thead>
        <tbody>
          {localParticipants.map((participant, index) => (
            <tr key={participant.id}>
              <td>
                <input
                  type="text"
                  value={participant.name}
                  onChange={(e) => handleChange(participant.id, 'name', e.target.value)}
                  placeholder={`参与者${index + 1}`}
                  className="table-input"
                />
              </td>
              <td>
                <input
                  type="number"
                  value={participant.level !== undefined ? participant.level : 0}
                  onChange={(e) => handleChange(participant.id, 'level', e.target.value)}
                  min="0"
                  className="table-input"
                />
              </td>
              <td>
                <input
                  type="number"
                  value={participant.weight !== undefined ? participant.weight : 0}
                  onChange={(e) => handleChange(participant.id, 'weight', e.target.value)}
                  min="0"
                  step="0.1"
                  className="table-input"
                />
              </td>
              <td>
                {localParticipants.length > 1 && (
                  <button
                    className="delete-btn"
                    onClick={() => handleDeleteRow(participant.id)}
                  >
                    删除
                  </button>
                )}
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      <div className="participant-actions">
        <button className="import-btn" onClick={handleImport}>
          导入
        </button>
        <button className="add-btn" onClick={handleAddRow}>
          添加行
        </button>
        <button className="calculate-btn" onClick={handleCalculate}>
          保存计算
        </button>
      </div>
      
      {/* 各奖项对应的名单表格 */}
      {isCalculated && awards && awards.length > 0 && (
        <div className="award-probability-buttons" style={{ marginTop: '20px' }}>
          {awards.map(award => (
            <button
              key={award.id}
              className="award-probability-btn"
              onClick={() => setShowAwardProbabilities(prev => ({
                ...prev,
                [award.id]: !prev[award.id]
              }))}
              style={{
                margin: '5px',
                padding: '10px 20px',
                backgroundColor: showAwardProbabilities[award.id] ? '#1890ff' : '#f0f0f0',
                color: showAwardProbabilities[award.id] ? '#fff' : '#000',
                border: '1px solid #ddd',
                borderRadius: '4px',
                cursor: 'pointer',
                fontSize: '14px'
              }}
            >
              {award.name}
            </button>
          ))}
        </div>
      )}
      
      {/* 显示选中的奖项概率表格 */}
      {isCalculated && awards && awards.map(award => (
        showAwardProbabilities[award.id] && (
          <div key={award.id} className="award-probability-table-container" style={{ marginTop: '20px' }}>
            <h3 style={{ marginBottom: '10px' }}>{award.name} - 参与人员名单</h3>
            <table className="participant-table">
              <thead>
                <tr>
                  <th>姓名</th>
                  <th>最终概率</th>
                </tr>
              </thead>
              <tbody>
                {awardProbabilities[award.id] && awardProbabilities[award.id].length > 0 ? (
                  awardProbabilities[award.id].map((item, index) => (
                    <tr key={index}>
                      <td>{item.name}</td>
                      <td>{item.probability}%</td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan="2" style={{ textAlign: 'center', color: '#999' }}>
                      暂无符合条件的人员
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        )
      ))}
    </div>
  )
}

export default ParticipantSettings

