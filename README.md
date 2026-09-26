# WayPoint — QR Code Generator & Designer

A browser-only QR code generator and designer built for the **GDG on Campus SRM Technical Domain — Frontend: QR Code Generator & Designer** task.

## Requirements covered

- React + Vite + TypeScript frontend.
- URL, plain text, email, phone number, and Wi-Fi QR types.
- Dynamic inputs based on QR type.
- Real-time QR preview.
- Size, foreground/background color, error correction, and margin controls.
- Four editable visual presets.
- PNG download matching the live canvas preview.
- Optional SVG download and payload copy.
- Input validation with clear error messages.
- Scan-reliability warning based on contrast, margin, and error-correction choices.
- Recent QR codes stored in `localStorage` and restored after refresh.
- Responsive desktop/mobile layouts.
- Light/dark theme toggle.
- No backend: QR generation and storage happen in the browser.

The core task specifies that the application work entirely in the browser and requires the supported QR types, customization, presets, PNG download, validation, scan reliability, local persistence, responsive design, and testing. fileciteturn0file0L17-L75

## Run locally

```bash
npm install
npm run dev
```

Then open the local Vite URL shown in the terminal.

## Production build

```bash
npm run build
npm run preview
```

## Deployment

The project is ready for Vercel or Netlify. Import the GitHub repository and use the default Vite build settings:

- Build command: `npm run build`
- Output directory: `dist`

## Testing checklist

Before submission, test each item manually in a real browser:

1. URL QR — valid and invalid URL.
2. Plain text QR — empty and populated text.
3. Email QR — valid and invalid email.
4. Phone QR — valid and invalid number.
5. Wi-Fi QR — WPA/WEP/open network, empty SSID, missing password.
6. Size, colors, error correction and margin update the preview immediately.
7. Each preset changes the preview and remains editable.
8. PNG download opens and scans to the same payload.
9. SVG download opens and contains the same payload.
10. Copy data copies the encoded payload.
11. Low-contrast/low-margin configurations display the reliability warning.
12. Save several QR codes, refresh the page, and restore them.
13. Clear history removes local history.
14. Test desktop, tablet and narrow mobile widths; check for overflow/overlap.
15. Test light/dark mode.

## GitHub submission

The recruitment brief requires each task to be stored in a **public GitHub repository** and asks candidates to add screenshots of their application. fileciteturn0file0L6-L12

Recommended repository contents:

```text
qr-code-designer/
├── src/
├── public/
├── index.html
├── package.json
├── README.md
├── tsconfig*.json
└── vite.config.ts
```

Add screenshots to the repository after running the app locally. Do not copy another candidate's implementation; the brief explicitly warns that plagiarism can cancel candidature. fileciteturn0file0L10-L12

## Visual direction

The interface was intentionally redesigned around a developer-oriented visual identity: deep navy surfaces, electric cyan, violet and a restrained orange warning accent. The goal is a precise, technical feel with a little personality rather than a generic QR-generator layout. The functionality and recruitment requirements remain unchanged.

<img width="650" height="408" alt="image" src="https://github.com/user-attachments/assets/a94bd7a2-6adf-4c94-9c44-a21da21f9f90" />

<br>
<br>

<img width="533" height="398" alt="image" src="https://github.com/user-attachments/assets/e563cc13-511e-4547-8d99-1fcf7ce38886" />
