import QRCode from 'qrcode';
import type { QRData, QRSettings, QRType } from './types';

export function escapeWifi(value: string): string {
  return value.replace(/[\\;,:\"]/g, (match) => `\\${match}`);
}

export function buildPayload(data: QRData): string {
  switch (data.type) {
    case 'url':
      return data.url.trim();
    case 'text':
      return data.text;
    case 'email':
      return `mailto:${data.email.trim()}`;
    case 'phone':
      return `tel:${data.phone.trim()}`;
    case 'wifi':
      return `WIFI:T:${data.wifiSecurity};S:${escapeWifi(data.wifiSsid)};P:${escapeWifi(data.wifiPassword)};;`;
  }
}

export function validateData(data: QRData): string | null {
  switch (data.type) {
    case 'url': {
      if (!data.url.trim()) return 'Enter a URL.';
      try {
        const parsed = new URL(data.url.trim());
        if (!['http:', 'https:'].includes(parsed.protocol)) return 'Use an HTTP or HTTPS URL.';
      } catch {
        return 'Enter a valid URL, including https://.';
      }
      return null;
    }
    case 'text':
      return data.text.trim() ? null : 'Enter some text.';
    case 'email':
      return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(data.email.trim()) ? null : 'Enter a valid email address.';
    case 'phone':
      return /^\+?[0-9][0-9\s().-]{6,}$/.test(data.phone.trim()) ? null : 'Enter a valid phone number.';
    case 'wifi':
      if (!data.wifiSsid.trim()) return 'Enter the Wi-Fi network name (SSID).';
      if (data.wifiSecurity !== 'nopass' && !data.wifiPassword) return 'Enter the Wi-Fi password or choose an open network.';
      return null;
  }
}

export function contrastRatio(hexA: string, hexB: string): number {
  const luminance = (hex: string) => {
    const clean = hex.replace('#', '');
    const rgb = clean.length === 3
      ? clean.split('').map((x) => parseInt(x + x, 16))
      : [0, 2, 4].map((i) => parseInt(clean.slice(i, i + 2), 16));
    const channels = rgb.map((v) => v / 255).map((v) => v <= 0.03928 ? v / 12.92 : Math.pow((v + 0.055) / 1.055, 2.4));
    return 0.2126 * channels[0] + 0.7152 * channels[1] + 0.0722 * channels[2];
  };
  const a = luminance(hexA);
  const b = luminance(hexB);
  return (Math.max(a, b) + 0.05) / (Math.min(a, b) + 0.05);
}

export async function renderQRCode(canvas: HTMLCanvasElement, payload: string, settings: QRSettings) {
  await QRCode.toCanvas(canvas, payload, {
    width: settings.size,
    margin: settings.margin,
    errorCorrectionLevel: settings.errorCorrection,
    color: {
      dark: settings.foreground,
      light: settings.background,
    },
  });
}

export async function createSvgDataUrl(payload: string, settings: QRSettings): Promise<string> {
  const svg = await QRCode.toString(payload, {
    type: 'svg',
    width: settings.size,
    margin: settings.margin,
    errorCorrectionLevel: settings.errorCorrection,
    color: { dark: settings.foreground, light: settings.background },
  });
  return `data:image/svg+xml;charset=utf-8,${encodeURIComponent(svg)}`;
}

export function titleForType(type: QRType): string {
  return ({ url: 'URL', text: 'Plain text', email: 'Email', phone: 'Phone', wifi: 'Wi-Fi' })[type];
}
