# 🎯 Technical Implementation Reference

## Animation Engine Details

### 1. Smooth Scroll (Lenis)
```javascript
const lenis = new Lenis({
  duration: 1.2,
  easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
  smooth: true,
  smoothTouch: false,
});
```

### 2. Parallax Layers
Each gallery image uses `useTransform` to create depth:
```javascript
const y = useTransform(scrollYProgress, [0, 1], [0, -200]);
```
- Alternating images move in opposite directions
- Creates a multi-layered depth effect

### 3. Staggered Word Reveal
The message section splits text into individual words:
```javascript
words.map((word, index) => (
  <motion.span
    initial={{ opacity: 0.1 }}
    animate={{ opacity: 1 }}
    transition={{ delay: index * 0.05 }}
  >
    {word}
  </motion.span>
))
```

### 4. Letterbox Video Transition
Black bars expand/contract based on scroll position:
```javascript
const [letterboxActive, setLetterboxActive] = useState(false);

useEffect(() => {
  sectionProgress.onChange((latest) => {
    setLetterboxActive(latest > 0.2 && latest < 0.8);
  });
}, [sectionProgress]);
```

## Asset Paths
All assets are served from the public directory (automatic with Vite):
- Audio: `/background-audio/Lil Yachty - drive ME crazy! (Official Audio).mp3`
- Video: `/vids/video.MOV`
- Images: `/images/IMG_XXXX.jpg`

## Video Settings
```javascript
<video
  autoPlay    // Starts immediately
  muted       // Required for autoplay
  loop        // Continuous playback
  playsInline // iOS compatibility
  preload="metadata"
/>
```

## Mobile Responsiveness

### Breakpoints
- Mobile: `< 480px` - Single column layouts
- Tablet: `< 768px` - Adjusted padding and grid
- Desktop: `> 768px` - Full multi-column layout

### iOS Specific
- `playsInline` attribute prevents fullscreen video
- Touch events disabled on smooth scroll to prevent interference
- Optimized letterbox height (`5vh` on mobile vs `10vh` on desktop)

## Performance Optimizations
1. **Lazy Loading**: All images use `loading="lazy"`
2. **Video Preload**: Set to `metadata` to load only basic info
3. **CSS Transforms**: Hardware-accelerated animations
4. **Framer Motion**: Optimized for 60fps
5. **Viewport Detection**: Animations trigger only when in view

## Browser Compatibility
- Chrome/Edge: Full support ✅
- Safari: Full support ✅
- Firefox: Full support ✅
- Mobile Safari: Full support ✅
- Mobile Chrome: Full support ✅

## Audio Autoplay Fix
Audio is initialized via user gesture (button click) to bypass browser restrictions:
```javascript
const handleEnter = () => {
  if (audioRef.current) {
    audioRef.current.play().catch(err => console.log('Audio play failed:', err));
  }
};
```

## Glassmorphism Implementation
```css
background: rgba(255, 255, 255, 0.05);
backdrop-filter: blur(20px);
-webkit-backdrop-filter: blur(20px);
border: 1px solid rgba(255, 255, 255, 0.1);
```

## Color System
- **Primary Background**: `#050505` (Ultra-dark black)
- **Gradients**: 
  - Pink to Purple: `linear-gradient(135deg, #ff69b4, #8b5cf6)`
  - White to Purple: `linear-gradient(135deg, #ffffff, #8b5cf6)`
- **Text**:
  - Primary: `#ffffff`
  - Muted: `rgba(255, 255, 255, 0.6)`
  - Footer: `rgba(255, 255, 255, 0.4)`

## Font Loading
Fonts are loaded from Google Fonts CDN:
- Playfair Display: 400, 500, 600, 700 weights
- Inter: 300, 400, 500, 600 weights
- `display=swap` ensures text is visible during font load

## Deployment Considerations

### Build Command
```bash
npm run build
```
Outputs to `dist/` folder

### Environment Variables
None required - all assets are static

### Hosting Recommendations
- Vercel (automatic Vite optimization)
- Netlify (drag-and-drop friendly)
- GitHub Pages (requires base URL config)

### Mobile Testing
Test on actual devices for:
- Touch interactions
- Video playback
- Audio initialization
- Scroll performance
- Font rendering

---

Built with ❤️ using React, Framer Motion, and Lenis
