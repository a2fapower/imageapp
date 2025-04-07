import React from 'react';
import { useTranslation } from '@/lib/i18n';
import { 
  ViewfinderCircleIcon,
  PhotoIcon,
  DocumentIcon
} from '@heroicons/react/24/outline';

export type ImageSize = '1024x1024' | '1024x1792' | '1792x1024';

interface ImageSettingsProps {
  size: ImageSize;
  setSize: (size: ImageSize) => void;
  simplified?: boolean;
}

const ImageSettings: React.FC<ImageSettingsProps> = ({ size, setSize, simplified = false }) => {
  const { t } = useTranslation();

  const buttonClasses = simplified 
    ? 'p-3 min-w-[90px] rounded-xl transition-all duration-300 flex flex-col items-center justify-center'
    : `setting-button flex flex-col items-center justify-center py-3`;

  const activeClass = simplified
    ? 'bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500 text-white shadow-lg transform scale-105'
    : 'setting-button-active';
    
  const inactiveClass = simplified
    ? 'bg-slate-100/80 dark:bg-slate-800/70 hover:bg-slate-200 dark:hover:bg-slate-700/90 hover:scale-105 border border-slate-200 dark:border-slate-700'
    : 'setting-button-inactive';

  return (
    <div>
      {!simplified && <h3 className="font-medium mb-4 text-lg">{t('settings')}</h3>}
      <div className={`${simplified ? 'flex gap-8 md:gap-12' : 'grid grid-cols-3 gap-3'}`}>
        <button
          className={`${buttonClasses} ${size === '1024x1024' ? activeClass : inactiveClass}`}
          onClick={() => setSize('1024x1024')}
        >
          <ViewfinderCircleIcon className={`${simplified ? 'h-6 w-6 mb-1' : 'h-6 w-6 mb-1'}`} />
          <span className={`${simplified ? 'font-medium text-xs' : 'text-xs'}`}>(1:1)</span>
        </button>
        <button
          className={`${buttonClasses} ${size === '1024x1792' ? activeClass : inactiveClass}`}
          onClick={() => setSize('1024x1792')}
        >
          <DocumentIcon className={`${simplified ? 'h-6 w-6 mb-1' : 'h-6 w-6 mb-1'}`} />
          <span className={`${simplified ? 'font-medium text-xs' : 'text-xs'}`}>(9:16)</span>
        </button>
        <button
          className={`${buttonClasses} ${size === '1792x1024' ? activeClass : inactiveClass}`}
          onClick={() => setSize('1792x1024')}
        >
          <PhotoIcon className={`${simplified ? 'h-6 w-6 mb-1' : 'h-6 w-6 mb-1'}`} />
          <span className={`${simplified ? 'font-medium text-xs' : 'text-xs'}`}>(16:9)</span>
        </button>
      </div>
    </div>
  );
};

export default ImageSettings; 