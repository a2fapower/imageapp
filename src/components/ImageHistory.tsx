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

// 辅助函数：根据尺寸参数检测图片比例
const detectImageRatio = (url: string, size: string): '16:9' | '9:16' | '1:1' => {
  if (size === '1792x1024') {
    return '16:9';
  } else if (size === '1024x1792') {
    return '9:16';
  } else {
    return '1:1';
  }
};

interface ImageHistoryProps {
  history: HistoryItem[];
  onSelect: (item: HistoryItem) => void;
  onClear: () => void;
}

const ImageHistory: React.FC<ImageHistoryProps> = ({ history, onSelect, onClear }) => {
  const { t } = useTranslation();
  
  if (history.length === 0) {
    return (
      <div className="mb-8">
        <div className="text-slate-500 text-sm p-4 bg-gray-50 rounded-lg flex items-center justify-center h-32 border border-gray-200">
          {t('noImages')}
        </div>
      </div>
    );
  }

  return (
    <div className="mb-8">
      <div className="flex justify-between items-center mb-4">
        <button 
          onClick={onClear}
          className="text-xs flex items-center gap-1 text-red-500 hover:text-red-600 hover:scale-105 transition-all duration-200 bg-gray-50 px-3 py-1.5 rounded-full"
          aria-label="Clear all"
        >
          <TrashIcon className="h-4 w-4" />
          <span>{t('clearAll')}</span>
        </button>
      </div>
      <div className="grid grid-cols-2 gap-2">
        {history.map((item) => {
          const ratio = detectImageRatio(item.imageUrl, item.size);
          return (
            <div 
              key={item.id} 
              className="border border-gray-200 rounded-lg cursor-pointer hover:shadow-md transition-all duration-300 overflow-hidden"
              onClick={() => onSelect(item)}
            >
              <div className={`relative ${
                ratio === '16:9' ? 'aspect-[16/9]' : 
                ratio === '9:16' ? 'aspect-[9/16]' : 
                'aspect-square'
              }`}>
                <Image
                  src={item.imageUrl}
                  alt={item.prompt}
                  fill
                  className="object-cover"
                  unoptimized={true}
                />
                
                {/* 比例指示器 - 显示在左上角 */}
                <div className="absolute top-2 left-2 bg-black/50 text-white text-xs px-2 py-1 rounded-md backdrop-blur-sm">
                  {ratio}
                </div>
                
                {/* 渐变遮罩 */}
                <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-end">
                  <p className="px-3 py-2 text-white text-xs truncate w-full">
                    {item.prompt}
                  </p>
                </div>
              </div>
              <div className="p-3 bg-white">
                <p className="text-sm text-gray-700 line-clamp-2 h-10">
                  {item.prompt}
                </p>
                <p className="text-xs text-slate-500 mt-1">
                  {new Date(item.timestamp).toLocaleString(undefined, {
                    month: 'short',
                    day: 'numeric',
                    hour: '2-digit',
                    minute: '2-digit'
                  })}
                </p>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default ImageHistory; 