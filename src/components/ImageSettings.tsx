import React from 'react';
import { useTranslation } from '@/lib/i18n';

export type ImageSize = '1024x1024' | '1024x1792' | '1792x1024';

interface ImageSettingsProps {
  size: ImageSize;
  setSize: (size: ImageSize) => void;
  simplified?: boolean;
}

const ImageSettings: React.FC<ImageSettingsProps> = ({ size, setSize, simplified = false }) => {
  const { t } = useTranslation();

  return (
    <div>
      {!simplified && <h3 className="font-medium mb-4 text-lg">{t('settings')}</h3>}
      <div className="flex gap-3 justify-center">
        <button 
          className={`px-3 py-2 rounded-full flex items-center ${
            size === '1024x1024' 
              ? 'bg-indigo-600 text-white' 
              : 'bg-gray-200 text-gray-700'
          } transition-all duration-200 hover:scale-105`}
          onClick={() => setSize('1024x1024')}
          aria-label="Square 1:1"
        >
          <div className="w-5 h-5 border-2 border-current rounded-sm mr-2"></div>
          <span className="text-sm">1:1</span>
        </button>
        
        <button 
          className={`px-3 py-2 rounded-full flex items-center ${
            size === '1792x1024' 
              ? 'bg-indigo-600 text-white' 
              : 'bg-gray-200 text-gray-700'
          } transition-all duration-200 hover:scale-105`}
          onClick={() => setSize('1792x1024')}
          aria-label="Landscape 16:9"
        >
          <div className="w-7 h-4 border-2 border-current rounded-sm mr-2"></div>
          <span className="text-sm">16:9</span>
        </button>
        
        <button 
          className={`px-3 py-2 rounded-full flex items-center ${
            size === '1024x1792' 
              ? 'bg-indigo-600 text-white' 
              : 'bg-gray-200 text-gray-700'
          } transition-all duration-200 hover:scale-105`}
          onClick={() => setSize('1024x1792')}
          aria-label="Portrait 9:16"
        >
          <div className="w-4 h-7 border-2 border-current rounded-sm mr-2"></div>
          <span className="text-sm">9:16</span>
        </button>
      </div>
    </div>
  );
};

export default ImageSettings;
