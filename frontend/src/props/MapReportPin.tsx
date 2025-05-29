import { MapPin } from 'lucide-react';
import '../styles/mapreportpin.css';
import { NearbyLostItem } from '../types';

interface MapPinMarkerProps {
  item: NearbyLostItem;
  position: { x: number; y: number };
  onClick: (item: NearbyLostItem) => void;
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
      aria-label={`Lost item: ${item.title} at ${item.latitude}, ${item.longitude}`}
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