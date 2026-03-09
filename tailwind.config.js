/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        'deep-space': '#0A0A0F',
        'midnight-navy': '#0D1B2A',
        'electric-blue': '#0EA5E9',
        'stellar-blue': '#38BDF8',
        'ice-white': '#F0F9FF',
      },
      backgroundImage: {
        'gradient-main': 'linear-gradient(135deg, #0A0A0F 0%, #0D1B2A 50%, #0A1628 100%)',
        'gradient-hero': 'radial-gradient(ellipse at top, rgba(14, 165, 233, 0.12) 0%, transparent 70%)',
        'gradient-card': 'linear-gradient(145deg, #0D1B2A, #111827)',
        'gradient-button': 'linear-gradient(135deg, #0EA5E9, #38BDF8)',
        'gradient-button-hover': 'linear-gradient(135deg, #38BDF8, #7DD3FC)',
        'gradient-danger': 'linear-gradient(135deg, #EF4444, #DC2626)',
        'gradient-warning': 'linear-gradient(135deg, #F59E0B, #D97706)',
        'gradient-success': 'linear-gradient(135deg, #10B981, #059669)',
      },
    },
  },
  plugins: [],
}
