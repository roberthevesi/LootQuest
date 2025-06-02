import { useNavigate } from "react-router-dom";
import { X, FileText, MapPin } from "lucide-react";
import "../styles/mapreportpanel.css";
import { NearbyLostItem } from "../types";

interface MapReportPanelProps {
  item: NearbyLostItem;
  onClose: () => void;
}

export default function MapReportPanel({ item, onClose }: MapReportPanelProps) {
  const navigate = useNavigate();

  const handleReportFound = () => {
    navigate(`/found-report/${item.id}`, { state: { item } });
  };

  const handleImageError = (e: React.SyntheticEvent<HTMLImageElement>) => {
    e.currentTarget.style.display = "none";
  };

  return (
    <div className="popup-overlay" onClick={onClose}>
      <div className="popup-container" onClick={(e) => e.stopPropagation()}>
        <div className="popup-header">
          <h3 className="popup-title">Lost Item Details</h3>
          <button
            onClick={onClose}
            className="close-button"
            aria-label="Close popup"
          >
            <X className="close-icon" />
          </button>
        </div>

        <div className="popup-content">
          <div className="item-name-section">
            <h4 className="item-name">{item.title}</h4>
          </div>

          {item.photoUrl && (
            <div className="photo-section">
              <img
                src={item.photoUrl}
                alt={item.title}
                className="item-photo"
                onError={handleImageError}
              />
            </div>
          )}

          <div className="description-section">
            <div className="description-row">
              <FileText className="info-icon description-icon" />
              <div className="description-content">
                <span className="info-label">Description:</span>
                <p className="description-text">{item.description}</p>
              </div>
            </div>
          </div>

          <div className="location-section">
            <div className="info-row">
              <MapPin className="info-icon location-icon" />
              <span className="info-label">Location:</span>
              <span className="info-value">{`${item.latitude}, ${item.longitude}`}</span>
            </div>
          </div>
        </div>

        <div className="popup-footer">
          <button onClick={handleReportFound} className="report-found-button">
            Report Found
          </button>
        </div>
      </div>
    </div>
  );
}
