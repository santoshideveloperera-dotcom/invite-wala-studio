# Royal Emerald & Antique Gold invitation
Standalone React/Vite invitation added beside the existing Invite Wala site. The parent website is not replaced.

## Edit details
Edit `src/config/weddingConfig.js` for names, date/time, venue addresses, event details and WhatsApp number. Replace the sample WhatsApp number with international digits only.

## Local
```bash
cd royal-emerald-invitation
npm install
npm run dev
npm run build
```

The Vite base is relative (`./`) so built assets can be served from the GitHub Pages project subpath `/invite-wala-studio/royal-emerald-invitation/`.

This source folder is committed to the main repository branch through a feature branch. It must be built and the generated dist contents published under this folder (or via a Pages workflow) before the live URL can serve the compiled app.