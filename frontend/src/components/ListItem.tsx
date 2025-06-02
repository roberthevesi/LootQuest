import { History, Trash2 } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { FindingItem, LostItem } from "../types";
import { useState } from "react";
import "../styles/listitem.css";

interface ListItemProps {
  item: FindingItem | LostItem;
  type: "findings" | "lost";
  onEngagementHistory?: (id: number, title: string) => void;
  onDelete?: (id: number) => void;
  currentUsername?: string; // Add this prop to know the current user
}

export default function ListItem({
  item,
  type,
  onEngagementHistory,
  onDelete,
  currentUsername,
}: ListItemProps) {
  const navigate = useNavigate();
  const closeFullscreen = () => setFullscreenImage(null);
  const [fullscreenImage, setFullscreenImage] = useState<string | null>(null);
  const openFullscreen = (photoUrl: string) => setFullscreenImage(photoUrl);

  const handleEngagementHistory = (): void => {
    // Navigate to the item history page with username and itemname
    const username = currentUsername || "unknown"; // Use current user or fallback
    const itemname = item.title.toLowerCase().replace(/\s+/g, "-"); // Convert to URL-friendly format

    navigate(`/item-history/${username}/${itemname}`);

    // Also call the original callback if provided
    if (onEngagementHistory) {
      onEngagementHistory(item.id, item.title);
    }
  };

  return (
    <div className="list-item">
      <div className="list-item-header">
        <div className="list-item-content">
          <h3 className="list-item-title">{item.title}</h3>

          {type === "findings" && "photoUrl" in item && item.photoUrl && (
            <div className="list-item-photo-wrapper">
              <img
                src={item.photoUrl}
                alt={`Photo for finding ${item.id}`}
                onError={(e) => {
                  const target = e.target as HTMLImageElement;
                  target.src = `https://via.placeholder.com/50x50?text=No+Image`;
                }}
                style={{
                  width: "50px",
                  height: "50px",
                  objectFit: "cover",
                  cursor: "pointer",
                  borderRadius: "4px",
                }}
                onClick={() => openFullscreen(item.photoUrl)}
              />
            </div>
          )}

          <p className="list-item-text">
            <span className="list-item-label">Location:</span>{" "}
            {`${item.latitude}, ${item.longitude}`}
          </p>
          {type === "findings" && "owner" in item && (
            <p className="list-item-text no-margin">
              <span className="list-item-label">Owner:</span> {item.owner}
            </p>
          )}
        </div>

        {type === "lost" && (
          <div className="list-item-actions">
            <button
              onClick={handleEngagementHistory}
              className="list-item-button history"
            >
              <History size={12} />
              History
            </button>
            <button
              onClick={() => onDelete?.(item.id)}
              className="list-item-button delete"
            >
              <Trash2 size={12} />
              Delete
            </button>
          </div>
        )}

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
              cursor: "zoom-out",
              zIndex: 9999,
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
    </div>
  );
}
