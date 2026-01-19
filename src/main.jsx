/*
  main.jsx
  - Application entry point.
  - Mounts the React tree into `#root` and wraps the app with the Redux `Provider`.
*/
import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import { Provider } from "react-redux";
import store from "./redux/store/store.js";
import App from './App.jsx'

createRoot(document.getElementById('root')).render(
  // Keep StrictMode commented for easier HMR during development
  // <StrictMode>
  <Provider store={store}>
    <App />
    </Provider>
  // </StrictMode>,
)
