import { useNavigate } from "react-router-dom";
import { useParams } from "react-router-dom";
import { useState } from "react";
import "../styles/reportpage.css"

export default function ReportPage() {
  const navigate = useNavigate();
  const { coordinates } = useParams();
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [photo, setPhoto] = useState<string | null>(null);

  const handlePhotoChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
        setPhoto(URL.createObjectURL(e.target.files[0]));
    }
  };

  const handleSubmit = () => {
    alert("Report submitted!");
    navigate(`/home`);
  };

  return (
    <div className="report-page-container">
      <h1 className="headline">Report Page</h1>

      <div className="report-data">
        <section className="location-section">
          <h2>Location</h2>
          <p className="coordinates-text">{coordinates}</p>
          <div className="location-pic-placeholder"></div>
        </section>

        <section className="name-section">
          <h2>Report Name</h2>
          <input
            type="text"
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="Enter location name"
          />
        </section>

        <section className="description-section">
          <h2>Description</h2>
          <textarea
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            placeholder="Enter description"
            rows={4}
          />
        </section>

        <section className="photo-section">
          <h2>Photo</h2>
          <input
            type="file"
            accept="image/*"
            onChange={handlePhotoChange}
          />
          {photo && (
            <img
              src={photo}
              alt="Uploaded"
              className="uploaded-photo-preview"
            />
          )}
        </section>
      </div>

      <button className="submit-report-btn" onClick={handleSubmit}>
        SUBMIT REPORT
      </button>
    </div>
  );
}
