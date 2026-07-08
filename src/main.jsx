import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App.jsx'
import './index.css'

// রুট কন্টেইনারের সাথে রিঅ্যাক্ট ডমকে সংযুক্ত করা হচ্ছে
ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>,
)
