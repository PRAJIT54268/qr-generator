import { describe, expect, it } from 'vitest';
import { buildPayload, contrastRatio, validateData } from './qr';
import type { QRData } from './types';

const base: QRData = {
  type: 'url', url: 'https://example.com', text: '', email: '', phone: '',
  wifiSsid: '', wifiPassword: '', wifiSecurity: 'WPA',
};

describe('QR payloads', () => {
  it('builds URL payloads', () => expect(buildPayload(base)).toBe('https://example.com'));
  it('builds email payloads', () => expect(buildPayload({ ...base, type: 'email', email: 'a@b.com' })).toBe('mailto:a@b.com'));
  it('builds phone payloads', () => expect(buildPayload({ ...base, type: 'phone', phone: '+919876543210' })).toBe('tel:+919876543210'));
  it('builds Wi-Fi payloads', () => expect(buildPayload({ ...base, type: 'wifi', wifiSsid: 'Campus;WiFi', wifiPassword: 'pass:123' })).toBe('WIFI:T:WPA;S:Campus\\;WiFi;P:pass\\:123;;'));
});

describe('validation', () => {
  it('rejects empty content', () => expect(validateData({ ...base, url: '' })).toBeTruthy());
  it('accepts HTTPS URLs', () => expect(validateData(base)).toBeNull());
  it('rejects non-web URL protocols', () => expect(validateData({ ...base, url: 'javascript:alert(1)' })).toContain('HTTP'));
  it('accepts valid email', () => expect(validateData({ ...base, type: 'email', email: 'hello@example.com' })).toBeNull());
  it('rejects invalid email', () => expect(validateData({ ...base, type: 'email', email: 'hello' })).toBeTruthy());
  it('rejects Wi-Fi without an SSID', () => expect(validateData({ ...base, type: 'wifi', wifiSsid: '' })).toBeTruthy());
});

describe('scan reliability', () => {
  it('reports strong contrast for black on white', () => expect(contrastRatio('#000000', '#ffffff')).toBeGreaterThan(20));
  it('reports weak contrast for similar colors', () => expect(contrastRatio('#777777', '#888888')).toBeLessThan(2));
});
