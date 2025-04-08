'use client';

import { useState, useEffect } from 'react';
import { toast } from 'react-hot-toast';
import Image from 'next/image';
import { v4 as uuidv4 } from 'uuid';
import ThemeToggle from '@/components/ThemeToggle';
import LanguageSelector from '@/components/LanguageSelector';
import ImageSettings, { ImageSize } from '@/components/ImageSettings';
import PromptSuggestions from '@/components/PromptSuggestions';
import ImageActions from '@/components/ImageActions';
import ImageHistory, { HistoryItem } from '@/components/ImageHistory';
import { useTranslation } from '@/lib/i18n';

export default function Home() {
  const { t, locale } = useTranslation();
  const [prompt, setPrompt] = useState('');
  const [imageUrl, setImageUrl] = useState<string | null>(null);
  const [revisedPrompt, setRevisedPrompt] = useState('');
  const [loading, setLoading] = useState(false);
  const [size, setSize] = useState<ImageSize>('1024x1024');
  const [history, setHistory] = useState<HistoryItem[]>([]);

  // Load history from localStorage
  useEffect(() => {
    const savedHistory = localStorage.getItem('imageHistory');
    if (savedHistory) {
      try {
        setHistory(JSON.parse(savedHistory));
      } catch (e) {
        console.error('Failed to parse history:', e);
      }
    }
  }, []);

  // Save history to localStorage whenever it changes
  useEffect(() => {
    localStorage.setItem('imageHistory', JSON.stringify(history));
  }, [history]);

  const generateImage = async () => {
    if (!prompt) {
      toast.error('Please enter a prompt');
      return;
    }

    setLoading(true);
    
    // 添加加载提示，告知用户DALL-E需要时间
    toast.loading(locale === 'zh' ? 'Kira正在创作中，请耐心等待！' : 'Kira is creating, please wait!', 
      { duration: 30000 });
    
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
        throw new Error(data.error);
      }

      setImageUrl(data.imageUrl);
      setRevisedPrompt(data.revisedPrompt || prompt);
      
      // Add to history
      const newItem: HistoryItem = {
        id: uuidv4(),
        prompt: prompt,
        imageUrl: data.imageUrl,
        timestamp: Date.now(),
        size: size
      };
      
      setHistory((prev) => [newItem, ...prev]);
      toast.dismiss(); // 关闭加载提示
      toast.success(locale === 'zh' ? '图像生成成功！' : 'Image generated successfully!');
    } catch (error) {
      toast.dismiss(); // 关闭加载提示
      toast.error(error instanceof Error ? error.message : locale === 'zh' ? '生成图像失败' : 'Failed to generate image');
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  const handleSelectFromHistory = (item: HistoryItem) => {
    setPrompt(item.prompt);
    setImageUrl(item.imageUrl);
    setSize(item.size as ImageSize);
    setRevisedPrompt('');
  };

  const clearHistory = () => {
    setHistory([]);
    localStorage.removeItem('imageHistory');
    toast.success('History cleared');
  };

  const handlePromptSuggestion = (suggestion: string) => {
    setPrompt(suggestion);
  };

  return (
    <main className="min-h-screen p-4 md:p-8 max-w-7xl mx-auto transition-colors duration-200">
      <div className="fixed top-4 right-4 z-30">
        <ThemeToggle />
      </div>
      
      <div className="fixed top-4 left-4 z-30">
        <LanguageSelector />
      </div>
      
      <div className="flex flex-col items-center justify-center mb-8 md:mb-10 mt-16 md:mt-12">
        <h1 className="text-7xl md:text-8xl font-bold gradient-text animate-pulse">Kira</h1>
        <p className="text-sm md:text-base mt-3 text-gray-500 dark:text-gray-400 max-w-md text-center">
          {t('slogan')}
        </p>
      </div>
      
      <div className="max-w-xl md:max-w-2xl lg:max-w-3xl mx-auto mb-6">
        <div className="card p-4 md:p-8 space-y-4 md:space-y-6 shadow-lg">
          <textarea
            className="input-field text-base md:text-lg"
            rows={4}
            placeholder={t('promptPlaceholder')}
            value={prompt}
            onChange={(e) => setPrompt(e.target.value)}
          />
          
          <button
            className="btn-primary w-full flex items-center justify-center text-base md:text-lg py-3 md:py-4"
            onClick={generateImage}
            disabled={loading}
          >
            {loading ? (
              <>
                <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
                {t('generatingButton')}
              </>
            ) : (
              t('generateButton')
            )}
          </button>
          
          {/* 添加生成时间提示 */}
          <p className="text-xs text-gray-500 text-center">
            {locale === 'zh' ? 'Kira需要片刻时间，请耐心等待' : 'Kira needs a moment, please be patient'}
          </p>
          
          <div className="flex justify-center mt-5 mb-2">
            <div className="flex justify-center gap-8 md:gap-12">
              <ImageSettings size={size} setSize={setSize} simplified={true} />
            </div>
          </div>
        </div>
      </div>
      
      <div className="max-w-xl md:max-w-2xl lg:max-w-3xl mx-auto">
        <div className="space-y-3 md:space-y-4">
          {imageUrl && (
            <div className="card p-3 md:p-5 shadow-lg">
              <div className="relative rounded-lg overflow-hidden shadow-md" style={{ 
                aspectRatio: size === '1024x1024' ? '1/1' : size === '1024x1792' ? '9/16' : '16/9'
              }}>
                <Image
                  src={imageUrl}
                  alt={prompt}
                  fill
                  className="object-cover"
                  priority
                  unoptimized={imageUrl.startsWith('data:')} // 对于base64图片不进行优化
                />
              </div>
              
              <div className="mt-3">
                <ImageActions imageUrl={imageUrl} prompt={revisedPrompt || prompt} hideShareCopy={true} />
              </div>
            </div>
          )}
          
          <div className="card p-4 md:p-6 shadow-lg">
            <PromptSuggestions onApplySuggestion={handlePromptSuggestion} />
          </div>
          
          <div className="card p-4 md:p-6 shadow-lg">
            <ImageHistory 
              history={history} 
              onSelect={handleSelectFromHistory} 
              onClear={clearHistory} 
            />
          </div>
        </div>
      </div>
    </main>
  );
}
