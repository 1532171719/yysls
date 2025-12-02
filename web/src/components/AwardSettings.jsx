import React, { useState, useEffect } from 'react'
import './AwardSettings.css'

function AwardSettings({ awards, awardRules, onAwardsChange, onAwardRulesChange }) {
  const [localAwards, setLocalAwards] = useState(
    awards.length > 0 ? awards : [{ id: Date.now(), name: '', quantity: 1, rule: 'rule1', image: '/素材库/奖项1.png' }]
  )

  useEffect(() => {
    if (awards.length > 0) {
      setLocalAwards(awards.map(a => ({
        ...a,
        image: a.image || '/素材库/奖项1.png'
      })))
    }
  }, [awards])

  const handleAddRow = () => {
    setLocalAwards([
      ...localAwards,
      { id: Date.now(), name: '', quantity: 1, rule: 'rule1', image: '/素材库/奖项1.png' }
    ])
  }

  const handleDeleteRow = (id) => {
    if (localAwards.length > 1) {
      const newAwards = localAwards.filter(a => a.id !== id)
      setLocalAwards(newAwards)
      onAwardsChange(newAwards)
      
      // 同时删除对应的规则
      const newRules = { ...awardRules }
      delete newRules[id]
      onAwardRulesChange(newRules)
    }
  }

  const handleChange = (id, field, value) => {
    const newAwards = localAwards.map(a => {
      if (a.id === id) {
        return { ...a, [field]: field === 'quantity' ? parseInt(value) || 1 : value }
      }
      return a
    })
    setLocalAwards(newAwards)
  }

  const handleRuleChange = (id, rule) => {
    const newRules = { ...awardRules, [id]: rule }
    onAwardRulesChange(newRules)
  }

  const handleSave = () => {
    // 验证所有奖项名称和数量都已填写
    const hasEmptyFields = localAwards.some(a => !a.name || !a.quantity || a.quantity < 1)
    if (hasEmptyFields) {
      alert('请填写所有奖项的名称和数量（数量必须大于0）！')
      return
    }

    onAwardsChange(localAwards)
    alert('保存成功！')
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
            (typeof item.quantity === 'number' || typeof item.quantity === 'string')
          )

          if (!isValid) {
            alert('导入失败：数据格式不正确，每个对象应包含 name 和 quantity 字段')
            return
          }

          // 转换数据格式，添加id和默认值
          const importedAwards = data.map((item, index) => ({
            id: Date.now() + index,
            name: item.name || '',
            quantity: parseInt(item.quantity) || 1,
            rule: item.rule || 'rule1',
            image: item.image || '/素材库/奖项1.png'
          }))

          // 导入规则
          const importedRules = {}
          importedAwards.forEach((award, index) => {
            if (data[index] && data[index].rule) {
              importedRules[award.id] = data[index].rule
            }
          })

          setLocalAwards(importedAwards)
          onAwardsChange(importedAwards)
          onAwardRulesChange(importedRules)
          alert(`成功导入 ${importedAwards.length} 条记录`)
        } catch (error) {
          alert('导入失败：' + error.message)
        }
      }
      reader.readAsText(file)
    }
    input.click()
  }

  return (
    <div className="award-settings">
      <table className="award-table">
        <thead>
          <tr>
            <th>奖项名</th>
            <th>奖项数量</th>
            <th>奖项规则</th>
            <th>奖项图片</th>
            <th>操作</th>
          </tr>
        </thead>
        <tbody>
          {localAwards.map((award, index) => (
            <tr key={award.id}>
              <td>
                <input
                  type="text"
                  value={award.name}
                  onChange={(e) => handleChange(award.id, 'name', e.target.value)}
                  placeholder={`奖项${index + 1}`}
                  className="table-input"
                />
              </td>
              <td>
                <input
                  type="number"
                  value={award.quantity}
                  onChange={(e) => handleChange(award.id, 'quantity', e.target.value)}
                  min="1"
                  className="table-input"
                />
              </td>
              <td>
                <select
                  value={awardRules[award.id] || 'rule1'}
                  onChange={(e) => handleRuleChange(award.id, e.target.value)}
                  className="rule-select"
                >
                  <option value="rule1">规则1：抽中不再中</option>
                  <option value="rule2">规则2：在规则1的基础上，其他属于规则2的也不能再抽中</option>
                </select>
              </td>
              <td>
                <div className="image-select-container">
                  <input
                    type="text"
                    value={award.image || '/素材库/奖项1.png'}
                    onChange={(e) => handleChange(award.id, 'image', e.target.value)}
                    placeholder="/素材库/奖项1.png"
                    className="table-input image-input"
                  />
                  <div className="image-preview">
                    <img
                      src={award.image || '/素材库/奖项1.png'}
                      alt="预览"
                      className="preview-img"
                      onError={(e) => {
                        e.target.src = '/素材库/奖项1.png'
                      }}
                    />
                  </div>
                </div>
              </td>
              <td>
                {localAwards.length > 1 && (
                  <button
                    className="delete-btn"
                    onClick={() => handleDeleteRow(award.id)}
                  >
                    删除
                  </button>
                )}
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      <div className="award-actions">
        <button className="import-btn" onClick={handleImport}>
          导入
        </button>
        <button className="add-btn" onClick={handleAddRow}>
          添加奖项
        </button>
        <button className="save-btn" onClick={handleSave}>
          保存
        </button>
      </div>
    </div>
  )
}

export default AwardSettings

