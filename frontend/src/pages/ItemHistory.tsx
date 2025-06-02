import { useParams, useNavigate, useLocation } from "react-router-dom";
import { useState, useEffect } from "react";
import "../styles/itemhistory.css";

interface EngagementItem {
  id: number;
  foundByUserId: number;
  photoUrl: string;
  latitude: number;
  longitude: number;
  createdAtDateTime: string;
}

export default function ItemHistoryPage() {
  const { itemId } = useParams<{ itemId: string }>();
  const [loading, setLoading] = useState<boolean>(true);
  const [_, setError] = useState<string | null>(null);
  const [fullscreenImage, setFullscreenImage] = useState<string | null>(null);
  const openFullscreen = (photoUrl: string) => setFullscreenImage(photoUrl);
  const closeFullscreen = () => setFullscreenImage(null);
  const navigate = useNavigate();
  const location = useLocation();
  const itemTitle = (location.state as { itemName?: string })?.itemName;
  const [engagementHistory, setEngagementHistory] = useState<EngagementItem[]>(
    []
  );

  useEffect(() => {
    const fetchEngagementHistory = async () => {
      const token = localStorage.getItem("token");

      if (!token) {
        setError("User not authenticated.");
        setLoading(false);
        return;
      }

      try {
        const response = await fetch(
          `${
            import.meta.env.VITE_BACKEND_URL
          }/items/get-findings-by-lost-item-id?lostItemId=${itemId}`,
          {
            method: "GET",
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );

        if (!response.ok) {
          throw new Error("Failed to fetch engagement history");
        }

        const data = await response.json();
        setEngagementHistory(data);
      } catch (error) {
        console.error("Error fetching engagement history:", error);
        setEngagementHistory([]);
      } finally {
        setLoading(false);
      }
    };

    fetchEngagementHistory();
  }, [itemId]);

  const handleBack = () => {
    navigate("/my-lost-items");
  };

  return (
    <div className="itemhistory-page">
      <div className="iteminfo-container">
        <h2>Item History</h2>
        <p>
          <strong>Item ID:</strong> {itemId}
        </p>
        <p>
          <strong>Name:</strong> {itemTitle ?? "Unknown"}
        </p>
      </div>

      <div className="engagement-history-header">
        <h2>Engagement ({engagementHistory.length})</h2>
      </div>

      <div className="engagement-history">
        {loading ? (
          <div className="loading-message">Loading engagement history...</div>
        ) : engagementHistory.length > 0 ? (
          engagementHistory.map((engagement) => (
            <div key={engagement.id} className="engagement-item">
              <div className="engagement-photo">
                <img
                  src={engagement.photoUrl}
                  alt={`Photo by user ${engagement.foundByUserId}`}
                  onError={(e) => {
                    const target = e.target as HTMLImageElement;
                    target.src = `https://via.placeholder.com/50x50?text=U${engagement.foundByUserId}`;
                  }}
                  style={{ cursor: "pointer" }}
                  onClick={() => openFullscreen(engagement.photoUrl)}
                />
              </div>
              <div className="engagement-info">
                <h4 className="engagement-username">
                  User ID: {engagement.foundByUserId}
                </h4>
                <p className="engagement-location">
                  Location: {engagement.latitude.toFixed(4)},{" "}
                  {engagement.longitude.toFixed(4)}
                </p>
                <p
                  className="engagement-date"
                  style={{
                    color: "#5a0303",
                    fontWeight: "bold",
                    fontSize: "14px",
                  }}
                >
                  Found at:{" "}
                  {new Date(engagement.createdAtDateTime).toLocaleString()}
                </p>
              </div>
            </div>
          ))
        ) : (
          <div className="no-engagement-message">
            No one has marked this item as found yet.
          </div>
        )}
      </div>

      <button className="back-btn" onClick={handleBack}>
        Back
      </button>

      {fullscreenImage && (
        <div
          className="fullscreen-overlay"
          onClick={closeFullscreen}
          style={{
            position: "fixed",
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            backgroundColor: "rgba(0,0,0,0.8)",
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            zIndex: 9999,
            cursor: "pointer",
          }}
        >
          <img
            src={fullscreenImage}
            alt="Fullscreen view"
            style={{ maxWidth: "90%", maxHeight: "90%", cursor: "auto" }}
            onClick={(e) => e.stopPropagation()}
          />
          <button
            onClick={closeFullscreen}
            style={{
              position: "absolute",
              top: 20,
              right: 5,
              fontSize: 30,
              background: "none",
              border: "none",
              color: "white",
              cursor: "pointer",
            }}
            aria-label="Close fullscreen"
          >
            &times;
          </button>
        </div>
      )}
    </div>
  );
}
