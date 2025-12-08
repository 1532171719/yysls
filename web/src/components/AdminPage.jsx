import React, { useState } from 'react'
import ParticipantSettings from './ParticipantSettings'
import AwardSettings from './AwardSettings'
import BackgroundSettings from './BackgroundSettings'
import TitleSettings from './TitleSettings'
import LayoutSettings from './LayoutSettings'
import './AdminPage.css'

function AdminPage({
  participants,
  awards,
  backgroundImage,
  backgroundOpacity,
  titleStyle,
          wheelPosition,
          wheelSize,
          awardListPosition,
          awardListSize,
          onParticipantsChange,
          onAwardsChange,
          onBackgroundImageChange,
          onBackgroundOpacityChange,
          onTitleStyleChange,
          onWheelPositionChange,
          onWheelSizeChange,
          onAwardListPositionChange,
          onAwardListSizeChange,
          onBack
}) {
  const [activeTab, setActiveTab] = useState('awards')

  return (
    <div className="admin-page">
      <div className="admin-header">
        <button className="back-btn" onClick={onBack}>反</button>
        <div className="header-actions">
          <button className="action-btn share-btn">分享</button>
          <button className="action-btn edit-btn">编辑</button>
          <button className="icon-btn">🔍</button>
        </div>
      </div>

      <div className="admin-tabs">
        <button
          className={`tab-btn ${activeTab === 'participants' ? 'active' : ''}`}
          onClick={() => setActiveTab('participants')}
        >
          名单设置
        </button>
        <button
          className={`tab-btn ${activeTab === 'awards' ? 'active' : ''}`}
          onClick={() => setActiveTab('awards')}
        >
          奖项设置
        </button>
        <button
          className={`tab-btn ${activeTab === 'background' ? 'active' : ''}`}
          onClick={() => setActiveTab('background')}
        >
          背景设置
        </button>
        <button
          className={`tab-btn ${activeTab === 'title' ? 'active' : ''}`}
          onClick={() => setActiveTab('title')}
        >
          标题设置
        </button>
        <button
          className={`tab-btn ${activeTab === 'layout' ? 'active' : ''}`}
          onClick={() => setActiveTab('layout')}
        >
          布局设置
        </button>
      </div>

      <div className="admin-content">
        {activeTab === 'participants' ? (
          <ParticipantSettings
            participants={participants}
            awards={awards}
            onParticipantsChange={onParticipantsChange}
          />
        ) : activeTab === 'awards' ? (
          <AwardSettings
            awards={awards}
            onAwardsChange={onAwardsChange}
          />
        ) : activeTab === 'background' ? (
          <BackgroundSettings
            backgroundImage={backgroundImage}
            backgroundOpacity={backgroundOpacity}
            onBackgroundImageChange={onBackgroundImageChange}
            onBackgroundOpacityChange={onBackgroundOpacityChange}
          />
        ) : activeTab === 'title' ? (
          <TitleSettings
            titleStyle={titleStyle}
            onTitleStyleChange={onTitleStyleChange}
          />
        ) : (
          <LayoutSettings
            wheelPosition={wheelPosition}
            wheelSize={wheelSize}
            awardListPosition={awardListPosition}
            awardListSize={awardListSize}
            onWheelPositionChange={onWheelPositionChange}
            onWheelSizeChange={onWheelSizeChange}
            onAwardListPositionChange={onAwardListPositionChange}
            onAwardListSizeChange={onAwardListSizeChange}
          />
        )}
      </div>
    </div>
  )
}

export default AdminPage

