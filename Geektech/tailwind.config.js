/** @type {import('tailwindcss').Config} */
module.exports = {
    content: [
        "./app/**/*.{js,ts,jsx,tsx,mdx}",
        "./pages/**/*.{js,ts,jsx,tsx,mdx}",
        "./components/**/*.{js,ts,jsx,tsx,mdx}",
        "./src/**/*.{js,ts,jsx,tsx,mdx}",
    ],
    theme: {
        extend: {
            colors: {
                'purple-primary': '#7000ff',
                'purple-hover': '#5a00d6',
                'neon-cyan': '#00f0ff',
                'neon-purple': '#bc13fe',
                'bg-main': '#0a0a0f',
                'bg-secondary': '#121218',
                'bg-card': 'rgba(255, 255, 255, 0.03)',
                'text-main': '#ffffff',
                'text-secondary': '#a0a0b0',
            },
        },
    },
    plugins: [],
}
