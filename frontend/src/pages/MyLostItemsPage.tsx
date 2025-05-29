import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Search } from 'lucide-react';
import ListItem from '../components/ListItem';
import { LostItem } from '../types';
import logo from '../assets/logo.png';
import '../styles/auth.css';
import "../styles/mylostitems.css"

export default function MyLostItemsPage() {
  const [searchTerm, setSearchTerm] = useState<string>('');
  const [lostItems, setLostItems] = useState<LostItem[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchLostItems = async () => {
      const token = localStorage.getItem("token");

      if (!token) {
        setError("User not authenticated.");
        setLoading(false);
        return;
      }

      try {
        const response = await fetch("http://localhost:8080/api/v1/items/get-your-lost-items", {
          method: "GET",
          headers: {
            "Authorization": `Bearer ${token}`,
          },
        });

        if (!response.ok) {
          throw new Error("Failed to fetch lost items");
        }

        const data = await response.json();
        setLostItems(data);
      } catch (err: any) {
        setError(err.message || "Something went wrong");
      } finally {
        setLoading(false);
      }
    };

    fetchLostItems();
  }, []);
  

  const handleEngagementHistory = (itemId: number, itemTitle: string): void => {
    navigate(`/item-history/${itemId}`, { state: { itemName: itemTitle } });
  };

  const handleDelete = async (itemId: number): Promise<void> => {
    const token = localStorage.getItem("token");
    if (!token) {
      console.error("User not authenticated.");
      return;
    }
  
    try {
      const response = await fetch(`http://localhost:8080/api/v1/items/delete-lost-item?id=${itemId}`, {
        method: "DELETE",
        headers: {
          "Authorization": `Bearer ${token}`,
          "Content-Type": "application/json",
        },
      });
  
      if (!response.ok) {
        throw new Error("Failed to delete item");
      }
  
      setLostItems(prevItems => prevItems.filter(item => item.id !== itemId));
      console.log(`Deleted item ${itemId}`);
    } catch (error) {
      console.error("Error deleting item:", error);
    }
  };

  const handleBack = () => {
    navigate('/home', { state: { fromListingPage: true } });
  };

  const filteredLostItems: LostItem[] = lostItems.filter(item =>
    item.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
    item.latitude.toString().includes(searchTerm) ||
    item.longitude.toString().includes(searchTerm)
  );

  return (
    <div className="mylostitems-page">

      <div className="logo-container">
        <img src={logo} alt="Logo" className="logo" />
      </div>

      <div className="lostitems-content-container">

        <div className="searchbar-container">
          <input
            type="text"
            placeholder="Search lost items..."
            value={searchTerm}
            onChange={(e: React.ChangeEvent<HTMLInputElement>) => setSearchTerm(e.target.value)}
          />
          <Search className="searchbar"/>
        </div>

        {loading ? (
          <div className="text-center py-8">Loading lost items...</div>
        ) : error ? (
          <div className="text-center text-red-500 py-8">{error}</div>
        ) : (
          <div className="list-container">
            {filteredLostItems.length > 0 ? (
              filteredLostItems.map(item => (
                <ListItem
                  key={item.id}
                  item={item}
                  type="lost"
                  onEngagementHistory={handleEngagementHistory}
                  onDelete={handleDelete}
                />
              ))
            ) : (
              <div className="text-center text-gray-500 py-8">
                No lost items match your search.
              </div>
            )}
          </div>
        )}
        <button className="lostitems-back-btn" onClick={handleBack}>Back</button>
      </div>
      
    </div>
  );
}