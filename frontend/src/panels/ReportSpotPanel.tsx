import "../styles/reportspot.css";

interface ReportSpotPanelProps {
  coordinates: string;
  onClose: () => void;
  onConfirm: () => void;
}

export default function ReportSpotPanel({ coordinates, onClose, onConfirm }: ReportSpotPanelProps) {
  return (
    <div className="report-spot-panel">
      <button className="close-btn" onClick={onClose}>×</button>
      <h2>Use this location as report spot?</h2>
      <p>Coordinates: {coordinates}</p>
      <button className="confirm-btn" onClick={onConfirm}>Confirm</button>
    </div>
  );
}
