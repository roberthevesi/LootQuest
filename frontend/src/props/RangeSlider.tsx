import "../styles/rangeslider.css";

interface RangeSliderProps {
  value: number;
  onChange: (value: number) => void;
}

export default function RangeSlider({ value, onChange }: RangeSliderProps) {
  return (
    <div className="range-slider-container">
      <label htmlFor="distance">Distance: {value}m</label>
      <input
        type="range"
        id="distance"
        min={0}
        max={500}
        step={10}
        value={value}
        onChange={(e) => onChange(parseInt(e.target.value))}
        className="range-slider"
      />
    </div>
  );
}
