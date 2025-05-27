import { Routes, Route, Navigate } from 'react-router-dom'
import LoginPage from './pages/LoginPage'
import RegisterPage from './pages/RegisterPage'
import ProtectedRoute from "./components/ProtectedRoute";
import HomePage from './pages/HomePage'
import MyFindingsPage from "./pages/MyFindingsPage";
import MyLostItemsPage from "./pages/MyLostItemsPage";
import ItemHistoryPage from './pages/ItemHistory';
import SubmitReportPage from './pages/SubmitReportPage'

function App() {
  return (
    <Routes>

      {/* Public routes */}
      <Route path="/" element={<Navigate to="/login" />} />
      <Route path="/login" element={<LoginPage />} />
      <Route path="/register" element={<RegisterPage />} />

      {/* Protected routes */}
      <Route path="/home" element={
        <ProtectedRoute>
          <HomePage />
        </ProtectedRoute>}
      />

      <Route path="/my-lost-items" element={
        <ProtectedRoute>
          <MyLostItemsPage />
        </ProtectedRoute>}
      />

      <Route path="/item-history/:itemId" element={
        <ProtectedRoute>
          <ItemHistoryPage />
        </ProtectedRoute>}
      />

      <Route path="/my-findings" element={
        <ProtectedRoute>
          <MyFindingsPage />
        </ProtectedRoute>}
      />

      <Route path="/submitreport/:coordinates" element={
        <ProtectedRoute>
          <SubmitReportPage />
        </ProtectedRoute>}
      />
      
    </Routes>
  )
}

export default App
