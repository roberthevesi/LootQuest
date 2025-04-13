import "../styles/home.css";

export default function HomePage() {
  return (
    <div className="page-container">
      <div className="map-container"></div>
      <div className="search-bar floating-ui">
        <input type="text" placeholder="Search a location..." />
      </div>
      <button className="profile-btn floating-ui" type="button">
        <img src="src/assets/profile_icon.svg" alt="Porfile Icon" width="100%" height="100%" />
      </button>
      <button className="add-btn floating-ui" type="button">
        <img src="src/assets/plus_icon.svg" alt="Plus Icon" width="100%" height="100%" />
      </button>
    </div>
  );
}
