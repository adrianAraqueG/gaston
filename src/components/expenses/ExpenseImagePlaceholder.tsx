interface ExpenseImagePlaceholderProps {
  className?: string;
  size?: 'small' | 'medium' | 'large';
}

export function ExpenseImagePlaceholder({ 
  className = '', 
  size = 'medium' 
}: ExpenseImagePlaceholderProps) {
  const sizeClasses = {
    small: 'w-16 h-16',
    medium: 'w-24 h-24',
    large: 'w-48 h-48',
  };

  return (
    <div
      className={`
        ${sizeClasses[size]}
        ${className}
        border-2 border-dashed border-gray-300
        rounded-lg
        bg-gray-50
        flex flex-col items-center justify-center
        text-gray-400
        relative
        overflow-hidden
      `}
      role="img"
      aria-label="Sin imagen"
    >
      {/* Líneas punteadas tipo ticket en los bordes */}
      <div className="absolute top-0 left-0 right-0 h-1 border-t-2 border-dashed border-gray-300"></div>
      <div className="absolute bottom-0 left-0 right-0 h-1 border-b-2 border-dashed border-gray-300"></div>
      
      {/* Contenido central */}
      <div className="flex flex-col items-center justify-center z-10">
        <svg
          className="w-6 h-6 mb-1"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
          xmlns="http://www.w3.org/2000/svg"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"
          />
        </svg>
        <span className="text-xs font-medium text-center px-2">
          Sin imagen
        </span>
      </div>
    </div>
  );
}

