import { useEffect, useState } from 'react'
import { Routes, Route } from 'react-router-dom'
import Home from './components/Home'
import Calendar from './components/Calendar'
import Play from './components/Play'

function App() {
  const [darkMode, setDarkMode] = useState(() => {
    return localStorage.getItem('theme') === 'dark'
  })

  useEffect(() => {
    console.log('DarkMode changed:', darkMode)
    const root = document.documentElement
    if (darkMode) {
      root.classList.add('dark')
      localStorage.setItem('theme', 'dark')
    } else {
      root.classList.remove('dark')
      localStorage.setItem('theme', 'light')
    }
  }, [darkMode]) // ✅ this MUST be watching [darkMode]

  return (
    <Routes>
      <Route path="/" element={<Home darkMode={darkMode} setDarkMode={setDarkMode} />} />
      <Route path="/calendar" element={<Calendar darkMode={darkMode} setDarkMode={setDarkMode} />} />

      <Route path="/play" element={<Play darkMode={darkMode} setDarkMode={setDarkMode}/>} />
    </Routes>
  )
}

export default App
