import { History, Trash2 } from 'lucide-react';
import { FindingItem, LostItem } from '../types';
import "../styles/listitem.css"

interface ListItemProps {
  item: FindingItem | LostItem;
  type: 'findings' | 'lost';
  onEngagementHistory?: (id: number) => void;
  onDelete?: (id: number) => void;
}

export default function ListItem({ item, type, onEngagementHistory, onDelete }: ListItemProps) {
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
          onClick={() => onEngagementHistory?.(item.id)}
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