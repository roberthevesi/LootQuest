import { useParams, useNavigate } from 'react-router-dom';
import { useState, useEffect } from 'react';
import "../styles/itemhistory.css"

// Type definitions
interface EngagementItem {
  id: number;
  username: string;
  location: string;
  photo: string;
}

// Mock data for engagement history - replace with actual API call
const mockEngagementData: Record<string, EngagementItem[]> = {
  "backpack": [
    {
      id: 1,
      username: "john_doe",
      location: "Piata Romana",
      photo: "https://via.placeholder.com/50x50?text=JD"
    },
    {
      id: 2,
      username: "maria_pop",
      location: "Universitate",
      photo: "https://via.placeholder.com/50x50?text=MP"
    },
    {
      id: 3,
      username: "alex_ionescu",
      location: "Piata Unirii",
      photo: "https://via.placeholder.com/50x50?text=AI"
    }
  ]
};

export default function ItemHistoryPage() {
    const { username, itemname } = useParams<{ username: string; itemname: string }>();
    const navigate = useNavigate();
    const [engagementHistory, setEngagementHistory] = useState<EngagementItem[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        // Simulate API call to fetch engagement history
        const fetchEngagementHistory = async () => {
            setLoading(true);
            try {
                // Replace this with actual API call
                // const response = await fetch(`/api/items/${itemname}/engagement-history`);
                // const data = await response.json();
                
                // Using mock data for now
                const data = mockEngagementData[itemname?.toLowerCase() || ''] || [];
                setEngagementHistory(data);
            } catch (error) {
                console.error('Error fetching engagement history:', error);
                setEngagementHistory([]);
            } finally {
                setLoading(false);
            }
        };

        fetchEngagementHistory();
    }, [itemname]);

    const handleBack = () => {
        navigate(-1); // Go back to previous page
    };

    // Format item name for display (capitalize first letter)
    const formatItemName = (name: string | undefined): string => {
        return name ? name.charAt(0).toUpperCase() + name.slice(1) : '';
    };

    return (
        <div className="itemhistory-page">
            <div className="iteminfo-container">
                <h2>Item History</h2>
                <p><strong>Name:</strong> {formatItemName(itemname)}</p>
                <p><strong>Owner:</strong> {username}</p>
            </div>

            <div className="engagement-history-header">
                <h2>Engagement ({engagementHistory.length})</h2>
            </div>

            <div className="engagement-history">
                {loading ? (
                    <div className="loading-message">Loading engagement history...</div>
                ) : engagementHistory.length > 0 ? (
                    engagementHistory.map((engagement) => (
                        <div key={engagement.id} className="engagement-item">
                            <div className="engagement-photo">
                                <img 
                                    src={engagement.photo} 
                                    alt={engagement.username}
                                    onError={(e) => {
                                        const target = e.target as HTMLImageElement;
                                        target.src = `https://via.placeholder.com/50x50?text=${engagement.username.charAt(0).toUpperCase()}`;
                                    }}
                                />
                            </div>
                            <div className="engagement-info">
                                <h4 className="engagement-username">{engagement.username}</h4>
                                <p className="engagement-location">Found at: {engagement.location}</p>
                            </div>
                        </div>
                    ))
                ) : (
                    <div className="no-engagement-message">
                        No one has marked this item as found yet.
                    </div>
                )}
            </div>

            <button className="back-btn" onClick={handleBack}>Back</button>
        </div>
    );
}