// 数据存储工具类
const STORAGE_KEY = 'lottery_data'

export const saveData = (data) => {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(data))
    return true
  } catch (error) {
    console.error('保存数据失败:', error)
    return false
  }
}

export const loadData = () => {
  try {
    const data = localStorage.getItem(STORAGE_KEY)
    if (data) {
      return JSON.parse(data)
    }
    return null
  } catch (error) {
    console.error('加载数据失败:', error)
    return null
  }
}

export const clearData = () => {
  try {
    localStorage.removeItem(STORAGE_KEY)
    return true
  } catch (error) {
    console.error('清除数据失败:', error)
    return false
  }
}

