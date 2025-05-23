import React, { useState } from 'react';
import { Search } from 'lucide-react';
import ListItem from '../components/ListItem';
import { FindingItem } from '../types';
import logo from '../assets/logo.png';
import '../styles/auth.css';
import "../styles/myfindings.css"

export default function MyFindingsPage() {
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
    <div className="myfindings-page">

      <div className="logo-container">
        <img src={logo} alt="Logo" className="logo" />
      </div>

      <div className="content-container">
        <div className="page-header">
          <p><strong>My Findings</strong></p>
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
                  No lost items match your search.
                </div>
              )}
        </div>
      </div>
    </div>
  );
}