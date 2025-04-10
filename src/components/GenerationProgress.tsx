import React, { useState, useEffect } from 'react';
import { useTranslation } from '@/lib/i18n';
import { ImageSize } from '@/components/ImageSettings';

interface GenerationProgressProps {
  prompt: string;
  onCancel: () => void;
  isVisible: boolean;
  size?: ImageSize;
}

const GenerationProgress: React.FC<GenerationProgressProps> = ({ 
  prompt, 
  onCancel, 
  isVisible,
  size = '1024x1024'
}) => {
  const { t } = useTranslation();
  const [progressWidth, setProgressWidth] = useState(10);
  
  useEffect(() => {
    if (!isVisible) {
      setProgressWidth(10);
      return;
    }
    
    // 模拟进度增长
    const interval = setInterval(() => {
      setProgressWidth(prev => {
        // 缓慢增长到70%，然后更慢增长到95%
        if (prev < 70) {
          return prev + Math.random() * 5;
        } else if (prev < 95) {
          return prev + Math.random() * 0.5;
        }
        return prev;
      });
    }, 300);
    
    return () => clearInterval(interval);
  }, [isVisible]);
  
  if (!isVisible) return null;
  
  return (
    <div className="fixed inset-0 bg-white z-50 flex flex-col">
      <div className="p-4 border-b border-gray-200 flex justify-between items-center">
        <h2 className="text-xl font-bold gradient-text">Kirami</h2>
        <button className="p-2 text-gray-500">•••</button>
      </div>

      <div className="flex flex-col h-[calc(100%-60px)] overflow-y-auto">
        <div className="p-4 pt-2 pb-0 max-w-md mx-auto w-full">
          <div className="w-full mb-4 flex justify-center">
            <div 
              className={`bg-gray-100 rounded-lg animate-pulse shadow-sm ${
                size === '1792x1024' ? 'aspect-[16/9] w-full' : 
                size === '1024x1792' ? 'aspect-[9/16] w-[60%]' : 
                'aspect-square w-full'
              }`}
            ></div>
          </div>
          
          <div className="border-2 border-[#8B5CF6] rounded-lg p-4 mb-3 bg-white max-w-md mx-auto w-full">
            <p className="text-gray-700">{prompt}</p>
          </div>
        </div>
        
        <div className="px-4 pb-10 max-w-md mx-auto w-full">
          {/* 彩色渐变进度条 */}
          <div className="w-full mb-6 bg-gray-200 rounded-full h-5">
            <div 
              className="h-5 rounded-full transition-all duration-300"
              style={{ 
                width: `${progressWidth}%`,
                background: 'linear-gradient(to right, #4F46E5, #8B5CF6, #EC4899)'
              }}
            ></div>
          </div>
          
          <button 
            onClick={onCancel}
            className="w-full py-3.5 text-gray-700 font-bold rounded-lg border border-gray-200 hover:bg-gray-100 transition-colors"
          >
            {t('cancel')}
          </button>
        </div>
      </div>
    </div>
  );
};

export default GenerationProgress; 