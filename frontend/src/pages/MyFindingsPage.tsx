import React, { useState } from 'react';
import { Search } from 'lucide-react';
import ListItem from '../components/ListItem';
import { FindingItem } from '../types';
import useWindowWidth from '../hooks/useWindowWidth';
import logo from '../assets/logo.png';
import '../styles/auth.css';

export default function MyFindingsPage() {
  const screenWidth = useWindowWidth();
  const isMobile = screenWidth < 768;
  const [searchTerm, setSearchTerm] = useState<string>('');
  
  // Hardcoded data - replace with database calls later
  const findings: FindingItem[] = [
    {
      id: 1,
      name: "iPhone 13 Pro",
      location: "Central Library, 2nd Floor",
      owner: "John Smith"
    },
    {
      id: 2,
      name: "Blue Backpack",
      location: "Student Union Building",
      owner: "Sarah Johnson"
    },
    {
      id: 3,
      name: "Car Keys (Toyota)",
      location: "Parking Lot B",
      owner: "Mike Davis"
    },
    {
      id: 4,
      name: "Gold Watch",
      location: "Gymnasium",
      owner: "Emily Chen"
    },
    {
      id: 5,
      name: "Notebook - Biology",
      location: "Science Building Room 204",
      owner: "Alex Rodriguez"
    }
  ];

  const filteredFindings: FindingItem[] = findings.filter(item =>
    item.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    item.location.toLowerCase().includes(searchTerm.toLowerCase()) ||
    item.owner.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="page-container">
      <div className="content-container">
        <div className="auth-component">
          <img src={logo} alt="Logo" className="logo" />
          <h1 className="text-2xl font-bold text-gray-800 mb-6">My Findings</h1>
          
          {/* Search Bar */}
          <div className="relative mb-6 w-full">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} />
            <input
              type="text"
              placeholder="Search findings..."
              value={searchTerm}
              onChange={(e: React.ChangeEvent<HTMLInputElement>) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
          </div>

          {/* Scrollable List */}
          <div className="w-full max-h-96 overflow-y-auto">
            {filteredFindings.length > 0 ? (
              filteredFindings.map(item => (
                <ListItem
                  key={item.id}
                  item={item}
                  type="findings"
                />
              ))
            ) : (
              <div className="text-center text-gray-500 py-8">
                No findings match your search.
              </div>
            )}
          </div>
        </div>
        {!isMobile && <div className="welcome-image-component"></div>}
      </div>
    </div>
  );
}