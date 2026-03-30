import { CheckCircle, XCircle, Info, X } from 'lucide-react';

export default function Toast({ message, type = 'info', onClose }) {
  const icons = {
    success: <CheckCircle className="w-5 h-5 text-white" />,
    error: <XCircle className="w-5 h-5 text-white" />,
    info: <Info className="w-5 h-5 text-white" />
  };

  const bgColors = {
    success: 'bg-gradient-to-r from-green-500 to-green-600 shadow-lg',
    error: 'bg-red-500 shadow-lg',
    info: 'bg-gradient-to-r from-blue-600 to-blue-700 shadow-lg'
  };

  return (
    <div className={`${bgColors[type]} px-6 py-4 rounded-xl flex items-center space-x-3 min-w-[320px] animate-slide-up hover-lift`}>
      <div className="flex-shrink-0">
        {icons[type]}
      </div>
      <span className="flex-1 text-white font-medium">{message}</span>
      <button 
        onClick={onClose} 
        className="flex-shrink-0 text-white/80 hover:text-white transition-colors p-1 hover:bg-white/10 rounded"
      >
        <X className="w-4 h-4" />
      </button>
    </div>
  );
}
