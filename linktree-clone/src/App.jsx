import React from 'react'
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom'
import PublicView from './pages/PublicView'
import AdminLogin from './pages/AdminLogin'
import AdminDashboard from './pages/AdminDashboard'

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/:username" element={<PublicView />} />
        <Route path="/:username/admin" element={<AdminLogin />} />
        <Route path="/:username/admin/dashboard" element={<AdminDashboard />} />
        <Route path="/" element={<Navigate to="/demo" replace />} />
      </Routes>
    </BrowserRouter>
  )
}

export default App
