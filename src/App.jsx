import React, { useState, useRef, useEffect, memo, useMemo } from 'react';
import { motion, useScroll, useInView, AnimatePresence } from 'framer-motion';
import Lenis from '@studio-freight/lenis';

// Shared Heart SVG Component
const HeartSVG = ({ className }) => (
    <svg
        className={className}
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
);

// Cinematic Blur-In Text Component
const CinematicText = ({ children, delay = 0, className = "" }) => {
    return (
        <motion.div
            initial={{ opacity: 0, filter: 'blur(20px)', y: 20 }}
            animate={{ opacity: 1, filter: 'blur(0px)', y: 0 }}
            transition={{
                duration: 1.8,
                delay,
                ease: [0.2, 0.8, 0.2, 1]
            }}
            className={className}
            style={{ animationFillMode: 'forwards' }}
        >
            {children}
        </motion.div>
    );
};

// Performance-optimized Floating Hearts component
const FloatingHearts = memo(() => {
    // Generate static properties once to prevent lag during parent re-renders (like typewriter)
    const hearts = useMemo(() => {
        return [...Array(12)].map((_, i) => ({
            id: i,
            left: `${Math.random() * 100}vw`,
            delay: `${i * 0.8}s`,
            duration: `${Math.random() * 5 + 7}s`,
            size: `${Math.random() * 20 + 15}px`,
        }));
    }, []);

    return (
        <div className="hearts-container">
            {hearts.map((heart) => (
                <div
                    key={heart.id}
                    className="floating-heart-css"
                    style={{
                        left: heart.left,
                        animationDelay: heart.delay,
                        animationDuration: heart.duration,
                        width: heart.size,
                        height: heart.size,
                        willChange: 'transform, opacity'
                    }}
                >
                    <HeartSVG className="heart-svg-asset" />
                </div>
            ))}
        </div>
    );
});

function App() {
    const [gateStarted, setGateStarted] = useState(false);
    const [started, setStarted] = useState(false);
    const [loading, setLoading] = useState(false);
    const [loadingProgress, setLoadingProgress] = useState(0);
    const enterAudioRef = useRef(null);
    const mainAudioRef = useRef(null);
    const { scrollYProgress } = useScroll();

    // High performance smooth scroll
    useEffect(() => {
        if (!started || loading) return;

        const lenis = new Lenis({
            duration: 1.0,
            easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
            direction: 'vertical',
            gestureDirection: 'vertical',
            smooth: true,
            mouseMultiplier: 1,
            smoothTouch: true,
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
    }, [started, loading]);

    // Visibility change handler for iPhone (Auto-pause/resume)
    useEffect(() => {
        const handleVisibilityChange = () => {
            if (document.hidden) {
                if (enterAudioRef.current) enterAudioRef.current.pause();
                if (mainAudioRef.current) mainAudioRef.current.pause();
            } else {
                // Resume appropriate audio if user has interacted
                if (started && !loading) {
                    mainAudioRef.current?.play().catch(e => console.log('Main audio resume failed', e));
                } else if (!started || loading) {
                    enterAudioRef.current?.play().catch(e => console.log('Enter audio resume failed', e));
                }
            }
        };

        document.addEventListener('visibilitychange', handleVisibilityChange);
        return () => document.removeEventListener('visibilitychange', handleVisibilityChange);
    }, [started, loading]);

    const fadeOutAudio = (audioElement, duration = 1500) => {
        if (!audioElement) return Promise.resolve();
        const startVolume = audioElement.volume;
        const speed = 0.05;
        const interval = duration / (startVolume / speed);

        return new Promise((resolve) => {
            const fade = setInterval(() => {
                if (audioElement.volume > speed) {
                    audioElement.volume -= speed;
                } else {
                    audioElement.volume = 0;
                    audioElement.pause();
                    clearInterval(fade);
                    resolve();
                }
            }, interval);
        });
    };

    const handleEnter = async () => {
        setLoading(true);
        setLoadingProgress(0);

        const duration = 4000; // 4 seconds total
        const startTime = performance.now();

        const updateProgress = (currentTime) => {
            const elapsed = currentTime - startTime;
            const progress = Math.min((elapsed / duration) * 100, 100);

            setLoadingProgress(progress);

            if (progress < 100) {
                requestAnimationFrame(updateProgress);
            } else {
                // Ensure Track 1 is fully silent and paused at 100
                if (enterAudioRef.current) {
                    enterAudioRef.current.volume = 0;
                    enterAudioRef.current.pause();
                }

                // Proceed immediately to Main Page reveal
                setLoading(false);
                setStarted(true);

                if (mainAudioRef.current) {
                    mainAudioRef.current.volume = 0;
                    mainAudioRef.current.play().then(() => {
                        // Track 2 (Main): Snappy fade volume to 1.0 (Approx 0.5s total)
                        let vol = 0;
                        const fadeIn = setInterval(() => {
                            if (vol < 0.9) {
                                vol += 0.1;
                                mainAudioRef.current.volume = vol;
                            } else {
                                mainAudioRef.current.volume = 1;
                                clearInterval(fadeIn);
                            }
                        }, 50);
                    }).catch(err => console.log('Main audio play failed:', err));
                }
            }
        };

        requestAnimationFrame(updateProgress);
    };

    const handleStart = () => {
        // Enforce state sanity
        setLoading(false);
        setGateStarted(true);
        if (enterAudioRef.current) {
            enterAudioRef.current.play().catch(e => console.log('Audio play failed:', e));
        }
    };

    return (
        <>
            <div className="background-overlay" />

            <audio ref={enterAudioRef} loop>
                <source src="/background-audio/Phenergan Pt 2..mp3" type="audio/mpeg" />
            </audio>

            <audio ref={mainAudioRef} loop>
                <source src="/background-audio/Lil Yachty - drive ME crazy! (Official Audio).mp3" type="audio/mpeg" />
            </audio>

            <AnimatePresence mode="wait">
                {!gateStarted ? (
                    <InitialGate key="gate" onStart={handleStart} />
                ) : (gateStarted && !loading && !started) ? (
                    <HeroScreen key="hero" onEnter={handleEnter} />
                ) : loading ? (
                    <LoadingScreen key="loading" progress={loadingProgress} />
                ) : null}
            </AnimatePresence>

            {started && !loading && gateStarted && (
                <div className="scroll-container main-page-mask">
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

// Initial landing screen to solve auto-play
function InitialGate({ onStart }) {
    const [showElements, setShowElements] = useState(false);

    useEffect(() => {
        const timer = setTimeout(() => setShowElements(true), 1200);
        return () => clearTimeout(timer);
    }, []);

    return (
        <motion.div
            className="initial-gate"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0, scale: 1.05 }}
            transition={{ duration: 1.2, ease: "easeInOut" }}
        >
            <div className="gate-content">
                <div className="gate-section">
                    <CinematicText className="gate-title glowing-text">
                        Sight and Sound
                    </CinematicText>
                </div>

                <div className="gate-section">
                    <AnimatePresence>
                        {showElements && (
                            <motion.button
                                initial={{ opacity: 0, y: 20 }}
                                animate={{
                                    opacity: 1,
                                    y: 0,
                                    scale: [1, 1.3, 1],
                                }}
                                transition={{
                                    opacity: { duration: 0.8, delay: 0 },
                                    y: { duration: 0.8, delay: 0 },
                                    scale: { duration: 1.5, repeat: Infinity, ease: "easeInOut", delay: 0 } // Increased speed to 1.5s
                                }}
                                className="gate-button"
                                onClick={onStart}
                                whileHover={{
                                    scale: 1.35,
                                    backgroundColor: "#ff1493",
                                    color: "#fff",
                                    boxShadow: "0 0 50px rgba(255, 20, 147, 1)"
                                }}
                                whileTap={{ scale: 0.95 }}
                            >
                                Start
                            </motion.button>
                        )}
                    </AnimatePresence>
                </div>

                <div className="gate-section">
                    <AnimatePresence>
                        {showElements && (
                            <motion.div
                                initial={{ opacity: 0, scale: 0.5 }}
                                animate={{
                                    opacity: 1,
                                }}
                                transition={{
                                    opacity: { duration: 1.5, delay: 1.2 }, // Delayed fade in
                                }}
                                className="heart-container"
                            >
                                <motion.div
                                    className="heart-glow-motion"
                                    animate={{
                                        scale: [2.0, 4.5, 2.0],
                                        opacity: [0.8, 1, 0.8],
                                    }}
                                    transition={{ duration: 1.5, repeat: Infinity, ease: "easeInOut", delay: 0 }} // Synced 1.5s
                                    style={{
                                        position: 'absolute',
                                        width: '100px',
                                        height: '100px',
                                        background: 'radial-gradient(circle, rgba(255, 20, 147, 0.9) 0%, rgba(139, 92, 246, 0.6) 40%, transparent 70%)',
                                        filter: 'blur(15px)',
                                        zIndex: 0,
                                        pointerEvents: 'none',
                                        mixBlendMode: 'screen'
                                    }}
                                />
                                <motion.div
                                    animate={{ scale: [2.2, 2.8, 2.2] }}
                                    transition={{ duration: 1.5, repeat: Infinity, ease: "easeInOut", delay: 0 }} // Synced 1.5s
                                    style={{ zIndex: 1 }}
                                >
                                    <HeartSVG className="heart" />
                                </motion.div>
                            </motion.div>
                        )}
                    </AnimatePresence>
                </div>
            </div>
        </motion.div>
    );
}

// Fullscreen Loading Screen component
function LoadingScreen({ progress }) {
    return (
        <motion.div
            className="loading-screen"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.8 }}
            style={{ zIndex: 30000 }}
        >
            <div className="loading-glass-overlay" />
            <FloatingHearts />

            <div className="loading-content">
                <CinematicText className="loading-percentage">
                    {Math.round(progress)}%
                </CinematicText>

                <div className="loading-bar-container">
                    <motion.div
                        className="loading-bar-fill"
                        initial={{ width: 0 }}
                        animate={{ width: `${progress}%` }}
                        transition={{ type: "spring", bounce: 0, duration: 0.4 }}
                    />
                </div>

                <div className="heart-container">
                    <motion.div
                        className="heart-glow-motion"
                        animate={{
                            scale: [1, 2.2, 1],
                            opacity: [0.7, 1, 0.7],
                        }}
                        transition={{ duration: 2.5, repeat: Infinity, ease: "easeInOut" }}
                        style={{
                            position: 'absolute',
                            width: '100px',
                            height: '100px',
                            background: 'radial-gradient(circle, rgba(255, 105, 180, 0.4) 0%, rgba(139, 92, 246, 0.2) 50%, transparent 70%)',
                            filter: 'blur(15px)',
                            zIndex: 0,
                            pointerEvents: 'none'
                        }}
                    />
                    <motion.div
                        animate={{ scale: [1, 1.25, 1] }}
                        transition={{ duration: 2.5, repeat: Infinity, ease: "easeInOut" }}
                        style={{ zIndex: 1 }}
                    >
                        <HeartSVG className="heart" />
                    </motion.div>
                </div>
            </div>
        </motion.div>
    );
}

// Animated Hero Screen Component with Slideshow & Floating Hearts
// Animated Hero Screen Component with Slideshow & Floating Hearts
function HeroScreen({ onEnter }) {
    const [currentImageIndex, setCurrentImageIndex] = useState(0);
    const [showButton, setShowButton] = useState(false);
    const [imagesLoaded, setImagesLoaded] = useState(false);

    const heroImages = useMemo(() => [
        '/images/272F9FA0-793B-4852-B23F-18D3D642AC95.JPEG',
        '/images/IMG_2184.JPEG',
        '/images/IMG_7715.jpg',
        '/images/IMG_9303.jpg',
        '/images/IMG_9507.jpg',
        '/images/IMG_9543.jpg',
    ], []);

    // Robust Image Preloading
    useEffect(() => {
        let loadedCount = 0;
        const totalImages = heroImages.length;

        heroImages.forEach((src) => {
            const img = new Image();
            img.src = src;
            img.onload = () => {
                loadedCount++;
                if (loadedCount === totalImages) {
                    setImagesLoaded(true);
                }
            };
            img.onerror = () => {
                // Even if error, count it so we don't hang
                loadedCount++;
                if (loadedCount === totalImages) setImagesLoaded(true);
            };
        });
    }, [heroImages]);

    // Slideshow effect
    useEffect(() => {
        if (!imagesLoaded) return;
        const interval = setInterval(() => {
            setCurrentImageIndex((prev) => (prev + 1) % heroImages.length);
        }, 4000);
        return () => clearInterval(interval);
    }, [imagesLoaded, heroImages.length]);

    // Show button after cinematic reveal
    useEffect(() => {
        const timer = setTimeout(() => setShowButton(true), 3500);
        return () => clearTimeout(timer);
    }, []);
    return (
        <motion.div
            className="hero"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0, scale: 1.05 }} // More dramatic exit
            transition={{ duration: 0.8, ease: "easeInOut" }}
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

            {/* Performance-optimized Floating Hearts */}
            <FloatingHearts />

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
                <CinematicText className="hero-title glowing-text">
                    {"Happy\nBirthday\nMi Vida"}
                </CinematicText>

                <CinematicText className="hero-subtitle glowing-subtitle" delay={1.5}>
                    A special message,<br />just for you
                </CinematicText>

                <div style={{ marginTop: '-70px', height: '80px', display: 'flex', alignItems: 'center', justifyContent: 'center', width: '100%', position: 'relative' }}>
                    <motion.button
                        id="enter-btn"
                        className={`enter-button`}
                        onClick={onEnter}
                        initial={{ opacity: 0 }}
                        animate={{
                            opacity: showButton ? 1 : 0,
                            scale: showButton ? [1, 1.05, 1] : 1,
                            boxShadow: showButton ? [
                                "0 0 20px rgba(255, 105, 180, 0.4)",
                                "0 0 40px rgba(189, 89, 242, 0.4)",
                                "0 0 20px rgba(255, 105, 180, 0.4)"
                            ] : "none",
                            pointerEvents: showButton ? 'auto' : 'none'
                        }}
                        transition={{
                            opacity: { duration: 1.5, ease: "easeOut" },
                            scale: { duration: 2, repeat: Infinity, ease: "easeInOut" },
                            boxShadow: { duration: 2, repeat: Infinity, ease: "easeInOut" }
                        }}
                        whileHover={{
                            scale: 1.12,
                            boxShadow: "0 0 50px rgba(255, 105, 180, 0.8)",
                            transition: { duration: 0.2 }
                        }}
                        whileTap={{ scale: 0.95 }}
                    >
                        <motion.span
                            animate={{
                                textShadow: [
                                    '0 0 10px rgba(255,255,255,0.8)',
                                    '0 0 20px rgba(255,255,255,1)',
                                    '0 0 10px rgba(255,255,255,0.8)'
                                ]
                            }}
                            transition={{ duration: 2, repeat: Infinity }}
                        >
                            Enter
                        </motion.span>
                    </motion.button>
                </div>
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
            <h2 className="gallery-title">
                Our Memories
            </h2>
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
                <h2 className="message-intro-title">
                    The First Paragraph I Ever Wrote To You...
                </h2>
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
                        preload="auto"
                        className="main-video"
                    >
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
            <h2 className="gallery-title">
                More of Us
            </h2>
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
            <h2 className="special-message-title">
                You truly are the best thing that ever happened to me,
                <br />
                Hoping today is as special as you
            </h2>

            <div className="heart-container">
                <motion.div
                    className="heart-glow-motion"
                    animate={{
                        scale: [1, 2.2, 1],
                        opacity: [0.7, 1, 0.7],
                    }}
                    transition={{ duration: 2.5, repeat: Infinity, ease: "easeInOut" }}
                    style={{
                        position: 'absolute',
                        width: '100px',
                        height: '100px',
                        background: 'radial-gradient(circle, rgba(255, 105, 180, 0.4) 0%, rgba(139, 92, 246, 0.2) 50%, transparent 70%)',
                        filter: 'blur(15px)',
                        zIndex: 0,
                        pointerEvents: 'none'
                    }}
                />
                <motion.div
                    animate={{ scale: [1, 1.25, 1] }}
                    transition={{ duration: 2.5, repeat: Infinity, ease: "easeInOut" }}
                    style={{ zIndex: 1 }}
                >
                    <HeartSVG className="heart" />
                </motion.div>
            </div>
            <p className="footer-text">Made with love, Bubby</p>
        </footer>
    );
}

export default App;
