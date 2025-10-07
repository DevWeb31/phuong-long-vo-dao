import React, { useState, useRef, useEffect } from 'react';
import { Plus } from 'lucide-react';

interface ActionItem {
  label: string;
  onClick: () => void;
}

interface PlusActionsMenuProps {
  actions: ActionItem[];
  buttonTitle?: string;
  buttonClassName?: string;
}

const PlusActionsMenu: React.FC<PlusActionsMenuProps> = ({ actions, buttonTitle, buttonClassName }) => {
  const [isOpen, setIsOpen] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);
  const hasActions = actions && actions.length > 0;

  // Fermer le menu si on clique en dehors
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };

    if (isOpen) {
      document.addEventListener('mousedown', handleClickOutside);
    }

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [isOpen]);

  const handleActionClick = (action: ActionItem) => {
    action.onClick();
    setIsOpen(false);
  };

  return (
    <div className="relative" ref={menuRef}>
      <button
        onClick={() => hasActions && setIsOpen(!isOpen)}
        disabled={!hasActions}
        className={`flex items-center space-x-2 px-4 py-2 rounded-lg font-medium transition-all duration-200 ${
          !hasActions
            ? 'bg-gray-600 text-gray-400 cursor-not-allowed opacity-50'
            : isOpen 
              ? 'bg-yellow-500 text-gray-900 shadow-lg scale-105' 
              : 'admin-button-primary'
        } ${buttonClassName || ''}`}
        title={hasActions ? (buttonTitle || 'Actions') : 'Aucune action disponible'}
      >
        <Plus className="w-4 h-4" />
      </button>
      {isOpen && (
        <div className="absolute left-0 top-full mt-2 w-56 bg-gray-800 rounded-lg shadow-lg transition-all duration-200 z-20 border border-white/10">
          <div className="py-2">
            {actions.map((action, index) => (
              <button
                key={index}
                onClick={() => handleActionClick(action)}
                className="block w-full text-left px-4 py-2 text-sm text-white hover:bg-gray-700"
              >
                {action.label}
              </button>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default PlusActionsMenu;


