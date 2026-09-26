# WayPoint — Submission Checklist

## Mandatory functionality

- [ ] URL QR generation works in real time.
- [ ] Plain text QR generation works in real time.
- [ ] Email QR generation works in real time.
- [ ] Phone QR generation works in real time.
- [ ] Wi-Fi QR generation works in real time.
- [ ] Inputs change according to the selected QR type.
- [ ] QR size changes the preview immediately.
- [ ] Foreground and background colors change the preview immediately.
- [ ] Error correction changes the preview immediately.
- [ ] Margin changes the preview immediately.
- [ ] Presets can be selected and then modified.
- [ ] PNG download matches the preview.
- [ ] Invalid/incomplete input produces a clear error.
- [ ] Low contrast / low margin settings trigger a scan-reliability warning.
- [ ] Recent QR codes are stored locally.
- [ ] Recent QR codes survive a browser refresh.
- [ ] A saved QR can be restored and reused.
- [ ] Desktop layout works without overlap or horizontal scrolling.
- [ ] Mobile layout works without overlap or horizontal scrolling.

## Final browser tests

- [ ] Test every QR type with valid data.
- [ ] Test every QR type with invalid/empty data.
- [ ] Test all customization controls.
- [ ] Download several PNGs and scan them with a phone.
- [ ] Test local history, refresh, restore and clear.
- [ ] Test light/dark mode.
- [ ] Test at desktop, tablet and mobile widths.
- [ ] Run `npm run build` successfully.
- [ ] Run `npm test` successfully.

## GitHub submission

- [ ] Repository is public.
- [ ] README explains setup, features, testing and deployment.
- [ ] Add screenshots of the finished application.
- [ ] Verify no personal secrets/API keys are committed.
- [ ] Verify the repository contains only your own implementation.

## Deployment

- [ ] Push the final project to GitHub.
- [ ] Import the repository into Vercel or Netlify.
- [ ] Confirm the production build succeeds.
- [ ] Open the deployed URL on both desktop and mobile.
- [ ] Test PNG download on the deployed site.
