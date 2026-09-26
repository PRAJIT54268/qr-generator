export type QRType = 'url' | 'text' | 'email' | 'phone' | 'wifi';
export type ErrorCorrection = 'L' | 'M' | 'Q' | 'H';

export interface QRSettings {
  size: number;
  foreground: string;
  background: string;
  errorCorrection: ErrorCorrection;
  margin: number;
}

export interface QRData {
  type: QRType;
  url: string;
  text: string;
  email: string;
  phone: string;
  wifiSsid: string;
  wifiPassword: string;
  wifiSecurity: 'WPA' | 'WEP' | 'nopass';
}

export interface RecentQR {
  id: string;
  name: string;
  type: QRType;
  payload: string;
  data: QRData;
  settings: QRSettings;
  createdAt: number;
}
