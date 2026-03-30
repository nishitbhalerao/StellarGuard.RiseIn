/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        // Professional color palette
        'primary-blue': '#2563eb',
        'primary-blue-dark': '#1d4ed8',
        'secondary-blue': '#3b82f6',
        'light-blue': '#60a5fa',
        'accent-green': '#10b981',
        'accent-green-dark': '#059669',
        'success-green': '#22c55e',
        'warning-orange': '#f59e0b',
        'error-red': '#ef4444',
        'neutral-gray': '#6b7280',
        'light-gray': '#f3f4f6',
        'dark-gray': '#374151',
        'white': '#ffffff',
        'off-white': '#fafafa',
      },
      backgroundImage: {
        // Professional gradients
        'gradient-primary': 'linear-gradient(135deg, #2563eb 0%, #3b82f6 50%, #60a5fa 100%)',
        'gradient-success': 'linear-gradient(135deg, #10b981 0%, #22c55e 100%)',
        'gradient-hero': 'linear-gradient(135deg, #ffffff 0%, #f0f9ff 50%, #e0f2fe 100%)',
        'gradient-card': 'linear-gradient(145deg, #ffffff, #f8fafc)',
        'gradient-button': 'linear-gradient(135deg, #2563eb, #3b82f6)',
        'gradient-button-hover': 'linear-gradient(135deg, #1d4ed8, #2563eb)',
        'gradient-button-success': 'linear-gradient(135deg, #10b981, #22c55e)',
        'gradient-button-success-hover': 'linear-gradient(135deg, #059669, #10b981)',
        'gradient-sidebar': 'linear-gradient(180deg, #f8fafc 0%, #f1f5f9 100%)',
        'gradient-header': 'linear-gradient(90deg, #ffffff 0%, #f8fafc 100%)',
      },
      boxShadow: {
        'soft': '0 2px 15px -3px rgba(0, 0, 0, 0.07), 0 10px 20px -2px rgba(0, 0, 0, 0.04)',
        'medium': '0 4px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04)',
        'large': '0 10px 40px -10px rgba(0, 0, 0, 0.1), 0 20px 25px -5px rgba(0, 0, 0, 0.04)',
        'blue': '0 4px 25px -5px rgba(37, 99, 235, 0.25)',
        'green': '0 4px 25px -5px rgba(16, 185, 129, 0.25)',
      },
      animation: {
        'fade-in': 'fadeIn 0.5s ease-in-out',
        'slide-up': 'slideUp 0.3s ease-out',
        'bounce-gentle': 'bounceGentle 2s infinite',
        'pulse-soft': 'pulseSoft 2s infinite',
      },
      keyframes: {
        fadeIn: {
          '0%': { opacity: '0', transform: 'translateY(10px)' },
          '100%': { opacity: '1', transform: 'translateY(0)' },
        },
        slideUp: {
          '0%': { opacity: '0', transform: 'translateY(20px)' },
          '100%': { opacity: '1', transform: 'translateY(0)' },
        },
        bounceGentle: {
          '0%, 100%': { transform: 'translateY(0)' },
          '50%': { transform: 'translateY(-5px)' },
        },
        pulseSoft: {
          '0%, 100%': { opacity: '1' },
          '50%': { opacity: '0.8' },
        },
      },
    },
  },
  plugins: [],
}
