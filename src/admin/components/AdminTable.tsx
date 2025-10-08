import React, { useState, useRef, useEffect } from 'react';
import { ChevronDown } from 'lucide-react';

interface AdminTableProps {
  headers: React.ReactNode[];
  children: React.ReactNode; // tbody rows
  loading?: boolean;
  onOpenFilters?: () => void;
  filtersContent?: React.ReactNode; // Contenu du menu de filtres
  footerLeft?: React.ReactNode;
  bodyHeightClass?: string; // Tailwind class to control body fixed height
  wrapperMaxHeightClass?: string; // Ensures the table never exceeds viewport
}

const AdminTable: React.FC<AdminTableProps> = ({ headers, children, loading, onOpenFilters, filtersContent, footerLeft, bodyHeightClass, wrapperMaxHeightClass }) => {
  const [isFiltersOpen, setIsFiltersOpen] = useState(false);
  const filtersRef = useRef<HTMLDivElement>(null);

  // Fermer le menu si on clique en dehors
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (filtersRef.current && !filtersRef.current.contains(event.target as Node)) {
        setIsFiltersOpen(false);
      }
    };

    if (isFiltersOpen) {
      document.addEventListener('mousedown', handleClickOutside);
    }

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [isFiltersOpen]);

  const handleFiltersClick = () => {
    if (filtersContent) {
      setIsFiltersOpen(!isFiltersOpen);
    } else if (onOpenFilters) {
      onOpenFilters();
    }
  };

  return (
    <div className={`admin-card overflow-hidden flex flex-col ${
      wrapperMaxHeightClass ||
      'max-h-[calc(100vh-180px)] sm:max-h-[calc(100vh-200px)] md:max-h-[calc(100vh-220px)] lg:max-h-[calc(100vh-240px)]'
    }`}>
      <div className={`overflow-x-auto overflow-y-auto admin-table-container ${
        bodyHeightClass ||
        'max-h-[calc(100vh-220px)] sm:max-h-[calc(100vh-240px)] md:max-h-[calc(100vh-280px)] lg:max-h-[calc(100vh-320px)]'
      }`}> 
        <table className="admin-table w-full">
          <thead className="sticky top-0 z-10 bg-gray-800/40 backdrop-blur">
            <tr>
              {headers.map((h, i) => (
                <th key={i}>{h}</th>
              ))}
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-200">
            {loading ? (
              Array.from({ length: 8 }).map((_, rowIdx) => (
                <tr key={`skeleton-${rowIdx}`} className="hover:bg-white/5">
                  {Array.from({ length: headers.length }).map((__, colIdx) => (
                    <td key={colIdx} className="px-4 py-4">
                      <div className={`h-3 rounded animate-pulse ${colIdx === 0 ? 'w-40' : colIdx === 3 ? 'w-24' : 'w-20'} bg-white/10`} />
                      {colIdx === 0 && (
                        <div className="mt-2 h-2 w-24 bg-white/5 rounded animate-pulse" />
                      )}
                    </td>
                  ))}
                </tr>
              ))
            ) : (
              children
            )}
          </tbody>
        </table>
      </div>

      {/* Bas de page du tableau */}
      {(onOpenFilters || filtersContent || footerLeft) && (
        <div className="flex items-center justify-between border-t border-white/10 bg-white/5 px-3 py-2 relative">
          <div className="text-sm text-white/70">
            {footerLeft}
          </div>
          {(onOpenFilters || filtersContent) && (
            <div className="relative" ref={filtersRef}>
              <button
                onClick={handleFiltersClick}
                className="px-4 py-2 text-sm font-medium bg-white/10 text-white rounded-lg hover:bg-white/20 border border-white/20 flex items-center space-x-2"
              >
                <span>Filtres</span>
                {filtersContent && <ChevronDown className={`w-4 h-4 transition-transform ${isFiltersOpen ? 'rotate-180' : ''}`} />}
              </button>
              {isFiltersOpen && filtersContent && (
                <div className="absolute right-0 bottom-full mb-2 bg-gray-800 border border-white/20 rounded-lg shadow-lg p-4 min-w-[300px] z-50">
                  {filtersContent}
                </div>
              )}
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default AdminTable;


