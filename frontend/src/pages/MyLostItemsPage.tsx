import React, { useState } from 'react';
import { Search } from 'lucide-react';
import ListItem from '../components/ListItem';
import { LostItem } from '../types';
import logo from '../assets/logo.png';
import '../styles/auth.css';
import "../styles/mylostitems.css"

export default function MyLostItemsPage() {
  const [searchTerm, setSearchTerm] = useState<string>('');
  
  // Hardcoded data - replace with database calls later
  const [lostItems, setLostItems] = useState<LostItem[]>([
    {
      id: 1,
      name: "Wallet - Brown Leather",
      location: "Campus Cafeteria"
    },
    {
      id: 2,
      name: "AirPods Pro",
      location: "Library Study Room 3"
    },
    {
      id: 3,
      name: "Red Umbrella",
      location: "Bus Stop near Main Gate"
    },
    {
      id: 4,
      name: "Textbook - Mathematics",
      location: "Lecture Hall A"
    },
    {
      id: 5,
      name: "Silver Ring",
      location: "Swimming Pool Area"
    }
  ]);

  const handleEngagementHistory = (itemId: number): void => {
    console.log(`View engagement history for item ${itemId}`);
    // TODO: Navigate to engagement history page or open modal
  };

  const handleDelete = (itemId: number): void => {
    console.log(`Delete item ${itemId}`);
    setLostItems(prevItems => prevItems.filter(item => item.id !== itemId));
    // TODO: Make API call to delete from database
  };

  const filteredLostItems: LostItem[] = lostItems.filter(item =>
    item.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    item.location.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="mylostitems-page">

      <div className="logo-container">
        <img src={logo} alt="Logo" className="logo" />
      </div>

      <div className="lostitems-content-container">
        <div className="page-header">
          <p><strong>My Lost Items</strong></p>
        </div>

        <div className="searchbar-container">
          <input
            type="text"
            placeholder="Search lost items..."
            value={searchTerm}
            onChange={(e: React.ChangeEvent<HTMLInputElement>) => setSearchTerm(e.target.value)}
          />
          <Search className="searchbar"/>
        </div>

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
      </div>
    </div>
  );
}