/** @type {import('tailwindcss').Config} */
export default {
    content: [
        "./index.html",
        "./src/**/*.{js,ts,jsx,tsx}",
    ],
    theme: {
        extend: {
            colors: {
                'dark': '#050505',
                'accent-pink': '#ff69b4',
                'accent-purple': '#8b5cf6',
            },
            fontFamily: {
                serif: ['Playfair Display', 'serif'],
                sans: ['Inter', 'sans-serif'],
            },
            animation: {
                'pulse-heart': 'pulseHeart 1.5s ease-in-out infinite',
            },
            keyframes: {
                pulseHeart: {
                    '0%, 100%': {
                        transform: 'scale(1)',
                        opacity: '1',
                    },
                    '50%': {
                        transform: 'scale(1.15)',
                        opacity: '0.8',
                    },
                },
            },
            backdropBlur: {
                'md': '12px',
            },
        },
    },
    plugins: [],
}
