import { useLocation, useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import "../styles/submitreportpage.css"

export default function FoundReportPage() {
  const navigate = useNavigate();
  const { state } = useLocation();
  const item = state?.item;

  const [latitude, setLatitude] = useState("");
  const [longitude, setLongitude] = useState("");
  const [photo, setPhoto] = useState<string | null>(null);

  useEffect(() => {
    navigator.geolocation.getCurrentPosition((pos) => {
      setLatitude(pos.coords.latitude.toString());
      setLongitude(pos.coords.longitude.toString());
    });
  }, []);

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

    const fileInput = document.querySelector('input[type="file"]') as HTMLInputElement;
    if (!fileInput?.files || !fileInput.files[0]) {
      alert("Please upload a photo.");
      return;
    }
  
    const formData = new FormData();
    formData.append("lostItemId", item.id);
    formData.append("description", item.description);
    formData.append("photo", fileInput.files[0]);
    formData.append("latitude", latitude || "");
    formData.append("longitude", longitude || "");
  
    try {
      const response = await fetch("http://localhost:8080/api/v1/items/add-found-item", {
        method: "POST",
        headers: {
          Authorization: `Bearer ${token}`,
        },
        body: formData,
      });
  
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
      <h1 className="headline">Found Page</h1>

      <div className="report-data">
        <section>
          <h2>Original Details</h2>
          <p><strong>Title:</strong> {item.title}</p>
          <p><strong>Original Coordinates:</strong> {item.latitude}, {item.longitude}</p>
          <p><strong>Description:</strong> {item.description}</p>
          <p><strong>Original Photo:</strong></p>
          {item.photoUrl && <img src={item.photoUrl} alt={item.title} className="uploaded-photo-preview" />}
        </section>

        <section className="photo-section">
          <h2>Your Photo of the Found Item</h2>
          <input type="file" accept="image/*" onChange={handlePhotoChange} />
          {photo && <img src={photo} alt="Uploaded" className="uploaded-photo-preview" />}
        </section>

        <section>
          <h2>Your Current Location</h2>
          <p><strong>Latitude:</strong> {latitude}</p>
          <p><strong>Longitude:</strong> {longitude}</p>
        </section>
      </div>

      <button className="submit-report-btn" onClick={handleSubmit}>
        SUBMIT REPORT
      </button>
    </div>
  );
}
