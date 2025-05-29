import "../styles/reportspot.css";

interface ReportSpotPanelProps {
  latitude: number;
  longitude: number;
  onClose: () => void;
  onConfirm: () => void;
}

export default function ReportSpotPanel({ latitude, longitude, onClose, onConfirm }: ReportSpotPanelProps) {
  return (
    <div className="report-spot-panel">
      <button className="close-btn" onClick={onClose}>×</button>
      <h2>Use this location as report spot?</h2>
      <p>Coordinates: {`${latitude}, ${longitude}`}</p>
      <button className="confirm-btn" onClick={onConfirm}>Confirm</button>
    </div>
  );
}
