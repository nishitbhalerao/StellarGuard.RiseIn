import { CheckCircle, XCircle, Info, X } from 'lucide-react';

export default function Toast({ message, type = 'info', onClose }) {
  const icons = {
    success: <CheckCircle className="w-5 h-5 text-green-400" />,
    error: <XCircle className="w-5 h-5 text-red-400" />,
    info: <Info className="w-5 h-5 text-blue-400" />
  };

  const bgColors = {
    success: 'bg-gradient-success',
    error: 'bg-gradient-danger',
    info: 'bg-gradient-button'
  };

  return (
    <div className={`${bgColors[type]} px-4 py-3 rounded-lg shadow-lg flex items-center space-x-3 min-w-[300px] animate-fade-in`}>
      {icons[type]}
      <span className="flex-1 text-white text-sm">{message}</span>
      <button onClick={onClose} className="text-white/80 hover:text-white">
        <X className="w-4 h-4" />
      </button>
    </div>
  );
}
