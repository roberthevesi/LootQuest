export interface FindingItem {
  id: number;
  title: string;
  latitude: number;
  longitude: number;
  owner: string;
}
  
export interface LostItem {
  id: number;
  title: string;
  latitude: number;
  longitude: number;
}

export interface NearbyLostItem {
  id: number;
  userId: number;
  title: string;
  description: string;
  photoUrl?: string | null;
  latitude: number;
  longitude: number;
  radius: number;
  isFound: boolean;
  isActive: boolean;
  createdAtDateTime: string;
}