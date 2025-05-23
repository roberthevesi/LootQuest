import { MapPin } from 'lucide-react';
import '../styles/mapreportpin.css';

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

interface MapPinMarkerProps {
  item: LostItem;
  position: { x: number; y: number };
  onClick: (item: LostItem) => void;
}

export default function MapPinMarker({ item, position, onClick }: MapPinMarkerProps) {
  return (
    <button
      className="map-pin-marker"
      style={{
        left: `${position.x}px`,
        top: `${position.y}px`
      }}
      onClick={() => onClick(item)}
      aria-label={`Lost item: ${item.name} at ${item.location}`}
    >
      <div className="pin-container">
        <MapPin 
          className="pin-icon" 
          fill="currentColor"
        />
        <div className="pin-center"></div>
      </div>
    </button>
  );
}