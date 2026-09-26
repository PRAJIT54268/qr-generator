import { useEffect, useMemo, useRef, useState } from 'react';
import type { QRData, QRSettings, QRType, RecentQR } from './types';
import { buildPayload, contrastRatio, createSvgDataUrl, renderQRCode, titleForType, validateData } from './qr';

const STORAGE_KEY = 'waypoint-recent-v2';
const THEME_KEY = 'waypoint-theme-v2';

const initialData: QRData = {
  type: 'url', url: 'https://example.com', text: '', email: '', phone: '',
  wifiSsid: '', wifiPassword: '', wifiSecurity: 'WPA',
};

const initialSettings: QRSettings = {
  size: 320, foreground: '#111827', background: '#ffffff', errorCorrection: 'M', margin: 4,
};

const presets: Array<{ id: string; name: string; foreground: string; background: string; errorCorrection: QRSettings['errorCorrection']; margin: number }> = [
  { id: 'classic', name: 'Classic', foreground: '#111827', background: '#ffffff', errorCorrection: 'M', margin: 4 },
  { id: 'ink', name: 'Ink', foreground: '#000000', background: '#f3f4f6', errorCorrection: 'H', margin: 5 },
  { id: 'ocean', name: 'Ocean', foreground: '#075985', background: '#e0f2fe', errorCorrection: 'Q', margin: 4 },
  { id: 'forest', name: 'Forest', foreground: '#14532d', background: '#f0fdf4', errorCorrection: 'Q', margin: 5 },
];

function loadRecent(): RecentQR[] {
  try {
    const value = JSON.parse(localStorage.getItem(STORAGE_KEY) ?? '[]');
    return Array.isArray(value) ? value : [];
  } catch { return []; }
}

function App() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [data, setData] = useState<QRData>(initialData);
  const [settings, setSettings] = useState<QRSettings>(initialSettings);
  const [recent, setRecent] = useState<RecentQR[]>(loadRecent);
  const [error, setError] = useState<string | null>(null);
  const [theme, setTheme] = useState<'dark' | 'light'>(() => (localStorage.getItem(THEME_KEY) as 'dark' | 'light') || 'dark');
  const [status, setStatus] = useState('Ready');

  const payload = useMemo(() => buildPayload(data), [data]);
  const contrast = useMemo(() => contrastRatio(settings.foreground, settings.background), [settings.foreground, settings.background]);
  const reliabilityWarning = contrast < 4.5 || settings.margin < 2 || (settings.errorCorrection === 'L' && payload.length > 180);

  useEffect(() => {
    document.documentElement.dataset.theme = theme;
    localStorage.setItem(THEME_KEY, theme);
  }, [theme]);

  useEffect(() => {
    const validationError = validateData(data);
    setError(validationError);
    if (validationError || !canvasRef.current) return;
    renderQRCode(canvasRef.current, payload, settings).then(() => setStatus('Live preview')).catch(() => setStatus('Could not render QR code'));
  }, [data, payload, settings]);

  const updateData = (patch: Partial<QRData>) => setData((current) => ({ ...current, ...patch }));
  const updateSettings = (patch: Partial<QRSettings>) => setSettings((current) => ({ ...current, ...patch }));

  function applyPreset(preset: typeof presets[number]) {
    updateSettings({ foreground: preset.foreground, background: preset.background, errorCorrection: preset.errorCorrection, margin: preset.margin });
  }

  function saveRecent() {
    if (error) return;
    const item: RecentQR = {
      id: crypto.randomUUID(), name: `${titleForType(data.type)} · ${new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}`,
      type: data.type, payload, data, settings, createdAt: Date.now(),
    };
    const next = [item, ...recent].slice(0, 8);
    setRecent(next);
    localStorage.setItem(STORAGE_KEY, JSON.stringify(next));
    setStatus('Saved to recent QR codes');
  }

  function restore(item: RecentQR) {
    setData(item.data);
    setSettings(item.settings);
    setStatus('Restored from recent');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }

  function clearRecent() {
    setRecent([]);
    localStorage.removeItem(STORAGE_KEY);
    setStatus('Recent QR codes cleared');
  }

  async function downloadPng() {
    if (!canvasRef.current || error) return;
    canvasRef.current.toBlob((blob) => {
      if (!blob) return;
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url; a.download = `qr-${data.type}.png`; a.click(); URL.revokeObjectURL(url);
      setStatus('PNG downloaded');
    }, 'image/png');
  }

  async function downloadSvg() {
    if (error) return;
    const dataUrl = await createSvgDataUrl(payload, settings);
    const a = document.createElement('a');
    a.href = dataUrl; a.download = `qr-${data.type}.svg`; a.click();
    setStatus('SVG downloaded');
  }

  async function copyPayload() {
    if (error) return;
    await navigator.clipboard.writeText(payload);
    setStatus('QR payload copied');
  }

  return (
    <main className="app-shell">
      <header className="topbar">
        <div className="brand"><span className="brand-mark">⌁</span><span>WayPoint</span></div>
        <div className="top-actions">
          <span className="browser-badge">100% browser-side</span>
          <button className="icon-button" onClick={() => setTheme(theme === 'dark' ? 'light' : 'dark')} aria-label="Toggle theme">{theme === 'dark' ? '☀' : '☾'}</button>
        </div>
      </header>

      <section className="hero">
        <div>
          <p className="eyebrow">WAYPOINT · CODE YOUR SIGNAL</p>
          <h1>Turn information into a signal.</h1>
          <p className="hero-copy">Design precise, scannable QR codes with a fast browser-first workflow.</p>
        </div>
        <div className="hero-status"><span className="status-dot" /> {status}</div>
      </section>

      <section className="workspace">
        <div className="panel editor-panel">
          <div className="panel-heading"><div><p className="section-kicker">01 · CONTENT</p><h2>What should this QR contain?</h2></div></div>
          <div className="type-grid">
            {(['url', 'text', 'email', 'phone', 'wifi'] as QRType[]).map((type) => (
              <button key={type} className={`type-card ${data.type === type ? 'selected' : ''}`} onClick={() => updateData({ type })}>
                <span className="type-icon">{({ url: '↗', text: 'T', email: '@', phone: '⌕', wifi: '◉' } as Record<QRType, string>)[type]}</span>
                <span>{titleForType(type)}</span>
              </button>
            ))}
          </div>

          <div className="form-area">
            {data.type === 'url' && <Field label="Website URL" hint="Include https://"><input value={data.url} onChange={(e) => updateData({ url: e.target.value })} placeholder="https://your-site.com" /></Field>}
            {data.type === 'text' && <Field label="Plain text"><textarea value={data.text} onChange={(e) => updateData({ text: e.target.value })} placeholder="Type anything you want to encode…" rows={5} /></Field>}
            {data.type === 'email' && <Field label="Email address"><input type="email" value={data.email} onChange={(e) => updateData({ email: e.target.value })} placeholder="hello@example.com" /></Field>}
            {data.type === 'phone' && <Field label="Phone number" hint="International format works best"><input value={data.phone} onChange={(e) => updateData({ phone: e.target.value })} placeholder="+91 98765 43210" /></Field>}
            {data.type === 'wifi' && <div className="two-col"><Field label="Network name (SSID)"><input value={data.wifiSsid} onChange={(e) => updateData({ wifiSsid: e.target.value })} placeholder="My Wi-Fi" /></Field><Field label="Security"><select value={data.wifiSecurity} onChange={(e) => updateData({ wifiSecurity: e.target.value as QRData['wifiSecurity'] })}><option value="WPA">WPA / WPA2</option><option value="WEP">WEP</option><option value="nopass">Open</option></select></Field><Field label="Password"><input type="password" value={data.wifiPassword} disabled={data.wifiSecurity === 'nopass'} onChange={(e) => updateData({ wifiPassword: e.target.value })} placeholder={data.wifiSecurity === 'nopass' ? 'No password required' : 'Wi-Fi password'} /></Field></div>}
            {error && <div className="error-box">⚠ {error}</div>}
          </div>

          <div className="divider" />
          <div className="panel-heading compact"><div><p className="section-kicker">02 · APPEARANCE</p><h2>Make it yours</h2></div></div>
          <div className="preset-row"><span className="field-label">Presets</span><div className="preset-buttons">{presets.map((preset) => <button key={preset.id} className="preset" onClick={() => applyPreset(preset)}><span className="preset-swatch" style={{ background: preset.background, borderColor: preset.foreground }}><span style={{ background: preset.foreground }} /></span>{preset.name}</button>)}</div></div>

          <div className="controls-grid">
            <label className="control"><span>QR size <strong>{settings.size}px</strong></span><input type="range" min="160" max="640" step="16" value={settings.size} onChange={(e) => updateSettings({ size: Number(e.target.value) })} /></label>
            <label className="control"><span>Margin <strong>{settings.margin}</strong></span><input type="range" min="0" max="12" step="1" value={settings.margin} onChange={(e) => updateSettings({ margin: Number(e.target.value) })} /></label>
            <label className="control"><span>Error correction</span><select value={settings.errorCorrection} onChange={(e) => updateSettings({ errorCorrection: e.target.value as QRSettings['errorCorrection'] })}><option value="L">L · 7%</option><option value="M">M · 15%</option><option value="Q">Q · 25%</option><option value="H">H · 30%</option></select></label>
            <div className="color-control"><span>Foreground</span><label className="color-picker"><input type="color" value={settings.foreground} onChange={(e) => updateSettings({ foreground: e.target.value })} /><code>{settings.foreground}</code></label></div>
            <div className="color-control"><span>Background</span><label className="color-picker"><input type="color" value={settings.background} onChange={(e) => updateSettings({ background: e.target.value })} /><code>{settings.background}</code></label></div>
          </div>

          {reliabilityWarning && <div className="warning-box"><span>⌁</span><div><strong>Scan reliability check</strong><p>High contrast and a clear quiet zone help scanners read your QR. Current settings may reduce readability. Try a darker foreground, lighter background, more margin, or higher error correction.</p></div></div>}
        </div>

        <aside className="panel preview-panel">
          <div className="preview-header"><div><p className="section-kicker">03 · PREVIEW</p><h2>Live result</h2></div><span className="live-pill">LIVE</span></div>
          <div className="qr-stage"><div className="qr-card" style={{ width: `min(calc(100% - 32px), ${settings.size}px)`, height: `min(calc(100% - 32px), ${settings.size}px)` }}><canvas ref={canvasRef} aria-label="Generated QR code" /></div></div>
          <div className="preview-meta"><div><span>TYPE</span><strong>{titleForType(data.type)}</strong></div><div><span>CONTRAST</span><strong>{contrast.toFixed(1)}:1</strong></div><div><span>ERROR CORRECTION</span><strong>{settings.errorCorrection}</strong></div></div>
          <div className="action-stack"><button className="primary-action" onClick={downloadPng} disabled={!!error}>Download PNG <span>↓</span></button><div className="secondary-actions"><button onClick={downloadSvg} disabled={!!error}>SVG</button><button onClick={copyPayload} disabled={!!error}>Copy data</button><button onClick={saveRecent} disabled={!!error}>Save</button></div></div>
          <p className="privacy-note">Your QR data never leaves this browser. Nothing is sent to a backend.</p>
        </aside>
      </section>

      <section className="recent-section">
        <div className="recent-header"><div><p className="section-kicker">04 · LOCAL HISTORY</p><h2>Recent QR codes</h2></div>{recent.length > 0 && <button className="text-button" onClick={clearRecent}>Clear history</button>}</div>
        {recent.length === 0 ? <div className="empty-state"><span>◌</span><p>Your saved QR codes will appear here.</p><small>They persist after refresh using localStorage.</small></div> : <div className="recent-grid">{recent.map((item) => <button className="recent-card" key={item.id} onClick={() => restore(item)}><span className="recent-mini"><canvas ref={(node) => { if (node && item.payload) renderQRCode(node, item.payload, { ...item.settings, size: 76 }); }} /></span><span className="recent-info"><strong>{item.name}</strong><small>{titleForType(item.type)} · {new Date(item.createdAt).toLocaleDateString()}</small></span><span className="restore-arrow">↗</span></button>)}</div>}
      </section>

      <footer><span>WayPoint</span></footer>
    </main>
  );
}

function Field({ label, hint, children }: { label: string; hint?: string; children: React.ReactNode }) {
  return <label className="field"><span>{label}{hint && <em>{hint}</em>}</span>{children}</label>;
}

export default App;
