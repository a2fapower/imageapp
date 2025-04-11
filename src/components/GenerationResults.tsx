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

// 辅助函数：根据URL或选择的尺寸检测图片比例
const detectImageRatio = (url: string): '16:9' | '9:16' | '1:1' => {
  // 匹配URL中的尺寸参数
  const landscapePattern = /size=1792x1024|&size=1792x1024/i;
  const portraitPattern = /size=1024x1792|&size=1024x1792/i;
  const squarePattern = /size=1024x1024|&size=1024x1024/i;
  
  // 检查URL中包含的尺寸信息
  if (landscapePattern.test(url)) {
    console.log('检测到16:9图片:', url);
    return '16:9';
  } else if (portraitPattern.test(url)) {
    console.log('检测到9:16图片:', url);
    return '9:16';
  } else if (squarePattern.test(url)) {
    console.log('检测到1:1图片:', url);
    return '1:1';
  }
  
  // 如果没有明确的尺寸参数，尝试从图片比例推断
  try {
    // 解析URL中的查询参数
    const urlObj = new URL(url);
    const sizeParam = urlObj.searchParams.get('size');
    
    if (sizeParam) {
      if (sizeParam === '1792x1024') {
        return '16:9';
      } else if (sizeParam === '1024x1792') {
        return '9:16';
      } else if (sizeParam === '1024x1024') {
        return '1:1';
      }
    }
  } catch (error) {
    console.error('URL解析错误:', error);
  }
  
  // 默认返回1:1
  return '1:1';
};

const GenerationResults: React.FC<GenerationResultsProps> = ({
  prompt,
  imageUrls,
  onSelectImage,
  onGoBack,
  isVisible,
}) => {
  const { t, locale } = useTranslation();
  const [viewingImage, setViewingImage] = useState<string | null>(null);
  // 添加状态来跟踪每张图片的点赞/差评状态
  const [imageReactions, setImageReactions] = useState<Record<string, { liked: boolean, disliked: boolean }>>({});

  if (!isVisible || imageUrls.length === 0) return null;
  
  // 检测主图片的比例
  const mainImageRatio = detectImageRatio(imageUrls[0]);
  console.log('主图片比例:', mainImageRatio, '图片URL:', imageUrls[0]);

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
      const toastId = toast.loading(t('downloadingImage'));
      
      // 使用后端API下载
      const response = await fetch('/api/download', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ imageUrl: url }),
      });
      
      if (!response.ok) {
        const errorText = await response.text();
        console.error('Download API error:', response.status, errorText);
        throw new Error(`Download failed: ${response.status}`);
      }
      
      // 检查响应类型
      const contentType = response.headers.get('content-type');
      if (contentType && contentType.includes('application/json')) {
        // 如果返回JSON，可能是错误
        const errorData = await response.json();
        throw new Error(errorData.error || 'Unknown error');
      }
      
      // 获取图像blob
      const blob = await response.blob();
      
      if (blob.size === 0) {
        throw new Error('Received empty image data');
      }
      
      // 创建一个blob URL
      const objectUrl = window.URL.createObjectURL(blob);
      
      // 创建一个临时链接元素
      const link = document.createElement('a');
      link.href = objectUrl;
      link.download = `kirami-${Date.now()}.png`;
      
      // 添加到DOM，点击并移除
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      
      // 释放blob URL
      window.URL.revokeObjectURL(objectUrl);
      
      toast.dismiss(toastId);
      toast.success(t('downloadSuccess'));
    } catch (error) {
      console.error('Error downloading image:', error);
      
      // 针对常见错误提供更具体的消息
      const errorMessage = error instanceof Error ? error.message : 'Unknown error';
      if (errorMessage.includes('Failed to fetch')) {
        toast.error(t('downloadErrorExpired'));
      } else if (errorMessage.includes('Network Error')) {
        toast.error(t('downloadErrorNetwork'));
      } else {
        toast.error(`${t('downloadError')}: ${errorMessage}`);
      }
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
            {/* 主图片容器 */}
            <div
              className="relative border border-gray-200 shadow-sm hover:shadow-md transition-shadow rounded-lg overflow-hidden"
            >
              {/* 根据比例包装图片 */}
              <div
                className={`group relative ${
                  mainImageRatio === '16:9' ? 'aspect-[16/9] w-full max-w-md' : 
                  mainImageRatio === '9:16' ? 'aspect-[9/16] w-[60%] max-w-[250px]' : 
                  'aspect-square w-full max-w-md'
                }`}
                data-ratio={mainImageRatio}
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
                    className="object-contain"
                    priority
                    unoptimized={true}
                    onLoad={(e) => {
                      // 图片加载后打印尺寸
                      const img = e.target as HTMLImageElement;
                      console.log('主图片加载完成，实际尺寸:', img.naturalWidth, 'x', img.naturalHeight);
                    }}
                  />
                </div>
                
                {/* 比例指示器 - 显示在左上角 */}
                <div className="absolute top-2 left-2 bg-black/50 text-white text-xs px-2 py-1 rounded-md backdrop-blur-sm z-10">
                  {mainImageRatio}
                </div>
                
                {/* 底部操作栏 - 鼠标悬停时显示，向下移动 */}
                <div className="absolute bottom-4 right-2 flex gap-2 opacity-0 group-hover:opacity-100 transition-opacity duration-200 z-10">
                  {/* 下载按钮 */}
                  <button 
                    onClick={(e) => downloadImage(imageUrls[0], e)}
                    className="text-white hover:text-gray-200 transition-colors bg-white/30 p-1.5 rounded-full backdrop-blur-sm"
                    title={t('download')}
                  >
                    <ArrowDownTrayIcon className="w-5 h-5" />
                  </button>
                  
                  {/* 点赞按钮 */}
                  <button 
                    onClick={(e) => handleThumbsUp(imageUrls[0], e)}
                    className={`transition-colors p-1.5 rounded-full backdrop-blur-sm ${imageReactions[imageUrls[0]]?.liked ? 'text-green-500 bg-white/30' : 'text-white hover:text-gray-200 bg-white/30'}`}
                    title={t('thumbsUp')}
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
                    title={t('thumbsDown')}
                  >
                    {imageReactions[imageUrls[0]]?.disliked ? 
                      <HandThumbDownSolidIcon className="w-5 h-5" /> : 
                      <HandThumbDownIcon className="w-5 h-5" />
                    }
                  </button>
                </div>
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
            
            {/* 保存提醒 */}
            <p className="text-sm text-gray-500 text-center mt-1">
              {locale === 'zh' ? 
                <>💬 图像生成后记得保存，资源有限，请节约使用～</> : 
                <>💬 Remember to save images after generation. Resources are limited, please use responsibly.</>
              }
            </p>
            
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
          {/* 移除容器的aspect-ratio限制，让图片自然显示 */}
          <div 
            className="relative p-4 flex items-center justify-center"
            onClick={(e) => e.stopPropagation()}
            style={{ width: '90vw', height: '90vh' }}
          >
            <button 
              onClick={closeImageView}
              className="absolute top-4 right-4 bg-gray-200 text-gray-700 p-2 rounded-full hover:bg-gray-300 z-10"
            >
              <XMarkIcon className="w-6 h-6" />
            </button>
            
            {/* 比例指示器 - 显示在左上角 */}
            <div className="absolute top-4 left-4 bg-black/50 text-white text-xs px-2 py-1 rounded-md backdrop-blur-sm z-10">
              {detectImageRatio(viewingImage)}
            </div>
            
            {/* 图片容器，使用CSS限制最大尺寸并保持比例 */}
            <div className={`relative max-w-full max-h-full ${
              detectImageRatio(viewingImage) === '16:9' ? 'aspect-[16/9]' : 
              detectImageRatio(viewingImage) === '9:16' ? 'aspect-[9/16]' : 
              'aspect-square'
            }`}>
              <img
                src={viewingImage}
                alt={prompt}
                className="w-full h-full object-contain rounded-lg"
                onLoad={(e) => {
                  // 图片加载后打印尺寸
                  const img = e.target as HTMLImageElement;
                  console.log('图片加载完成，实际尺寸:', img.naturalWidth, 'x', img.naturalHeight);
                }}
              />
            </div>
            
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
                      title={t('download')}
                    >
                      <ArrowDownTrayIcon className="w-5 h-5" />
                    </button>
                    
                    <button 
                      onClick={(e) => {
                        e.stopPropagation();
                        handleThumbsUp(viewingImage, e);
                      }}
                      className={`transition-colors ${reaction.liked ? 'text-green-500' : 'text-gray-700 hover:text-gray-900'}`}
                      title={t('thumbsUp')}
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
                      title={t('thumbsDown')}
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