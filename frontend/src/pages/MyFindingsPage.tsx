import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Search } from "lucide-react";
import ListItem from "../components/ListItem";
import { FindingItem } from "../types";
import logo from "../assets/logo.png";
import "../styles/auth.css";
import "../styles/myfindings.css";

export default function MyFindingsPage() {
  const [searchTerm, setSearchTerm] = useState<string>("");
  const [findings, setFindings] = useState<FindingItem[]>([]);
  const [_, setLoading] = useState<boolean>(true);
  const [__, setError] = useState<string | null>(null);
  const navigate = useNavigate();

  const handleBack = () => {
    navigate("/home", { state: { fromListingPage: true } });
  };

  useEffect(() => {
    const fetchLostItems = async () => {
      const token = localStorage.getItem("token");

      if (!token) {
        setError("User not authenticated.");
        setLoading(false);
        return;
      }

      try {
        const response = await fetch(
          `${import.meta.env.VITE_BACKEND_URL}/items/get-your-findings`,
          {
            method: "GET",
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );

        if (!response.ok) {
          throw new Error("Failed to fetch findings");
        }

        const data = await response.json();

        const transformed: FindingItem[] = data.map((item: any) => ({
          ...item,
          title: new Date(item.createdAtDateTime).toLocaleString(),
        }));

        setFindings(transformed);
      } catch (err: any) {
        setError(err.message || "Something went wrong");
      } finally {
        setLoading(false);
      }
    };

    fetchLostItems();
  }, []);

  const filteredFindings: FindingItem[] = findings.filter(
    (item) =>
      item.title?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      item.id.toString().includes(searchTerm) ||
      item.latitude.toString().includes(searchTerm) ||
      item.longitude.toString().includes(searchTerm) ||
      item.owner.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="myfindings-page">
      <div className="logo-container">
        <img src={logo} alt="Logo" className="logo" />
      </div>

      <div className="findings-content-container">
        <div className="searchbar-container">
          <input
            type="text"
            placeholder="Search found items..."
            value={searchTerm}
            onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
              setSearchTerm(e.target.value)
            }
          />
          <Search className="searchbar" />
        </div>

        <div className="list-container">
          {filteredFindings.length > 0 ? (
            filteredFindings.map((item) => (
              <ListItem key={item.id} item={item} type="findings" />
            ))
          ) : (
            <div className="text-center text-gray-500 py-8">
              No lost items match your search.
            </div>
          )}
        </div>
        <button className="findings-back-btn" onClick={handleBack}>
          Back
        </button>
      </div>
    </div>
  );
}
