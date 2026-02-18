export function Alert({ 
  type = 'info', 
  message, 
  onClose 
}: { 
  type?: 'success' | 'error' | 'info' | 'warning'; 
  message: string;
  onClose?: () => void;
}) {
  const colors = {
    success: 'bg-green-50 text-green-800 border-green-200',
    error: 'bg-red-50 text-red-800 border-red-200',
    info: 'bg-blue-50 text-blue-800 border-blue-200',
    warning: 'bg-yellow-50 text-yellow-800 border-yellow-200',
  };

  return (
    <div className={`border rounded-lg p-4 flex items-center justify-between ${colors[type]}`}>
      <p>{message}</p>
      {onClose && (
        <button onClick={onClose} className="text-xl hover:opacity-50">
          ×
        </button>
      )}
    </div>
  );
}
