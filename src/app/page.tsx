'use client';

import { useState, useEffect } from 'react';
import { toast } from 'react-hot-toast';
import { v4 as uuidv4 } from 'uuid';
import ImageSettings, { ImageSize } from '@/components/ImageSettings';
import ImageHistory, { HistoryItem } from '@/components/ImageHistory';
import { useTranslation } from '@/lib/i18n';
import GenerationProgress from '@/components/GenerationProgress';
import GenerationResults from '@/components/GenerationResults';
import { XMarkIcon, TrashIcon } from '@heroicons/react/24/solid';
import useQueueManager from '@/lib/useQueueManager';
import { enterQueueAndGenerate, hasReachedDailyLimit } from '@/lib/queueManager';
import { Inter } from 'next/font/google';

const inter = Inter({ subsets: ['latin'] });

// Client-side components using standard React component patterns
// These components will match the server-rendered HTML structure exactly
const HeaderSection = ({ title, subtitle }: { title: string; subtitle: string }) => {
  return (
    <div className="text-center mb-8">
      <div className="pt-4"></div>
      <h1 className="text-4xl font-bold mb-3 bg-clip-text text-transparent bg-gradient-to-r from-indigo-600 to-purple-600">
        {title}
      </h1>
      <p className="text-lg text-gray-600 dark:text-gray-400">
        {subtitle}
      </p>
    </div>
  );
};

// 使用一个小体积的占位图像Base64编码
const placeholderImageBase64 = "data:image/jpeg;base64,/9j/4AAQSkZJRgABAQAAAQABAAD/2wBDAAYEBQYFBAYGBQYHBwYIChAKCgkJChQODwwQFxQYGBcUFhYaHSUfGhsjHBYWICwgIyYnKSopGR8tMC0oMCUoKSj/2wBDAQcHBwoIChMKChMoGhYaKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCj/wAARCAAQABADASIAAhEBAxEB/8QAFQABAQAAAAAAAAAAAAAAAAAAAAf/xAAUEAEAAAAAAAAAAAAAAAAAAAAA/8QAFAEBAAAAAAAAAAAAAAAAAAAAAP/EABQRAQAAAAAAAAAAAAAAAAAAAAD/2gAMAwEAAhEDEQA/AJVAAAH/2Q==";

const HeroSection = ({ 
  imageSrc, 
  title, 
  subtitle 
}: { 
  imageSrc: string; 
  title: string; 
  subtitle: string;
}) => {
  // 添加图片加载状态管理
  const [imageLoaded, setImageLoaded] = useState(false);
  
  useEffect(() => {
    // 预加载实际图片
    const img = new Image();
    img.src = imageSrc;
    img.onload = () => setImageLoaded(true);
  }, [imageSrc]);

  return (
    <div className="relative w-full max-w-md mx-auto rounded-xl overflow-hidden mb-8 shadow-lg">
      <div className="w-full h-[500px]">
        {/* 使用占位图，然后在实际图片加载完成后切换 */}
        <div 
          className="w-full h-full bg-cover bg-center"
          style={{ 
            backgroundImage: `url(${imageLoaded ? imageSrc : placeholderImageBase64})`,
            backgroundSize: 'cover',
            filter: !imageLoaded ? 'blur(5px)' : 'none',
            transition: 'filter 0.3s ease-in-out'
          }}
        />
      </div>
      <div className="absolute inset-0 bg-gradient-to-t from-black/70 to-transparent flex flex-col items-center justify-end px-4 pb-8">
        <h1 className="text-5xl font-bold gradient-text leading-tight text-center">{title}</h1>
        <p className="text-xl text-white/90 mt-2 text-center">
          {subtitle}
        </p>
      </div>
    </div>
  );
};

export default function Home() {
  const { t, locale, changeLocale, tArray } = useTranslation();
  const [prompt, setPrompt] = useState('');
  const [generatedImages, setGeneratedImages] = useState<string[]>([]);
  const [loading, setLoading] = useState(false);
  const [showProgress, setShowProgress] = useState(false);
  const [showResults, setShowResults] = useState(false);
  const [size, setSize] = useState<ImageSize>('1024x1024');
  const [history, setHistory] = useState<HistoryItem[]>([]);
  const [showEmptyError, setShowEmptyError] = useState(false);
  const [previewImage, setPreviewImage] = useState<string | null>(null);
  const [isGenerating, setIsGenerating] = useState(false);
  const [dailyCount, setDailyCount] = useState(0);

  // 使用队列管理工具
  const { activeCount } = useQueueManager();

  // Load history from localStorage
  useEffect(() => {
    const savedHistory = localStorage.getItem('imageHistory');
    if (savedHistory) {
      try {
        const parsedHistory = JSON.parse(savedHistory);
        console.log('加载历史记录:', parsedHistory.length, '条记录');
        setHistory(parsedHistory);
      } catch (e) {
        console.error('解析历史记录失败:', e);
      }
    }
  }, []);

  // 加载和更新每日使用量
  useEffect(() => {
    const updateDailyCount = () => {
      const count = localStorage.getItem('imageapp_daily_count');
      setDailyCount(count ? parseInt(count, 10) : 0);
    };

    // 初始加载
    updateDailyCount();

    // 设置定时器，每5秒更新一次
    const interval = setInterval(updateDailyCount, 5000);

    // 添加storage事件监听器，当其他标签页更改localStorage时更新
    const handleStorageChange = (e: StorageEvent) => {
      if (e.key === 'imageapp_daily_count') {
        updateDailyCount();
      }
    };
    window.addEventListener('storage', handleStorageChange);

    return () => {
      clearInterval(interval);
      window.removeEventListener('storage', handleStorageChange);
    };
  }, []);

  // Save history to localStorage whenever it changes
  useEffect(() => {
    if (history.length > 0) {
      console.log('保存历史记录:', history.length, '条记录');
      localStorage.setItem('imageHistory', JSON.stringify(history));
    }
  }, [history]);

  // 从历史记录中选择项目
  const handleSelectFromHistory = (item: HistoryItem) => {
    setPrompt(item.prompt);
    setSize(item.size as ImageSize);
    toast.success(locale === 'zh' ? '已加载提示词' : 'Prompt loaded');
  };

  // 清空历史记录
  const clearHistory = () => {
    setHistory([]);
    localStorage.removeItem('imageHistory');
    toast.success(locale === 'zh' ? '历史记录已清空' : 'History cleared');
  };

  // 图像生成函数
  const generateImage = async () => {
    if (!prompt) {
      // 显示自定义错误UI，不使用toast
      setShowEmptyError(true);
      // 3秒后自动隐藏错误提示
      setTimeout(() => setShowEmptyError(false), 3000);
      return;
    }

    setLoading(true);
    setShowProgress(true);
    setShowResults(false);
    setGeneratedImages([]);
    
    try {
      // 使用简单的API调用
      const response = await fetch('/api/simple-generate', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ prompt, size }),
      });

      if (!response.ok) {
        const errorText = await response.text();
        throw new Error(`API error: ${response.status} - ${errorText}`);
      }

      const data = await response.json();
      if (data.error) {
        // 特别处理账单限额错误
        if (data.billingError) {
          toast.error(locale === 'zh' ? 
            'OpenAI API已达到账单限额，暂时无法生成真实图像，将使用模拟数据。' : 
            'OpenAI API billing limit reached, using mock data instead.'
          );
          // 如果API返回了模拟图像，继续使用
          if (data.imageUrls && data.imageUrls.length > 0) {
            setGeneratedImages(data.imageUrls);
            setShowProgress(false);
            setShowResults(true);
            return;
          }
        } else {
          throw new Error(data.error);
        }
      }

      if (data.imageUrls && data.imageUrls.length > 0) {
        setGeneratedImages(data.imageUrls);
        setShowProgress(false);
        setShowResults(true);
      } else {
        throw new Error('No images were generated');
      }
    } catch (error) {
      toast.error(error instanceof Error ? error.message : locale === 'zh' ? '生成图像失败' : 'Failed to generate image');
      console.error(error);
      setShowProgress(false);
      setShowResults(false);
    } finally {
      setLoading(false);
    }
  };

  // 包装后的图像生成处理函数
  const handleGenerateImage = async () => {
    await enterQueueAndGenerate(async () => {
      setIsGenerating(true);
      await generateImage();
      setIsGenerating(false);
    });
  };

  // 取消图像生成
  const handleCancelGeneration = () => {
    // 在实际应用中，这里可能需要取消API请求
    setLoading(false);
    setShowProgress(false);
    toast.error(locale === 'zh' ? '已取消图像生成' : 'Image generation cancelled');
  };

  // 选择图像并保存到历史记录
  const handleSelectImage = (selectedUrl: string) => {
    // 将选择的图像保存到历史记录中
    const newItem: HistoryItem = {
      id: uuidv4(),
      prompt,
      imageUrl: selectedUrl,
      timestamp: Date.now(),
      size: size
    };
    
    // 添加到历史记录的最前端
    setHistory(prev => [newItem, ...prev]);
    toast.success(locale === 'zh' ? '图像已保存到历史记录！' : 'Image saved to history!');
    
    // 关闭结果视图并清空生成的图像
    setShowResults(false);
    setGeneratedImages([]);
  };

  // 重新生成图像
  const handleGenerateAgain = () => {
    handleGenerateImage();
  };

  // 返回主界面
  const handleGoBack = () => {
    setShowResults(false);
  };

  // 示例提示词和提示词模板从翻译中获取
  const examplePrompts = tArray('examplePrompts');
  const promptTemplates = tArray('promptTemplates');

  // 使用本地图片路径
  const exampleImages = [
    "/examples/moon-cat.jpg",
    "/examples/mountain-lake-sunset.jpg",
    "/examples/city-future.jpg",
    "/examples/fantasy-forest.jpg",
    "/examples/elephant-tv.jpg",
    "/examples/camel-astronaut.jpg"
  ];

  // 图片预览功能
  const handleExampleImageClick = (e: React.MouseEvent, imagePath: string) => {
    e.stopPropagation(); // 阻止事件冒泡，不触发设置prompt
    setPreviewImage(imagePath);
  };
  
  const closeImagePreview = () => {
    setPreviewImage(null);
  };

  return (
    <main className="min-h-screen p-4 pt-16 max-w-md mx-auto">
      {/* 语言切换按钮 */}
      <div className="absolute top-3 right-4 z-10">
        <button 
          onClick={() => changeLocale(locale === 'zh' ? 'en' : 'zh')}
          className="px-3 py-1.5 bg-gray-100 hover:bg-gray-200 text-gray-700 rounded-full text-sm transition-colors flex items-center gap-1"
        >
          <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M12 22C17.5228 22 22 17.5228 22 12C22 6.47715 17.5228 2 12 2C6.47715 2 2 6.47715 2 12C2 17.5228 6.47715 22 12 22Z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
            <path d="M2 12H22" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
            <path d="M12 2C14.5013 4.73835 15.9228 8.29203 16 12C15.9228 15.708 14.5013 19.2616 12 22C9.49872 19.2616 8.07725 15.708 8 12C8.07725 8.29203 9.49872 4.73835 12 2Z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
          </svg>
          {locale === 'zh' ? 'English' : '中文'}
        </button>
      </div>

      {/* 头部标题与副标题 */}
      <HeaderSection 
        title={locale === 'zh' ? '创作属于你的艺术作品' : 'Create Your Own Artworks'}
        subtitle={locale === 'zh' ? '无需注册 · 免费使用 · 每天更新额度' : 'No registration · Free to use · Daily quota updates'}
      />

      {/* 英雄区域 */}
      <HeroSection 
        imageSrc="/images/blue-armor.jpg"
        title="Kirami"
        subtitle={locale === 'zh' ? '帮你生成独特图像' : 'helps you generate unique images'}
      />

      <GenerationProgress 
        prompt={prompt}
        onCancel={handleCancelGeneration}
        isVisible={showProgress}
        size={size}
      />
      
      <GenerationResults
        prompt={prompt}
        imageUrls={generatedImages}
        onSelectImage={handleSelectImage}
        onGoBack={handleGoBack}
        isVisible={showResults}
      />

      {/* 保存提醒 */}
      {showResults && (
        <p className="text-sm text-gray-500 text-center mt-1">
          {locale === 'zh' ? 
            <>💬 图像生成后记得保存，资源有限，请节约使用～</> : 
            <>💬 Remember to save images after generation. Resources are limited, please use responsibly.</>
          }
        </p>
      )}

      <div className="mb-4">
        <p className="mb-2 text-base font-bold text-gray-900 pl-2">{t('startDescription')}</p>
        <div className={`border-2 ${!prompt && showEmptyError ? 'border-red-400' : 'border-[#8B5CF6]'} rounded-xl shadow-sm overflow-hidden relative transition-colors duration-300`}>
          <textarea
            className="w-full p-3.5 text-gray-700 text-base focus:outline-none min-h-[110px] resize-none peer transition-shadow hover:shadow-inner focus:shadow-inner"
            placeholder={t('promptPlaceholder') as string}
            value={prompt}
            onChange={(e) => setPrompt(e.target.value)}
            // 当显示错误时，自动聚焦到输入框
            autoFocus={showEmptyError}
          />
          
          <div className="flex gap-1 p-1.5 bg-gray-50 justify-end">
            {prompt && (
              <button
                className="mr-2 text-gray-500 hover:text-red-500"
                onClick={() => setPrompt('')}
              >
                <TrashIcon className="w-5 h-5" />
              </button>
            )}
            <div 
              className="flex items-center justify-center w-24 h-10 bg-gray-300 text-black rounded-full cursor-pointer"
              onClick={() => {
                // 从翻译文件中获取提示词模板数组
                const promptTemplatesArray = tArray('promptTemplates');
                // 随机选择一个提示词
                const randomIndex = Math.floor(Math.random() * promptTemplatesArray.length);
                setPrompt(promptTemplatesArray[randomIndex]);
              }}
            >
              <span className="text-sm">{t('surpriseMe')}</span>
            </div>
          </div>
        </div>
      </div>
      
      <div className="mb-4">
        <div className="flex gap-3 justify-start">
          <ImageSettings size={size} setSize={setSize} simplified={true} />
        </div>
      </div>
      
      <div className="relative">
        <button
          className="w-full py-3 bg-indigo-600 text-white font-medium rounded-lg hover:bg-indigo-700 transition-colors"
          onClick={handleGenerateImage}
          disabled={loading || isGenerating}
        >
          <span className="text-base font-bold">
            {loading || isGenerating ? t('generatingButton') : t('generateButton')}
          </span>
        </button>
        
        {/* 每日使用量显示 */}
        <p className={`text-sm text-center mt-2 ${
          dailyCount >= 240 ? 'text-amber-500 font-medium' : 'text-gray-500'
        }`}>
          {(t('todayUsage') as string).replace('{count}', dailyCount.toString())}
        </p>
        
        {/* 队列等待提示 */}
        {activeCount > 1 && (
          <div className="mt-2 text-center">
            <p className="text-sm text-gray-500">
              ⏳ You are in the queue, please wait...
            </p>
            <p className="text-sm text-gray-500 mt-1">
              Want earlier access? Fill out our feedback form!
            </p>
            <a 
              href="https://tally.so/r/n9rDGK" 
              target="_blank" 
              rel="noopener noreferrer"
              className="inline-block mt-2 px-4 py-1.5 bg-indigo-600 text-white text-sm font-medium rounded-md hover:bg-indigo-700 transition-colors"
            >
              Join our tester list
            </a>
          </div>
        )}
        
        {/* 每日限制提示 */}
        {hasReachedDailyLimit() && (
          <p className="text-sm text-gray-500 text-center mt-2">
            🎯 You've reached today's free limit (250 images). Come back tomorrow!
          </p>
        )}
        
        {/* 空提示错误提示 - 悬浮在按钮上方 */}
        {showEmptyError && (
          <div className="absolute -top-16 left-0 right-0 bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg shadow-lg animate-bounce">
            <div className="flex items-center">
              <span className="text-xl mr-2">⚠️</span>
              <span className="text-sm font-medium">{t('emptyPromptError')}</span>
            </div>
          </div>
        )}
      </div>
      
      <div className="mt-6">
        <p className="mb-2 text-base font-bold text-gray-900 pl-2">{t('tryExample')}</p>
        <div className="grid grid-cols-1 gap-2">
          {examplePrompts.map((example, index) => (
            <div 
              key={index}
              className="flex items-center gap-4 p-3 border border-gray-200 rounded-lg cursor-pointer hover:bg-gray-100 bg-gray-50 transition-colors"
              onClick={() => setPrompt(example)}
            >
              <div 
                className="w-16 h-16 rounded-md flex-shrink-0 overflow-hidden cursor-pointer relative"
                onClick={(e) => handleExampleImageClick(e, exampleImages[index % exampleImages.length])}
              >
                <img
                  src={exampleImages[index % exampleImages.length]}
                  alt={example}
                  className="w-full h-full object-cover"
                />
              </div>
              <p className="text-sm text-gray-700">{example}</p>
            </div>
          ))}
        </div>
      </div>
      
      {/* 生成历史记录部分 */}
      {!showProgress && !showResults && (
        <div className="mt-8">
          <div className="mb-2 text-base font-bold text-gray-900 pl-2">{t('history')}</div>
          <ImageHistory 
            history={history} 
            onSelect={handleSelectFromHistory}
            onClear={clearHistory}
          />
          <div className="mt-4 text-center">
            <a href="/landing" className="text-sm text-indigo-600 hover:text-indigo-800">
              {locale === 'zh' ? '查看宣传页面' : 'Visit landing page'}
            </a>
          </div>
        </div>
      )}
      
      {/* 图片预览模态框 */}
      {previewImage && (
        <div 
          className="fixed inset-0 bg-white/90 z-[100] flex items-center justify-center"
          onClick={closeImagePreview}
        >
          <div 
            className="relative max-w-[90vw] max-h-[90vh] p-2"
            onClick={(e) => e.stopPropagation()}
          >
            <button 
              onClick={closeImagePreview}
              className="absolute top-2 right-2 bg-gray-200 text-gray-700 p-2 rounded-full hover:bg-gray-300 z-10"
            >
              <XMarkIcon className="w-6 h-6" />
            </button>
            
            <img
              src={previewImage}
              alt="图片预览"
              className="max-w-full max-h-[80vh] object-contain rounded-lg"
            />
          </div>
        </div>
      )}
    </main>
  );
}
