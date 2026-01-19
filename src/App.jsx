/*
  App.jsx
  - Root React component for the Frontend app.
  - Renders the global `Header` and the page `Home` (layoutPage).
  - Minimal wrapper; keeps global dependencies (styles, providers) outside.
*/
import { useState } from 'react'
// import reactLogo from './assets/react.svg'
// import viteLogo from '/vite.svg'
// import './App.css'
import "katex/dist/katex.min.css"
import Home from './pages/layoutPage'
import Header from './globalComponents/Header'

function App() {
  // Local state legacy placeholder used during development
  const [count, setCount] = useState(0)

  return (
    <div className='min-h-screen'>
      {/* Global header / navigation */}
      <Header />
      {/* Main page layout (tabs + content) */}
      <Home />
    </div>
  )
}

export default App
