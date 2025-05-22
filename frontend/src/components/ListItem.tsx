import { History, Trash2 } from 'lucide-react';
import { FindingItem, LostItem } from '../types';

interface ListItemProps {
  item: FindingItem | LostItem;
  type: 'findings' | 'lost';
  onEngagementHistory?: (id: number) => void;
  onDelete?: (id: number) => void;
}

export default function ListItem({ item, type, onEngagementHistory, onDelete }: ListItemProps) {
  return (
    <div className="bg-white rounded-lg shadow-md p-4 mb-3 border border-gray-200">
      <div className="flex justify-between items-start">
        <div className="flex-1">
          <h3 className="font-semibold text-gray-800 mb-2">{item.name}</h3>
          <p className="text-gray-600 text-sm mb-1">
            <span className="font-medium">Location:</span> {item.location}
          </p>
          {type === 'findings' && 'owner' in item && (
            <p className="text-gray-600 text-sm">
              <span className="font-medium">Owner:</span> {item.owner}
            </p>
          )}
        </div>
        
        {type === 'lost' && (
          <div className="flex flex-col gap-2 ml-4">
            <button
              onClick={() => onEngagementHistory?.(item.id)}
              className="flex items-center gap-1 px-3 py-1 bg-blue-500 text-white text-xs rounded hover:bg-blue-600 transition-colors"
            >
              <History size={12} />
              History
            </button>
            <button
              onClick={() => onDelete?.(item.id)}
              className="flex items-center gap-1 px-3 py-1 bg-red-500 text-white text-xs rounded hover:bg-red-600 transition-colors"
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