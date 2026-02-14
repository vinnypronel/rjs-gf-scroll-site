# 🎂 Birthday Website for Your Girlfriend

A beautiful, animated birthday website with smooth scrolling, parallax effects, and heartfelt messages.

## ✨ Features

- **Ultra-Dark Minimalist Design** - Clean #050505 background with glassmorphism
- **Smooth Scroll** - Powered by Lenis for buttery-smooth scrolling
- **Complex Animations**:
  - Parallax gallery images that move at different speeds
  - Staggered word reveal in the message section
  - Letterbox effect during video playback
  - Pulsing heart in footer
- **Audio Integration** - Background music (Lil Yachty - drive ME crazy!) starts on user interaction
- **Video Background** - Looping, muted video with cinematic transitions
- **Fully Responsive** - Works perfectly on iOS/Android devices

## 🚀 Getting Started

The development server is already running! Open your browser and navigate to:

```
http://localhost:3000
```

## 📁 Project Structure

```
rj-gf-bday/
├── src/
│   ├── App.jsx          # Main application with all components
│   ├── main.jsx         # React entry point
│   └── index.css        # All styles and animations
├── images/              # All photo assets
├── vids/               # Video file
├── background-audio/   # Background music
├── index.html          # HTML entry point
├── vite.config.js      # Vite configuration
└── package.json        # Dependencies and scripts
```

## 🎨 Design Features

### Typography
- **Headers**: Playfair Display (Modern Serif)
- **Body**: Inter (Clean Sans-Serif)

### Color Palette
- Background: `#050505` (Ultra-dark)
- Gradient: Pink (`#ff69b4`) to Purple (`#8b5cf6`)
- Text: White with glassmorphism overlays

### Animations
1. **Hero Screen**: Fade in with scale effect
2. **Gallery**: Parallax scrolling with staggered reveals
3. **Message**: Word-by-word fade-in as you scroll
4. **Video**: Letterbox bars expand for cinematic effect
5. **Footer**: Pulsing red heart

## 🎵 Audio

The background music starts when the user clicks the "Enter" button on the hero screen. This bypasses browser autoplay restrictions.

## 📱 Mobile Optimized

- Responsive grid layouts
- Touch-friendly interactions
- Optimized letterbox effect for mobile screens
- Lazy loading for images

## 🛠 Commands

```bash
# Start development server (already running)
npm run dev

# Build for production
npm run build

# Preview production build
npm run preview
```

## 💡 Technical Details

- **Framework**: React 19
- **Build Tool**: Vite 7
- **Animations**: Framer Motion 12
- **Smooth Scroll**: Lenis
- **Styling**: Vanilla CSS with modern features

## 🎯 Message Content

The heartfelt message appears in the middle section with a beautiful staggered word reveal animation. Each word fades in as you scroll through the section.

## ❤️ Footer

Features a pulsing red SVG heart with the signature:
> "Made with love, from Bubby"

---
