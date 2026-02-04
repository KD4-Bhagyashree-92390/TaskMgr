import { useState } from 'react'
import Login from './pages/Login';
import Register from './pages/Register';
import { Routes, Route, Navigate } from "react-router";
import Tasks from './pages/Tasks';
import ProtectedRoute from './routes/ProtectedRoute';


function App() {
  const [] = useState(0)

  return (
    <Routes>
      <Route path="/" element={<Navigate to="/login" />} />
      <Route path="/login" element={<Login />} />
      <Route path="/register" element={<Register />} />
      <Route path="/tasks"
        element={
          <ProtectedRoute>
            <Tasks />
          </ProtectedRoute>


        } />
    </Routes>
  )
}

export default App
