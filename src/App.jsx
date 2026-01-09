import { useState } from 'react'
// import reactLogo from './assets/react.svg'
// import viteLogo from '/vite.svg'
// import './App.css'
import "katex/dist/katex.min.css"
import Home from './pages/layoutPage'
import Header from './globalComponents/Header'

function App() {
  const [count, setCount] = useState(0)

  return (

    <div className='min-h-screen'>
      <Header />
      <Home />
    </div>

  )
}

export default App
