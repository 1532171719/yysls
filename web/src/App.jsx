import React, { useState, useEffect } from 'react'
import HomePage from './components/HomePage'
import AdminPage from './components/AdminPage'
import PasswordModal from './components/PasswordModal'
import { saveData, loadData } from './utils/storage'
import './App.css'

function App() {
  const [currentPage, setCurrentPage] = useState('home')
  const [participants, setParticipants] = useState([])
  const [awards, setAwards] = useState([])
  const [awardRules, setAwardRules] = useState({}) // { awardId: 'rule1' | 'rule2' }
  const [backgroundImage, setBackgroundImage] = useState('')
  const [backgroundOpacity, setBackgroundOpacity] = useState(0.5)
  const [titleStyle, setTitleStyle] = useState({
    fontSize: 36,
    color: '#1890ff',
    fontWeight: 'bold',
    fontFamily: 'Arial',
    textShadow: '2px 2px 4px rgba(0, 0, 0, 0.1)',
    letterSpacing: 2
  })
  const [wheelPosition, setWheelPosition] = useState({ x: 20, y: 80 })
  const [wheelSize, setWheelSize] = useState({ width: 400, height: 400 })
  const [awardListPosition, setAwardListPosition] = useState({ x: 20, y: 20 })
  const [awardListSize, setAwardListSize] = useState({ width: 120, height: 160 })
  const [winnerMessagePosition, setWinnerMessagePosition] = useState({ x: 100, y: 100 })
  const [winnerMessageSize, setWinnerMessageSize] = useState({ width: 300, height: 80 })
  const [showPasswordModal, setShowPasswordModal] = useState(false)

  // 加载保存的数据
  useEffect(() => {
    const savedData = loadData()
    if (savedData) {
      if (savedData.participants) setParticipants(savedData.participants)
      if (savedData.awards) setAwards(savedData.awards)
      if (savedData.awardRules) setAwardRules(savedData.awardRules)
      if (savedData.backgroundImage !== undefined) setBackgroundImage(savedData.backgroundImage)
      if (savedData.backgroundOpacity !== undefined) setBackgroundOpacity(savedData.backgroundOpacity)
      if (savedData.titleStyle) setTitleStyle(savedData.titleStyle)
      if (savedData.wheelPosition) setWheelPosition(savedData.wheelPosition)
      if (savedData.wheelSize) setWheelSize(savedData.wheelSize)
      if (savedData.awardListPosition) setAwardListPosition(savedData.awardListPosition)
      if (savedData.awardListSize) setAwardListSize(savedData.awardListSize)
      if (savedData.winnerMessagePosition) setWinnerMessagePosition(savedData.winnerMessagePosition)
      if (savedData.winnerMessageSize) setWinnerMessageSize(savedData.winnerMessageSize)
    }
  }, [])

  // 保存数据
  useEffect(() => {
    const data = {
      participants,
      awards,
      awardRules,
      backgroundImage,
      backgroundOpacity,
      titleStyle,
      wheelPosition,
      wheelSize,
      awardListPosition,
      awardListSize,
      winnerMessagePosition,
      winnerMessageSize
    }
    saveData(data)
  }, [participants, awards, awardRules, backgroundImage, backgroundOpacity, titleStyle, wheelPosition, wheelSize, awardListPosition, awardListSize, winnerMessagePosition, winnerMessageSize])

  const handleGoToAdmin = () => {
    setShowPasswordModal(true)
  }

  const handlePasswordSubmit = (password) => {
    if (password === '1') {
      setShowPasswordModal(false)
      setCurrentPage('admin')
    } else {
      alert('密码错误！')
    }
  }

  return (
    <div className="app">
      {currentPage === 'home' ? (
        <HomePage
          participants={participants}
          awards={awards}
          awardRules={awardRules}
          backgroundImage={backgroundImage}
          backgroundOpacity={backgroundOpacity}
          titleStyle={titleStyle}
          wheelPosition={wheelPosition}
          wheelSize={wheelSize}
          awardListPosition={awardListPosition}
          awardListSize={awardListSize}
          winnerMessagePosition={winnerMessagePosition}
          winnerMessageSize={winnerMessageSize}
          onWinnerMessagePositionChange={setWinnerMessagePosition}
          onWinnerMessageSizeChange={setWinnerMessageSize}
          onGoToAdmin={handleGoToAdmin}
        />
      ) : (
        <AdminPage
          participants={participants}
          awards={awards}
          awardRules={awardRules}
          backgroundImage={backgroundImage}
          backgroundOpacity={backgroundOpacity}
          titleStyle={titleStyle}
          wheelPosition={wheelPosition}
          wheelSize={wheelSize}
          awardListPosition={awardListPosition}
          awardListSize={awardListSize}
          onParticipantsChange={setParticipants}
          onAwardsChange={setAwards}
          onAwardRulesChange={setAwardRules}
          onBackgroundImageChange={setBackgroundImage}
          onBackgroundOpacityChange={setBackgroundOpacity}
          onTitleStyleChange={setTitleStyle}
          onWheelPositionChange={setWheelPosition}
          onWheelSizeChange={setWheelSize}
          onAwardListPositionChange={setAwardListPosition}
          onAwardListSizeChange={setAwardListSize}
          onBack={() => setCurrentPage('home')}
        />
      )}
      
      {showPasswordModal && (
        <PasswordModal
          onClose={() => setShowPasswordModal(false)}
          onSubmit={handlePasswordSubmit}
        />
      )}
    </div>
  )
}

export default App

