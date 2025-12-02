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

