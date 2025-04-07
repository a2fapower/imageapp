import React from 'react';
import Image from 'next/image';
import { ClockIcon, TrashIcon } from '@heroicons/react/24/outline';
import { useTranslation } from '@/lib/i18n';

export interface HistoryItem {
  id: string;
  prompt: string;
  imageUrl: string;
  timestamp: number;
  size: string;
}

interface ImageHistoryProps {
  history: HistoryItem[];
  onSelect: (item: HistoryItem) => void;
  onClear: () => void;
}

const ImageHistory: React.FC<ImageHistoryProps> = ({ history, onSelect, onClear }) => {
  const { t } = useTranslation();
  
  if (history.length === 0) {
    return (
      <div className="card p-6">
        <h3 className="text-xl font-medium mb-4 flex items-center">
          <ClockIcon className="h-5 w-5 mr-2 text-indigo-500" />
          {t('history')}
        </h3>
        <div className="text-slate-500 dark:text-slate-400 text-sm p-4 bg-gray-50 dark:bg-slate-800 rounded-lg flex items-center justify-center h-32">
          {t('noImages')}
        </div>
      </div>
    );
  }

  return (
    <div className="card p-6">
      <div className="flex justify-between items-center mb-4">
        <h3 className="text-xl font-medium flex items-center">
          <ClockIcon className="h-5 w-5 mr-2 text-indigo-500" />
          {t('history')}
        </h3>
        <button 
          onClick={onClear}
          className="text-xs flex items-center gap-1 text-red-500 hover:text-red-600 hover:scale-105 transition-all duration-200"
          aria-label={t('clearAll')}
        >
          <TrashIcon className="h-4 w-4" />
          <span>{t('clearAll')}</span>
        </button>
      </div>
      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
        {history.map((item) => (
          <div 
            key={item.id} 
            className="card cursor-pointer group hover:scale-105 hover:shadow-xl transition-all duration-300"
            onClick={() => onSelect(item)}
          >
            <div className="relative aspect-square">
              <Image
                src={item.imageUrl}
                alt={item.prompt}
                fill
                className="object-cover rounded-t-xl"
                sizes="(max-width: 768px) 100vw, 25vw"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-transparent to-transparent opacity-0 group-hover:opacity-100 rounded-t-xl transition-opacity duration-300 flex items-end">
                <p className="px-3 py-2 text-white text-xs truncate w-full">
                  {item.prompt}
                </p>
              </div>
            </div>
            <div className="p-2 bg-gray-50 dark:bg-slate-700/30 rounded-b-xl">
              <p className="text-xs text-slate-500 dark:text-slate-400">
                {new Date(item.timestamp).toLocaleString(undefined, {
                  month: 'short',
                  day: 'numeric',
                  hour: '2-digit',
                  minute: '2-digit'
                })}
              </p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default ImageHistory; 