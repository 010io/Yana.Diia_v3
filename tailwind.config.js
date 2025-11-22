/** @type {import('tailwindcss').Config} */
module.exports = {
    content: [
        './pages/**/*.{js,ts,jsx,tsx,mdx}',
        './components/**/*.{js,ts,jsx,tsx,mdx}',
        './app/**/*.{js,ts,jsx,tsx,mdx}',
    ],
    theme: {
        extend: {
            colors: {
                // Diia Design System colors
                'diia-black': '#000000',
                'diia-white': '#ffffff',
                'diia-blue': '#67C3F3',
            },
            fontFamily: {
                'e-ukraine': ['e-Ukraine', 'Inter', 'sans-serif'],
            },
        },
    },
    plugins: [],
}
