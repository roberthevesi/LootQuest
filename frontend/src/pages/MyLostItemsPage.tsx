import React, { useState } from 'react';
import { Search } from 'lucide-react';
import ListItem from '../components/ListItem';
import { LostItem } from '../types';
import useWindowWidth from '../hooks/useWindowWidth';
import logo from '../assets/logo.png';
import '../styles/auth.css';

export default function MyLostItemsPage() {
  const screenWidth = useWindowWidth();
  const isMobile = screenWidth < 768;
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
    <div className="page-container">
      <div className="content-container">
        <div className="auth-component">
          <img src={logo} alt="Logo" className="logo" />
          <h1 className="text-2xl font-bold text-gray-800 mb-6">My Lost Items</h1>
          
          {/* Search Bar */}
          <div className="relative mb-6 w-full">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} />
            <input
              type="text"
              placeholder="Search lost items..."
              value={searchTerm}
              onChange={(e: React.ChangeEvent<HTMLInputElement>) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
          </div>

          {/* Scrollable List */}
          <div className="w-full max-h-96 overflow-y-auto">
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
        {!isMobile && <div className="welcome-image-component"></div>}
      </div>
    </div>
  );
}