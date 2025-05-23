import { X, Phone, User, FileText, MapPin } from 'lucide-react';
import '../styles/mapreportpanel.css';

interface LostItem {
  id: number;
  name: string;
  reporter: string;
  phone: string;
  description: string;
  photo?: string | null;
  latitude: number;
  longitude: number;
  location: string;
}

interface ItemDetailsPopupProps {
  item: LostItem;
  onClose: () => void;
  onReportFound: (item: LostItem) => void;
}

export default function MapReportPanel({ 
  item, 
  onClose, 
  onReportFound 
}: ItemDetailsPopupProps) {
  const handleReportFound = () => {
    onReportFound(item);
  };

  const handleImageError = (e: React.SyntheticEvent<HTMLImageElement>) => {
    e.currentTarget.style.display = 'none';
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
            <h4 className="item-name">{item.name}</h4>
          </div>

          {item.photo && (
            <div className="photo-section">
              <img
                src={item.photo}
                alt={item.name}
                className="item-photo"
                onError={handleImageError}
              />
            </div>
          )}

          <div className="info-section">
            <div className="info-row">
              <User className="info-icon user-icon" />
              <span className="info-label">Reporter:</span>
              <span className="info-value">{item.reporter}</span>
            </div>
            
            <div className="info-row">
              <Phone className="info-icon phone-icon" />
              <span className="info-label">Phone:</span>
              <a 
                href={`tel:${item.phone}`}
                className="phone-link"
              >
                {item.phone}
              </a>
            </div>
          </div>

          <div className="description-section">
            <div className="description-row">
              <FileText className="info-icon description-icon" />
              <div className="description-content">
                <span className="info-label">Description:</span>
                <p className="description-text">
                  {item.description}
                </p>
              </div>
            </div>
          </div>

          <div className="location-section">
            <div className="info-row">
              <MapPin className="info-icon location-icon" />
              <span className="info-label">Location:</span>
              <span className="info-value">{item.location}</span>
            </div>
          </div>
        </div>

        <div className="popup-footer">
          <button
            onClick={handleReportFound}
            className="report-found-button"
          >
            Report Found
          </button>
        </div>
      </div>
    </div>
  );
}