
export enum AppStatus {
  IDLE = 'IDLE',
  REQUESTING_PERMISSION = 'REQUESTING_PERMISSION',
  LOCATING = 'LOCATING',
  SENDING_TELEGRAM = 'SENDING_TELEGRAM',
  SUCCESS = 'SUCCESS',
  ERROR = 'ERROR'
}

export interface LocationData {
  latitude: number;
  longitude: number;
  accuracy: number;
  timestamp: string;
  googleMapsUrl: string;
  address?: string;
  groundingUrls?: string[];
}

export interface TelegramConfig {
  botToken: string;
  chatId: string;
}
