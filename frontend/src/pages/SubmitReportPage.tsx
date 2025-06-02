import { useNavigate } from "react-router-dom";
import { useParams } from "react-router-dom";
import { useState } from "react";
import "../styles/submitreportpage.css";
import RangeSlider from "../props/RangeSlider";

export default function SubmitReportPage() {
  const navigate = useNavigate();
  const { coordinates } = useParams();
  const [latitude, longitude] = coordinates?.split(",") || [];
  const [rangeValue, setRangeValue] = useState<number>(250);
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [photo, setPhoto] = useState<string | null>(null);

  const handlePhotoChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setPhoto(URL.createObjectURL(e.target.files[0]));
    }
  };

  const handleSubmit = async () => {
    const token = localStorage.getItem("token");
    if (!token) {
      alert("Not authenticated!");
      return;
    }

    const formData = new FormData();
    formData.append("title", title);
    formData.append("description", description);
    formData.append("latitude", latitude || "");
    formData.append("longitude", longitude || "");
    formData.append("radius", rangeValue.toString());

    const fileInput = document.querySelector(
      'input[type="file"]'
    ) as HTMLInputElement;
    if (fileInput?.files && fileInput.files[0]) {
      formData.append("photo", fileInput.files[0]);
    }

    try {
      const response = await fetch(
        `${import.meta.env.VITE_BACKEND_URL}/items/add-lost-item`,
        {
          method: "POST",
          headers: {
            Authorization: `Bearer ${token}`,
          },
          body: formData,
        }
      );

      if (!response.ok) {
        const errorText = await response.text();
        throw new Error(errorText);
      }

      alert("Report submitted!");
      navigate("/home");
    } catch (error: any) {
      alert(`Error submitting report: ${error.message}`);
    }
  };

  return (
    <div className="report-page-container">
      <h1 className="headline">Report Page</h1>

      <div className="report-data">
        <section className="location-section">
          <h2>Location</h2>
          <p className="coordinates-text">{`${latitude}, ${longitude}`}</p>
          <RangeSlider value={rangeValue} onChange={setRangeValue} />
        </section>

        <section className="name-section">
          <h2>Item Title</h2>
          <input
            type="text"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            placeholder="Enter item title"
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
          <input type="file" accept="image/*" onChange={handlePhotoChange} />
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
