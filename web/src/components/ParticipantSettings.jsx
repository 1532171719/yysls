import React, { useState, useEffect } from 'react'
import './ParticipantSettings.css'

function ParticipantSettings({ participants, onParticipantsChange }) {
  const [localParticipants, setLocalParticipants] = useState(
    participants.length > 0 ? participants : [{ id: Date.now(), name: '', weight: 1, probability: 0 }]
  )
  const [isCalculated, setIsCalculated] = useState(false)

  useEffect(() => {
    if (participants.length > 0) {
      setLocalParticipants(participants)
      setIsCalculated(participants.some(p => p.probability !== undefined && p.probability !== 0))
    }
  }, [participants])

  const handleAddRow = () => {
    setLocalParticipants([
      ...localParticipants,
      { id: Date.now(), name: '', weight: 1, probability: 0 }
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
        return { ...p, [field]: field === 'weight' ? parseFloat(value) || 1 : value }
      }
      return p
    })
    
    setLocalParticipants(updatedParticipants)
    setIsCalculated(false)
  }

  const handleCalculate = () => {
    // 验证所有姓名和权重都已填写
    const hasEmptyFields = localParticipants.some(p => !p.name || !p.weight)
    if (hasEmptyFields) {
      alert('请填写所有参与者的姓名和权重！')
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

    // 计算总权重
    const totalWeight = localParticipants.reduce((sum, p) => sum + (p.weight || 1), 0)

    // 归一化计算概率
    const calculatedParticipants = localParticipants.map(p => ({
      ...p,
      probability: totalWeight > 0 ? ((p.weight || 1) / totalWeight * 100).toFixed(2) : 0
    }))

    setLocalParticipants(calculatedParticipants)
    setIsCalculated(true)
    onParticipantsChange(calculatedParticipants)
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
            weight: parseFloat(item.weight) || 1,
            probability: 0
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
            <th>权重(以1为基准)</th>
            <th>最终概率</th>
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
                  value={participant.weight}
                  onChange={(e) => handleChange(participant.id, 'weight', e.target.value)}
                  min="0"
                  step="0.1"
                  className="table-input"
                />
              </td>
              <td>
                {isCalculated ? `${participant.probability}%` : '-'}
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
          确定人选,开始计算
        </button>
      </div>
    </div>
  )
}

export default ParticipantSettings

