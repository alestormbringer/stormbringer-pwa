import { Timestamp } from 'firebase/firestore';

export interface Campaign {
  id: string;
  name: string;
  description: string;
  createdAt: Date | Timestamp;
  updatedAt: Date | Timestamp;
  dmId: string;
  players: string[]; // array di userIds
  status: 'active' | 'completed' | 'paused';
  files?: string[]; // array di URL di file
  nextSessionDate?: Date | Timestamp | null;
  chats?: ChatMessage[];
  accessLink?: string; // link per accedere alla campagna
  playerCharacters?: Record<string, string>; // mappa userId -> characterId
}

export interface ChatMessage {
  id: string;
  userId: string;
  userName: string;
  text: string;
  timestamp: Date | Timestamp;
}

export interface CampaignFormData {
  name: string;
  description: string;
  files?: string[];
  nextSessionDate?: Date | null;
} 