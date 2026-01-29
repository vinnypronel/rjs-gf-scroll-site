import React, { useState, useRef, useEffect } from 'react';
import { motion, useScroll, useInView, AnimatePresence } from 'framer-motion';
import Lenis from '@studio-freight/lenis';

function App() {
    const [started, setStarted] = useState(false);
    const [audioReady, setAudioReady] = useState(false);
    const audioRef = useRef(null);
    const { scrollYProgress } = useScroll();

    // High performance smooth scroll
    useEffect(() => {
        if (!started) return;

        const lenis = new Lenis({
            duration: 1.0, // Snappier duration
            easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
            direction: 'vertical',
            gestureDirection: 'vertical',
            smooth: true,
            mouseMultiplier: 1,
            smoothTouch: true, // Enable smooth touch for better mobile feel
            touchMultiplier: 2,
            infinite: false,
            lerp: 0.1,
        });

        function raf(time) {
            lenis.raf(time);
            requestAnimationFrame(raf);
        }

        requestAnimationFrame(raf);

        return () => {
            lenis.destroy();
        };
    }, [started]);

    const handleEnter = () => {
        setStarted(true);
        if (audioRef.current) {
            audioRef.current.play().catch(err => console.log('Audio play failed:', err));
            setAudioReady(true);
        }
    };

    return (
        <>
            <audio ref={audioRef} loop>
                <source src="/background-audio/Lil Yachty - drive ME crazy! (Official Audio).mp3" type="audio/mpeg" />
            </audio>

            <AnimatePresence mode="wait">
                {!started && <HeroScreen onEnter={handleEnter} />}
            </AnimatePresence>

            {started && (
                <div className="scroll-container">
                    <PrimaryGallery />
                    <MessageSection />
                    <VideoSection scrollYProgress={scrollYProgress} />
                    <FeatureGallery />
                    <Footer />
                </div>
            )}
        </>
    );
}

// Animated Hero Screen Component with Slideshow & Floating Hearts
function HeroScreen({ onEnter }) {
    const [currentImageIndex, setCurrentImageIndex] = useState(0);
    const [titleText, setTitleText] = useState('');
    const [subtitleText, setSubtitleText] = useState('');
    const [showButton, setShowButton] = useState(false);

    const fullTitle = "Happy\nBirthday\nMi Vida";
    const fullSubtitle = "A special message just for you";

    const heroImages = [
        '/images/272F9FA0-793B-4852-B23F-18D3D642AC95.JPEG',
        '/images/IMG_2184.JPEG',
        '/images/IMG_7715.jpg',
        '/images/IMG_9303.jpg',
        '/images/IMG_9507.jpg',
        '/images/IMG_9543.jpg',
    ];

    // Image Preloading
    useEffect(() => {
        heroImages.forEach((img) => {
            const image = new Image();
            image.src = img;
        });
    }, []);

    // Slideshow effect - reduced to 4s (0.5s less than 4.5s)
    useEffect(() => {
        const interval = setInterval(() => {
            setCurrentImageIndex((prev) => (prev + 1) % heroImages.length);
        }, 4000);
        return () => clearInterval(interval);
    }, []);

    // Typewriter effect for title
    useEffect(() => {
        let currentIndex = 0;
        const typingInterval = setInterval(() => {
            if (currentIndex <= fullTitle.length) {
                setTitleText(fullTitle.slice(0, currentIndex));
                currentIndex++;
            } else {
                clearInterval(typingInterval);
            }
        }, 100);

        return () => clearInterval(typingInterval);
    }, []);

    // Typewriter effect for subtitle (starts after title)
    useEffect(() => {
        const startDelay = setTimeout(() => {
            let currentIndex = 0;
            const typingInterval = setInterval(() => {
                if (currentIndex <= fullSubtitle.length) {
                    setSubtitleText(fullSubtitle.slice(0, currentIndex));
                    currentIndex++;
                } else {
                    clearInterval(typingInterval);
                    setTimeout(() => setShowButton(true), 800); // Longer delay before fade starts
                }
            }, 80);

            return () => clearInterval(typingInterval);
        }, fullTitle.length * 100 + 300);

        return () => clearTimeout(startDelay);
    }, []);

    return (
        <motion.div
            className="hero"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0, scale: 1.01 }} // Solid performance improvement
            transition={{ duration: 0.5 }}
        >
            {/* High-Performance Slideshow */}
            <div className="hero-bg-container">
                {/* The overlay handles the brightness much more efficiently than a CSS filter */}
                <div className="hero-overlay"></div>

                {heroImages.map((img, i) => (
                    <div
                        key={i}
                        className={`hero-bg-css ${i === currentImageIndex ? 'active' : ''}`}
                        style={{
                            backgroundImage: `url(${img})`,
                            backgroundSize: 'cover',
                            backgroundPosition: 'center',
                            opacity: i === currentImageIndex ? 1 : 0,
                            position: 'absolute',
                            width: '100%',
                            height: '100%',
                            transition: 'opacity 1.5s ease-in-out',
                            willChange: 'opacity'
                        }}
                    />
                ))}
            </div>

            {/* Performance-optimized Hearts (CSS-animated) */}
            <div className="hearts-container">
                {[...Array(12)].map((_, i) => (
                    <div
                        key={i}
                        className="floating-heart-css"
                        style={{
                            left: `${Math.random() * 100}vw`,
                            animationDelay: `${i * 0.8}s`,
                            animationDuration: `${Math.random() * 5 + 7}s`,
                            fontSize: `${Math.random() * 20 + 15}px`,
                            willChange: 'transform, opacity'
                        }}
                    >
                        ❤️
                    </div>
                ))}
            </div>

            {/* Performance-optimized Sparkles (CSS-animated) */}
            <div className="sparkles-container">
                {[...Array(20)].map((_, i) => (
                    <div
                        key={i}
                        className="sparkle-css"
                        style={{
                            left: `${Math.random() * 100}%`,
                            top: `${Math.random() * 100}%`,
                            animationDelay: `${Math.random() * 3}s`,
                            animationDuration: `${Math.random() * 2 + 1.5}s`
                        }}
                    />
                ))}
            </div>

            <div className="hero-content">
                <h1 className="hero-title glowing-text typewriter">
                    {titleText}
                    <span className="cursor-blink">|</span>
                </h1>

                <motion.p
                    className="hero-subtitle glowing-subtitle"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: subtitleText ? 1 : 0 }}
                >
                    {subtitleText}
                    {subtitleText && subtitleText.length < fullSubtitle.length && (
                        <span className="cursor-blink">|</span>
                    )}
                </motion.p>

                <AnimatePresence>
                    {showButton && (
                        <motion.button
                            className="enter-button glowing-button mega-glow"
                            onClick={onEnter}
                            initial={{ y: 20, opacity: 0 }}
                            animate={{
                                y: 0,
                                opacity: 1,
                            }}
                            transition={{
                                duration: 1.5, // Slow fade
                                ease: "easeOut"
                            }}
                            whileHover={{
                                scale: 1.15,
                                rotate: [0, -2, 2, -2, 0],
                                transition: { duration: 0.3 }
                            }}
                            whileTap={{ scale: 0.9 }}
                        >
                            <motion.span
                                animate={{
                                    textShadow: [
                                        '0 0 20px rgba(255,255,255,1), 0 0 40px rgba(255,105,180,1)',
                                        '0 0 30px rgba(255,255,255,1), 0 0 60px rgba(255,105,180,1), 0 0 80px rgba(139,92,246,1)',
                                        '0 0 20px rgba(255,255,255,1), 0 0 40px rgba(255,105,180,1)'
                                    ]
                                }}
                                transition={{ duration: 1.5, repeat: Infinity }}
                            >
                                Enter
                            </motion.span>
                        </motion.button>
                    )}
                </AnimatePresence>
            </div>
        </motion.div>
    );
}

// Primary Gallery Component
function PrimaryGallery() {
    const images = [
        '/images/IMG_0729.JPEG',
        '/images/IMG_0755.jpg',
        '/images/IMG_8441.jpg',
    ];

    return (
        <section className="gallery-section">
            <motion.h2
                className="gallery-title"
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.4 }}
            >
                Our Memories
            </motion.h2>
            <div className="gallery-grid">
                {images.map((img, index) => (
                    <GalleryImage key={index} src={img} index={index} />
                ))}
            </div>
        </section>
    );
}

// Clickable Image Component with Shimmer Effect
function ShimmerImage({ src, alt, className, layoutProps }) {
    const [isAnimating, setIsAnimating] = useState(false);

    const handleClick = () => {
        if (isAnimating) return;
        setIsAnimating(true);
        setTimeout(() => setIsAnimating(false), 1200); // Increased to match new horizontal shimmer duration
    };

    return (
        <motion.div
            className={className}
            onClick={handleClick}
            {...layoutProps}
        >
            <img src={src} alt={alt} loading="lazy" decoding="async" />
            <div className="shimmer-container">
                <div className={`shimmer ${isAnimating ? 'animate' : ''}`}></div>
            </div>
        </motion.div>
    );
}

// Optimized Gallery Image Component
function GalleryImage({ src, index }) {
    const layoutProps = {
        initial: { opacity: 0 },
        whileInView: { opacity: 1 },
        viewport: { once: true, margin: "50px" },
        transition: { duration: 0.3 }
    };

    return (
        <ShimmerImage
            src={src}
            alt={`Memory ${index + 1}`}
            className="gallery-item"
            layoutProps={layoutProps}
        />
    );
}

// Message Section with Typewriter Effect
function MessageSection() {
    const ref = useRef(null);
    const isInView = useInView(ref, { once: true, amount: 0.1 });
    const [displayedText, setDisplayedText] = useState('');
    const [hasStarted, setHasStarted] = useState(false);

    const message = `You rlly pushing 🅿️ and that's why I fw you cause 🅿️🤝🅿️ yfm? 🅿️ attract 🅿️ and this why we really locked in fasho twiz. Nah onna real tho you gotta be the best thing that's happened to me since I came to Vegas and I really enjoy having you in my life every single day. Yeah you added some other things like me constantly overthinking nd being jealous bout you but rlly it's cause I love you ma. And if we do end up doing this, yk….I'm glad it's with you. I wouldn't want it with any other person sleep well and I love you to the moon and back 🌚💕🦋`;

    useEffect(() => {
        if (isInView && !hasStarted) {
            setHasStarted(true);

            // Convert message to an array of characters (correctly handles multi-byte emojis)
            const messageChars = Array.from(message);
            let currentIndex = 0;

            const typingInterval = setInterval(() => {
                if (currentIndex <= messageChars.length) {
                    setDisplayedText(messageChars.slice(0, currentIndex).join(''));
                    currentIndex++;
                } else {
                    clearInterval(typingInterval);
                }
            }, 30);

            return () => clearInterval(typingInterval);
        }
    }, [isInView, message]); // Include message in dependencies just in case it changes

    return (
        <section className="message-section" ref={ref}>
            <div className="message-text-wrapper">
                <motion.h2
                    className="message-intro-title"
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.8 }}
                >
                    The First Paragraph I Ever Wrote To You...
                </motion.h2>
                <p className="message-text typewriter-message">
                    {displayedText}
                    {hasStarted && displayedText.length < message.length && (
                        <span className="cursor-blink">|</span>
                    )}
                </p>
            </div>
        </section>
    );
}

// Video Section with Letterbox Effect
function VideoSection({ scrollYProgress }) {
    const ref = useRef(null);
    const { scrollYProgress: sectionProgress } = useScroll({
        target: ref,
        offset: ['start end', 'end start'],
    });

    const [letterboxActive, setLetterboxActive] = useState(false);

    useEffect(() => {
        const unsubscribe = sectionProgress.on("change", (latest) => {
            const isActive = latest > 0.15 && latest < 0.85;
            setLetterboxActive((prev) => (prev !== isActive ? isActive : prev));
        });

        return () => unsubscribe();
    }, [sectionProgress]);

    return (
        <>
            <div className={`letterbox top ${letterboxActive ? 'active' : ''}`} />
            <div className={`letterbox bottom ${letterboxActive ? 'active' : ''}`} />

            <section className="video-section" ref={ref}>
                <motion.div
                    className="video-container"
                    initial={{ opacity: 0, scale: 0.9 }}
                    whileInView={{ opacity: 1, scale: 1 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.5 }}
                >
                    <video
                        autoPlay
                        muted
                        loop
                        playsInline
                        webkit-playsinline="true"
                        preload="auto"
                        className="main-video"
                    >
                        <source src="/vids/video.mp4" type="video/quicktime" />
                        <source src="/vids/video.mp4" type="video/mp4" />
                    </video>
                </motion.div>
            </section>
        </>
    );
}

// Feature Gallery Component
function FeatureGallery() {
    const images = [
        '/images/IMG_2184.JPEG',
        '/images/IMG_7715.jpg',
        '/images/IMG_9303.jpg',
        '/images/IMG_9327.JPEG',
        '/images/IMG_9507.jpg',
        '/images/IMG_9543.jpg',
        '/images/IMG_9596.jpg',
        '/images/IMG_9929.JPEG',
        '/images/IMG_9991.JPEG',
    ];

    return (
        <section className="feature-gallery">
            <motion.h2
                className="gallery-title"
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.4 }}
            >
                More of Us
            </motion.h2>
            <div className="feature-grid">
                {images.map((img, index) => {
                    const layoutProps = {
                        initial: { opacity: 0 },
                        whileInView: { opacity: 1 },
                        viewport: { once: true, margin: "50px" },
                        transition: { duration: 0.3 }
                    };

                    return (
                        <ShimmerImage
                            key={index}
                            src={img}
                            alt={`Feature ${index + 1}`}
                            className="feature-item"
                            layoutProps={layoutProps}
                        />
                    );
                })}
            </div>
        </section>
    );
}

// Footer Component with Integrated Special Message
function Footer() {
    return (
        <footer className="footer combined-footer">
            <motion.h2
                className="special-message-title"
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6 }}
            >
                You truly are the best thing that ever happened to me,
                <br />
                Hoping today is as special as you
            </motion.h2>

            <div className="heart-container">
                <svg
                    className="heart"
                    viewBox="0 0 100 100"
                    xmlns="http://www.w3.org/2000/svg"
                >
                    <defs>
                        <linearGradient id="heartGradient" x1="0%" y1="0%" x2="100%" y2="100%">
                            <stop offset="0%" stopColor="#ff69b4" />
                            <stop offset="100%" stopColor="#8b5cf6" />
                        </linearGradient>
                    </defs>
                    <path
                        d="M50,90 C50,90 10,65 10,40 C10,25 20,15 30,15 C40,15 45,20 50,30 C55,20 60,15 70,15 C80,15 90,25 90,40 C90,65 50,90 50,90 Z"
                        fill="url(#heartGradient)"
                    />
                </svg>
            </div>
            <p className="footer-text special-message-title">Made with love, Bubby</p>
        </footer>
    );
}

export default App;
