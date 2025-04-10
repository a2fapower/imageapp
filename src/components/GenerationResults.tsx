import React, { useState } from 'react';
import Image from 'next/image';
import { useTranslation } from '@/lib/i18n';
import { 
  FlagIcon, 
  XMarkIcon,
  ArrowDownTrayIcon, 
  HandThumbUpIcon,
  HandThumbDownIcon,
  HandThumbUpIcon as HandThumbUpSolidIcon, 
  HandThumbDownIcon as HandThumbDownSolidIcon 
} from '@heroicons/react/24/solid';
import { toast } from 'react-hot-toast';

interface GenerationResultsProps {
  prompt: string;
  imageUrls: string[];
  onSelectImage: (url: string) => void;
  onGoBack: () => void;
  isVisible: boolean;
}

const GenerationResults: React.FC<GenerationResultsProps> = ({
  prompt,
  imageUrls,
  onSelectImage,
  onGoBack,
  isVisible,
}) => {
  const { t } = useTranslation();
  const [viewingImage, setViewingImage] = useState<string | null>(null);
  // 添加状态来跟踪每张图片的点赞/差评状态
  const [imageReactions, setImageReactions] = useState<Record<string, { liked: boolean, disliked: boolean }>>({});

  if (!isVisible || imageUrls.length === 0) return null;

  const handleImageClick = (url: string) => {
    // 恢复为查看大图功能
    setViewingImage(url);
  };

  const closeImageView = () => {
    setViewingImage(null);
  };

  // 下载图片
  const downloadImage = async (url: string, e: React.MouseEvent) => {
    e.stopPropagation(); // 阻止事件冒泡
    try {
      const response = await fetch(url);
      const blob = await response.blob();
      const objectUrl = URL.createObjectURL(blob);
      
      const link = document.createElement('a');
      link.href = objectUrl;
      link.download = `kirami-${Date.now()}.jpg`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      URL.revokeObjectURL(objectUrl);
      
      toast.success(t('download') + ' ✓');
    } catch (error) {
      console.error('Error downloading image:', error);
      toast.error(t('download') + ' ✗');
    }
  };

  // 点赞
  const handleThumbsUp = (url: string, e: React.MouseEvent) => {
    e.stopPropagation(); // 阻止事件冒泡
    
    setImageReactions(prev => {
      const currentState = prev[url] || { liked: false, disliked: false };
      return {
        ...prev,
        [url]: {
          liked: !currentState.liked, // 切换点赞状态
          disliked: false // 取消差评状态
        }
      };
    });
    
    // 这里可以添加实际的点赞逻辑，如发送到服务器等
  };

  // 差评
  const handleThumbsDown = (url: string, e: React.MouseEvent) => {
    e.stopPropagation(); // 阻止事件冒泡
    
    setImageReactions(prev => {
      const currentState = prev[url] || { liked: false, disliked: false };
      return {
        ...prev,
        [url]: {
          liked: false, // 取消点赞状态
          disliked: !currentState.disliked // 切换差评状态
        }
      };
    });
    
    // 这里可以添加实际的差评逻辑，如发送到服务器等
  };

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
              className={`group relative rounded-lg overflow-hidden border border-gray-200 shadow-sm hover:shadow-md transition-shadow ${
                imageUrls[0].includes('size=1792x1024') ? 'aspect-[16/9] w-full' : 
                imageUrls[0].includes('size=1024x1792') ? 'aspect-[9/16] w-[60%]' : 
                'aspect-square w-full'
              }`}
            >
              {/* 图片 */}
              <div
                className="absolute inset-0 cursor-pointer"
                onClick={() => handleImageClick(imageUrls[0])}
              >
                <Image
                  src={imageUrls[0]}
                  alt={`${prompt}`}
                  fill
                  className="object-cover"
                  priority
                />
              </div>
              
              {/* 底部操作栏 - 鼠标悬停时显示，向下移动 */}
              <div className="absolute bottom-4 right-2 flex gap-2 opacity-0 group-hover:opacity-100 transition-opacity duration-200">
                {/* 下载按钮 */}
                <button 
                  onClick={(e) => downloadImage(imageUrls[0], e)}
                  className="text-white hover:text-gray-200 transition-colors bg-white/30 p-1.5 rounded-full backdrop-blur-sm"
                  title={t('download') as string}
                >
                  <ArrowDownTrayIcon className="w-5 h-5" />
                </button>
                
                {/* 点赞按钮 */}
                <button 
                  onClick={(e) => handleThumbsUp(imageUrls[0], e)}
                  className={`transition-colors p-1.5 rounded-full backdrop-blur-sm ${imageReactions[imageUrls[0]]?.liked ? 'text-green-500 bg-white/30' : 'text-white hover:text-gray-200 bg-white/30'}`}
                  title={t('thumbsUp') as string}
                >
                  {imageReactions[imageUrls[0]]?.liked ? 
                    <HandThumbUpSolidIcon className="w-5 h-5" /> : 
                    <HandThumbUpIcon className="w-5 h-5" />
                  }
                </button>
                
                {/* 差评按钮 */}
                <button 
                  onClick={(e) => handleThumbsDown(imageUrls[0], e)}
                  className={`transition-colors p-1.5 rounded-full backdrop-blur-sm ${imageReactions[imageUrls[0]]?.disliked ? 'text-red-500 bg-white/30' : 'text-white hover:text-gray-200 bg-white/30'}`}
                  title={t('thumbsDown') as string}
                >
                  {imageReactions[imageUrls[0]]?.disliked ? 
                    <HandThumbDownSolidIcon className="w-5 h-5" /> : 
                    <HandThumbDownIcon className="w-5 h-5" />
                  }
                </button>
              </div>
            </div>
          </div>
          
          <div className="border-2 border-[#8B5CF6] rounded-lg p-4 mb-3 bg-white max-w-md mx-auto w-full">
            <p className="text-gray-700">{prompt}</p>
          </div>
        </div>
        
        <div className="px-4 pb-12 max-w-md mx-auto w-full">
          <div className="flex flex-col w-full space-y-4">
            <button
              onClick={onGoBack}
              className="w-full py-3.5 bg-indigo-600 hover:bg-indigo-700 text-white font-medium rounded-lg flex items-center justify-center gap-2 transition-colors"
            >
              {t('goBack')}
            </button>
            
            <div className="flex items-center gap-2 py-2 px-4 rounded-md bg-gray-100 border border-gray-200 shadow-sm">
              <FlagIcon className="w-5 h-5 text-gray-500 flex-shrink-0" />
              <p className="text-xs text-gray-600">
                {t('aiDisclaimer')}
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* 图像查看模态框 - 修改背景为浅色 */}
      {viewingImage && (
        <div 
          className="fixed inset-0 bg-white/90 z-[100] flex items-center justify-center"
          onClick={closeImageView}
        >
          <div 
            className="relative max-w-[90vw] max-h-[90vh] p-2 group"
            onClick={(e) => e.stopPropagation()}
          >
            <button 
              onClick={closeImageView}
              className="absolute top-2 right-2 bg-gray-200 text-gray-700 p-2 rounded-full hover:bg-gray-300 z-10"
            >
              <XMarkIcon className="w-6 h-6" />
            </button>
            
            <img
              src={viewingImage}
              alt={prompt}
              className="max-w-full max-h-[80vh] object-contain rounded-lg"
            />
            
            {/* 大图底部操作栏 - 鼠标悬停在图片区域时显示，向下移动 */}
            <div className="absolute bottom-8 right-4 flex bg-white/70 p-2 rounded-full gap-3 shadow-md backdrop-blur-sm opacity-0 group-hover:opacity-100 transition-opacity duration-200">
              {/* 保存按钮 */}
              <button 
                onClick={(e) => {
                  e.stopPropagation();
                  closeImageView();
                  onSelectImage(viewingImage);
                }}
                className="text-gray-700 hover:text-gray-900 bg-green-100 p-1.5 rounded-full"
                title="Save"
              >
                <svg xmlns="http://www.w3.org/2000/svg" className="w-5 h-5" viewBox="0 0 20 20" fill="currentColor">
                  <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                </svg>
              </button>
              
              {/* 查看大图时也根据状态显示对应的图标 */}
              {(() => {
                const reaction = imageReactions[viewingImage] || { liked: false, disliked: false };
                return (
                  <>
                    <button 
                      onClick={(e) => {
                        e.stopPropagation();
                        downloadImage(viewingImage, e);
                      }}
                      className="text-gray-700 hover:text-gray-900"
                      title={t('download') as string}
                    >
                      <ArrowDownTrayIcon className="w-5 h-5" />
                    </button>
                    
                    <button 
                      onClick={(e) => {
                        e.stopPropagation();
                        handleThumbsUp(viewingImage, e);
                      }}
                      className={`transition-colors ${reaction.liked ? 'text-green-500' : 'text-gray-700 hover:text-gray-900'}`}
                      title={t('thumbsUp') as string}
                    >
                      {reaction.liked ? 
                        <HandThumbUpSolidIcon className="w-5 h-5" /> : 
                        <HandThumbUpIcon className="w-5 h-5" />
                      }
                    </button>
                    
                    <button 
                      onClick={(e) => {
                        e.stopPropagation();
                        handleThumbsDown(viewingImage, e);
                      }}
                      className={`transition-colors ${reaction.disliked ? 'text-red-500' : 'text-gray-700 hover:text-gray-900'}`}
                      title={t('thumbsDown') as string}
                    >
                      {reaction.disliked ? 
                        <HandThumbDownSolidIcon className="w-5 h-5" /> : 
                        <HandThumbDownIcon className="w-5 h-5" />
                      }
                    </button>
                  </>
                );
              })()}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default GenerationResults; 