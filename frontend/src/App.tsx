import { Routes, Route, Navigate } from 'react-router-dom'
import LoginPage from './pages/LoginPage'
import RegisterPage from './pages/RegisterPage'
import HomePage from './pages/HomePage'
import MyFindingsPage from "./pages/MyFindingsPage";
import MyLostItemsPage from "./pages/MyLostItemsPage";
import ItemHistoryPage from './pages/ItemHistory';
import SubmitReportPage from './pages/SubmitReportPage'

function App() {
  return (
    <Routes>
      <Route path="/" element={<Navigate to="/login" />} />
      <Route path="/login" element={<LoginPage />} />
      <Route path="/register" element={<RegisterPage />} />
      <Route path="/home" element={<HomePage />} />
      <Route path="/my-lost-items" element={<MyLostItemsPage />} />
      <Route path="/item-history/:username/:itemname" element={<ItemHistoryPage />} />
      <Route path="/my-findings" element={<MyFindingsPage />} />
      <Route path="/submitreport/:coordinates" element={<SubmitReportPage />} />
    </Routes>
  )
}

export default App
