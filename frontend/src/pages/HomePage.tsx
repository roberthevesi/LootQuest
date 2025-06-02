import "../styles/home.css";
import { useEffect, useMemo, useRef, useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import ProfilePanel from "../panels/ProfilePanel";
import ReportSpotPanel from "../panels/ReportSpotPanel";
import { MapView, MapViewHandle } from "../components/MapView";
import { Coordinate, getLocationAsync } from "../services/locationService";
import { NearbyLostItem } from "../types";
import MapReportPanel from "../panels/MapReportPanel";
import profileIcon from "../assets/profile_icon.svg";
import plusIcon from "../assets/plus_icon.svg";

const getCoordinates = async (location: string) => {
  const url = `https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(
    location
  )}`;

  try {
    const response = await fetch(url, {
      headers: {
        Accept: "application/json",
        "User-Agent": "LootQuest/1.0",
      },
    });

    if (!response.ok) {
      throw new Error(`HTTP error! Status: ${response.status}`);
    }

    const data = await response.json();

    if (data.length === 0) {
      console.log("No results found");
      return null;
    }

    const { lat, lon } = data[0];
    console.log(`Coordinates for "${location}":`, lon, lat);
    return [lon, lat] as Coordinate;
  } catch (error) {
    console.error("Error fetching coordinates:", error);
    return null;
  }
};

function debounceAsync<T extends (...args: any[]) => Promise<any>>(
  fn: T,
  delay: number
) {
  let timeoutId: ReturnType<typeof setTimeout>;

  return (...args: Parameters<T>) => {
    clearTimeout(timeoutId);
    timeoutId = setTimeout(() => {
      fn(...args);
    }, delay);
  };
}

export default function HomePage() {
  const mapRef = useRef<MapViewHandle>(null);

  const navigate = useNavigate();
  const location = useLocation();
  const [nearbyLostItems, setNearbyLostItems] = useState<NearbyLostItem[]>([
    // { id: 0, latitude: 46.17844574633315, longitude: 21.303241847089122 },
    // { id: 1, latitude: 46.17873387082949, longitude: 21.303035853305804 },
    // { id: 2, latitude: 46.1784368352655, longitude: 21.30419885906923 },
  ]);
  const [selectedNearbyItem, setSelectedNearbyItem] =
    useState<NearbyLostItem | null>(null);
  const [showProfile, setShowProfile] = useState(false);
  const [showDropIcon, setShowDropIcon] = useState(false);
  const [showReportSpot, setShowReportSpot] = useState(false);
  const [myPosition, setMyPosition] = useState<Coordinate>();
  const [centerPosition, setCenterPosition] = useState<Coordinate>();
  const [searchTerm, setSearchTerm] = useState("");

  useEffect(() => {
    getLocationAsync().then((response) => {
      setMyPosition(response);
      mapRef.current?.setMyPosition(response);
      mapRef.current?.setZoomAndCenter(response);
    });
  }, []);

  const handleAddClick = () => {
    setShowDropIcon(true);
    setShowReportSpot(true);
  };

  useEffect(() => {
    if (!myPosition) {
      return;
    }

    const fetchNearbyLostItems = async () => {
      const token = localStorage.getItem("token");

      if (!token) {
        console.error("User not authenticated.");
        return;
      }

      try {
        const response = await fetch(
          `${
            import.meta.env.VITE_BACKEND_URL
          }/items/get-nearby-lost-items?latitude=${myPosition[1]}&longitude=${
            myPosition[0]
          }`,
          {
            method: "GET",
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );

        if (!response.ok) {
          throw new Error("Failed to fetch lost items");
        }

        const data = await response.json();
        setNearbyLostItems(data);
      } catch (error) {
        console.error("Error fetching nearby lost items:", error);
      }
    };

    fetchNearbyLostItems();
  }, [myPosition]);

  useEffect(() => {
    console.log("Nearby lost items:", nearbyLostItems);
    if (nearbyLostItems.length > 0) {
      console.log("✅ List is not empty");
    } else {
      console.log("❌ List is empty");
    }
  }, [nearbyLostItems]);

  useEffect(() => {
    if (location.state?.fromListingPage) {
      setShowProfile(true);
      window.history.replaceState({}, "");
    }
  }, [location.state]);

  const zoomToLocation = useMemo(
    () =>
      debounceAsync(async (value: string) => {
        const coords = await getCoordinates(value);
        if (coords) {
          mapRef.current?.setZoomAndCenter(coords);
        }
      }, 1000),
    []
  );

  return (
    <div className="page-container">
      <div className="map-container">
        <MapView
          ref={mapRef}
          setCenterPosition={setCenterPosition}
          lostItems={nearbyLostItems.map((item) => ({
            id: item.id,
            coordinates: [item.longitude, item.latitude],
            onClick: () => setSelectedNearbyItem(item),
          }))}
        />
      </div>
      <div className="search-bar floating-ui">
        <input
          type="text"
          placeholder="Search a location..."
          value={searchTerm}
          onChange={(e) => {
            const value = e.target.value;
            setSearchTerm(value);
            if (value.length >= 3) {
              zoomToLocation(value);
            } else if (value.length === 0) {
              if (myPosition) {
                mapRef.current?.setZoomAndCenter(myPosition);
              }
            }
          }}
        />
      </div>
      <button
        className="profile-btn floating-ui"
        type="button"
        onClick={() => setShowProfile(true)}
      >
        <img
          src={profileIcon}
          alt="Porfile Icon"
          width="100%"
          height="100%"
        />
      </button>
      <button
        className="add-btn floating-ui"
        type="button"
        onClick={handleAddClick}
      >
        <img
          src={plusIcon}
          alt="Plus Icon"
          width="100%"
          height="100%"
        />
      </button>

      {showProfile && <ProfilePanel onClose={() => setShowProfile(false)} />}
      {showDropIcon && (
        <img
          src="src/assets/location_pin.svg"
          alt="Dropping Icon"
          className="drop-icon"
        />
      )}
      {showReportSpot && (
        <ReportSpotPanel
          latitude={centerPosition?.[1] ?? 0}
          longitude={centerPosition?.[0] ?? 0}
          onClose={() => {
            setShowReportSpot(false);
            setShowDropIcon(false);
          }}
          onConfirm={() => {
            navigate(
              `/submit-report/${encodeURIComponent(
                `${centerPosition?.[1] ?? 0}, ${centerPosition?.[0] ?? 0}`
              )}`
            );
            setShowReportSpot(false);
            setShowDropIcon(false);
          }}
        />
      )}

      {selectedNearbyItem && (
        <MapReportPanel
          item={selectedNearbyItem}
          onClose={() => setSelectedNearbyItem(null)}
        />
      )}
    </div>
  );
}
