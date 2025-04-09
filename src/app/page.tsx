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
    toast.loading(locale === 'zh' ? 'Kirami正在创作中，请耐心等待！' : 'Kirami is creating, please wait!', 
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
      const newItem = {
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

  // 示例提示词和提示词模板从翻译中获取
  const examplePrompts = t('examplePrompts') as string[];
  const promptTemplates = t('promptTemplates') as string[];

  // 使用本地图片路径
  const exampleImages = [
    "/examples/moon-cat.jpg",
    "/examples/camel-astronaut.jpg",
    "/examples/elephant-tv.jpg"
  ];

  return (
    <main className="min-h-screen p-4 max-w-md mx-auto">
      <div className="w-24 absolute top-3 right-4">
        <LanguageSelector />
      </div>

      <div className="pt-12 mb-8 flex flex-col items-center">
        <h1 className="text-5xl font-bold gradient-text leading-tight text-center">Kirami</h1>
        <p className="text-xs text-gray-500 mt-1 text-center">{t('slogan')}</p>
      </div>
      
      <div className="mb-4">
        <p className="mb-2 text-sm font-bold text-gray-900 pl-2">{t('startDescription')}</p>
        <div className="border-2 border-[#8B5CF6] rounded-xl shadow-sm overflow-hidden">
          <textarea
            className="w-full p-3.5 text-gray-700 text-base focus:outline-none min-h-[110px] resize-none"
            placeholder={t('promptPlaceholder') as string}
            value={prompt}
            onChange={(e) => setPrompt(e.target.value)}
          />
          
          <div className="flex gap-1 p-1.5 bg-gray-50">
            <div 
              className="flex justify-between items-center w-full px-4 py-0.5 border border-gray-200 rounded-md bg-gray-200"
              onClick={() => {
                // 实现surprise me功能
                const surprisePrompts = [
                  "A bowl of soup that is also a portal to another dimension, digital art",
                  "A cosmic turtle carrying planets on its shell, hyperrealistic",
                  "A library where books float and pages turn themselves, magical realism"
                ];
                setPrompt(surprisePrompts[Math.floor(Math.random() * surprisePrompts.length)]);
              }}
            >
              <span className="text-sm text-gray-700 font-normal cursor-pointer">{t('surpriseMe')}</span>
              <button
                onClick={(e) => {
                  e.stopPropagation(); // 阻止事件冒泡
                  // 从大量模板中随机选择一个提示词
                  const randomIndex = Math.floor(Math.random() * promptTemplates.length);
                  setPrompt(promptTemplates[randomIndex]);
                }}
                className="w-10 h-10 flex items-center justify-center text-xl text-gray-600 font-medium"
              >
                +
              </button>
            </div>
          </div>
        </div>
      </div>
      
      <div className="mb-4">
        <div className="flex gap-3 justify-start">
          <ImageSettings size={size} setSize={setSize} simplified={true} />
        </div>
      </div>
      
      <button
        className="w-full py-3 bg-indigo-600 text-white font-medium rounded-lg hover:bg-indigo-700 transition-colors"
        onClick={generateImage}
        disabled={loading}
      >
        <span className="text-base font-bold">
          {loading ? t('generatingButton') : t('generateButton')}
        </span>
      </button>
      
      {imageUrl && (
        <div className="mt-5 border border-gray-200 rounded-lg overflow-hidden">
          <div className="relative" style={{ 
            aspectRatio: size === '1024x1024' ? '1/1' : size === '1024x1792' ? '9/16' : '16/9'
          }}>
            <Image
              src={imageUrl}
              alt={prompt}
              fill
              className="object-cover"
              priority
              unoptimized={imageUrl.startsWith('data:')}
            />
          </div>
        </div>
      )}
      
      <div className="mt-6">
        <p className="mb-2 text-sm font-bold text-gray-900 pl-2">{t('tryExample')}</p>
        <div className="grid grid-cols-1 gap-2">
          {examplePrompts.map((example, index) => (
            <div 
              key={index}
              className="flex items-center gap-4 p-3 border border-gray-200 rounded-lg cursor-pointer hover:bg-gray-100 bg-gray-50 transition-colors"
              onClick={() => setPrompt(example)}
            >
              <div className="w-16 h-16 rounded-md flex-shrink-0 overflow-hidden">
                <img
                  src={exampleImages[index]}
                  alt={example}
                  className="w-full h-full object-cover"
                />
              </div>
              <p className="text-sm text-gray-700">{example}</p>
            </div>
          ))}
        </div>
      </div>
    </main>
  );
}
