import { BrowserRouter, Navigate, Route, Routes } from 'react-router'
import './App.css'
import Login from './pages/Login'
import Register from './pages/Register'
import Meetings from './pages/Meetings'
import Meeting from './pages/Meeting'
import ProtectedRoute from './components/ProtectedRoute'

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route 
          path="/login"
          element={<Login />}
        />
        <Route 
          path="/register"
          element={<Register />}
        />
        <Route 
          path="/meetings"
          element={
            <ProtectedRoute>
                <Meetings />
            </ProtectedRoute>
          }
        />
        <Route
          path="/meetings/:id"
          element={
            <ProtectedRoute>
              <Meeting />
            </ProtectedRoute>
          }
        />
        <Route
          path="/"
          element={
            <Navigate 
              to="/meetings"
              replace
            />
          }
        />
        <Route
          path="*"
          element={
              <Navigate
                  to="/meetings"
                  replace
              />
          }
        />
      </Routes>
    </BrowserRouter>
  );
}
