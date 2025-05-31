import { useGeographic } from "ol/proj";
import { register } from "ol/proj/proj4";
import proj4 from "proj4";
import { Routes, Route, Navigate } from "react-router-dom";
import LoginPage from "./pages/LoginPage";
import RegisterPage from "./pages/RegisterPage";
import ProtectedRoute from "./components/ProtectedRoute";
import HomePage from "./pages/HomePage";
import MyFindingsPage from "./pages/MyFindingsPage";
import MyLostItemsPage from "./pages/MyLostItemsPage";
import ItemHistoryPage from "./pages/ItemHistory";
import SubmitReportPage from "./pages/SubmitReportPage";
import FoundReportPage from "./pages/FoundReportPage";
import { getToken, onMessage } from "firebase/messaging";
import { messaging } from "./firebase/firebaseConfig";
import { useEffect } from "react";
import { toast, ToastContainer } from "react-toastify";
import Message from "./components/Message.tsx";
import "react-toastify/dist/ReactToastify.css";

function App() {
  useGeographic();
  proj4.defs(
    "EPSG:32634",
    "+proj=utm +zone=34 +datum=WGS84 +units=m +no_defs +type=crs"
  );
  proj4.defs(
    "EPSG:32635",
    "+proj=utm +zone=35 +datum=WGS84 +units=m +no_defs +type=crs"
  );
  register(proj4);

  useEffect(() => {
    const requestPermission = async () => {
      const permission = await Notification.requestPermission();

      if (permission === "granted") {
        const fcmToken = await getToken(messaging, {
          vapidKey:
            "BNOmGQNdCgZsbwv1sf_2DndWbPNPPP3sMsIoL075xRPcX_YYv7eky0n0fDdTETPmYfauY9QG0WIqw-nzyzMpk7M",
        });
        localStorage.setItem("fcmToken", fcmToken);
      } else if (permission === "denied") {
        alert("Please allow notification permission.");
      }
    };

    requestPermission();
  }, []);

  onMessage(messaging, (payload) => {
    toast(<Message notification={payload.notification} />);
  });

  return (
    <>
      <ToastContainer />
      <Routes>
        {/* Public routes */}
        <Route path="/" element={<Navigate to="/login" />} />
        <Route path="/login" element={<LoginPage />} />
        <Route path="/register" element={<RegisterPage />} />

        {/* Protected routes */}
        <Route path="/home" element={<HomePage />} />

        <Route
          path="/my-lost-items"
          element={
            <ProtectedRoute>
              <MyLostItemsPage />
            </ProtectedRoute>
          }
        />

        <Route
          path="/item-history/:itemId"
          element={
            <ProtectedRoute>
              <ItemHistoryPage />
            </ProtectedRoute>
          }
        />

        <Route
          path="/my-findings"
          element={
            <ProtectedRoute>
              <MyFindingsPage />
            </ProtectedRoute>
          }
        />

        <Route
          path="/submit-report/:coordinates"
          element={
            <ProtectedRoute>
              <SubmitReportPage />
            </ProtectedRoute>
          }
        />

        <Route
          path="/found-report/:itemId"
          element={
            <ProtectedRoute>
              <FoundReportPage />
            </ProtectedRoute>
          }
        />
      </Routes>
    </>
  );
}

export default App;
