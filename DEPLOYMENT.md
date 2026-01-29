# 🚀 Deployment Guide

## Option 1: Vercel (Recommended - Easiest)

### Steps:
1. Push your project to GitHub (if not already)
2. Go to [vercel.com](https://vercel.com)
3. Click "Import Project"
4. Select your GitHub repo
5. Vercel auto-detects Vite - just click "Deploy"
6. Done! You'll get a URL like `your-site.vercel.app`

### Why Vercel?
- Free hosting
- Automatic HTTPS
- Auto-deploys on git push
- Perfect for React/Vite projects
- Global CDN (fast everywhere)

---

## Option 2: Netlify

### Steps:
1. Build the project:
   ```bash
   npm run build
   ```
2. Go to [netlify.com](https://netlify.com)
3. Drag and drop the `dist/` folder
4. Done! Get instant URL

### Alternative (Git-based):
1. Push to GitHub
2. Connect Netlify to your repo
3. Build settings:
   - Build command: `npm run build`
   - Publish directory: `dist`
4. Deploy!

---

## Option 3: GitHub Pages

### Steps:
1. Install gh-pages:
   ```bash
   npm install -D gh-pages
   ```

2. Update `package.json`:
   ```json
   {
     "homepage": "https://yourusername.github.io/rj-gf-bday",
     "scripts": {
       "predeploy": "npm run build",
       "deploy": "gh-pages -d dist"
     }
   }
   ```

3. Update `vite.config.js`:
   ```javascript
   export default defineConfig({
     base: '/rj-gf-bday/',  // your repo name
     plugins: [react()],
   });
   ```

4. Deploy:
   ```bash
   npm run deploy
   ```

---

## Option 4: Local Sharing (Same Network)

### For showing on your phone/her phone on same WiFi:

1. Find your computer's local IP:
   **Windows**:
   ```bash
   ipconfig
   ```
   Look for "IPv4 Address" (usually like `192.168.1.XXX`)

2. Start server with host flag:
   ```bash
   npm run dev -- --host
   ```

3. Access from phone:
   ```
   http://YOUR_IP:3000
   ```
   Example: `http://192.168.1.100:3000`

---

## Option 5: Share via QR Code (Mobile Testing)

1. Start server with host:
   ```bash
   npm run dev -- --host
   ```

2. Vite will show a Network URL

3. Use a QR code generator with that URL

4. Scan with phone camera

---

## Pre-Deployment Checklist ✅

- [ ] Test all images load correctly
- [ ] Test video plays properly
- [ ] Test audio starts on button click
- [ ] Test smooth scrolling works
- [ ] Test on Chrome
- [ ] Test on Safari (especially mobile)
- [ ] Test on actual phone (iOS & Android if possible)
- [ ] Check all animations play smoothly
- [ ] Verify text message displays with all emojis
- [ ] Check footer heart is pulsing

---

## Performance Optimization (Before Deploy)

All images are already optimized, but if you want to go further:

```bash
# Install image optimizer
npm install -D vite-plugin-imagemin

# Add to vite.config.js
import viteImagemin from 'vite-plugin-imagemin';

export default defineConfig({
  plugins: [
    react(),
    viteImagemin({
      gifsicle: { optimizationLevel: 7 },
      optipng: { optimizationLevel: 7 },
      mozjpeg: { quality: 80 },
    }),
  ],
});
```

---

## Custom Domain (Optional)

After deploying to Vercel/Netlify:

### Vercel:
1. Go to Project Settings → Domains
2. Add your custom domain
3. Update DNS records as shown
4. Wait for verification

### Netlify:
1. Domain Settings → Add Custom Domain
2. Follow DNS configuration steps
3. Netlify provides free HTTPS

---

## Production Build Test (Local)

Before deploying, test the production build:

```bash
# Build for production
npm run build

# Preview the production build
npm run preview
```

This starts a local server with the production bundle.

---

## Mobile Safari Specific

If video doesn't autoplay on iPhone:
- This is normal - iOS restricts autoplay
- The video will still loop once user scrolls to it
- Audio is already handled with user-gesture (Enter button)

---

## Troubleshooting

### Images not loading:
- Check paths start with `/images/` not `./images/`
- Verify files are in the project root, not in `src/`

### Audio not playing:
- Make sure you click the "Enter" button first
- Check browser console for errors
- Some browsers block autoplay even with user gesture - this is rare

### Animations choppy:
- Close other browser tabs
- Check if hardware acceleration is enabled
- Test on different device

### Video not loading:
- Check video file format (MOV should work)
- Try converting to MP4 if issues persist
- Ensure file is in `/vids/` folder

---

## Recommended: Test Before Showing Her!

1. Deploy to Vercel/Netlify (5 minutes)
2. Open on your phone
3. Check everything works
4. Share the link when you're ready! 💕

---

**Good luck! She's going to love it! 🎉💕🎂**
