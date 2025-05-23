import { History, Trash2 } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { FindingItem, LostItem } from '../types';
import "../styles/listitem.css"

interface ListItemProps {
  item: FindingItem | LostItem;
  type: 'findings' | 'lost';
  onEngagementHistory?: (id: number) => void;
  onDelete?: (id: number) => void;
  currentUsername?: string; // Add this prop to know the current user
}

export default function ListItem({ item, type, onEngagementHistory, onDelete, currentUsername }: ListItemProps) {
  const navigate = useNavigate();

  const handleEngagementHistory = (): void => {
    // Navigate to the item history page with username and itemname
    const username = currentUsername || 'unknown'; // Use current user or fallback
    const itemname = item.name.toLowerCase().replace(/\s+/g, '-'); // Convert to URL-friendly format
    
    navigate(`/item-history/${username}/${itemname}`);
    
    // Also call the original callback if provided
    if (onEngagementHistory) {
      onEngagementHistory(item.id);
    }
  };

  return (
    <div className="list-item">
      <div className="list-item-header">
        <div className="list-item-content">
          <h3 className="list-item-title">{item.name}</h3>
          <p className="list-item-text">
            <span className="list-item-label">Location:</span> {item.location}
          </p>
          {type === 'findings' && 'owner' in item && (
            <p className="list-item-text no-margin">
              <span className="list-item-label">Owner:</span> {item.owner}
            </p>
          )}
        </div>
        
        {type === 'lost' && (
          <div className="list-item-actions">
            <button
              onClick={handleEngagementHistory}
              className="list-item-button history"
            >
              <History size={12} />
              History
            </button>
            <button
              onClick={() => onDelete?.(item.id)}
              className="list-item-button delete"
            >
              <Trash2 size={12} />
              Delete
            </button>
          </div>
        )}
      </div>
    </div>
  );
}