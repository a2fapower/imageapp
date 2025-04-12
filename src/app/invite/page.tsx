'use client';

import Link from 'next/link';
import { useState, useEffect } from 'react';
import { useTranslation } from '@/lib/i18n';
import Image from 'next/image';

export default function InvitePage() {
  const { t, locale, changeLocale } = useTranslation();
  const [imageLoaded, setImageLoaded] = useState(false);

  // 预加载背景图片
  useEffect(() => {
    const img = new window.Image();
    img.src = "/images/blue-armor.jpg";
    img.onload = () => setImageLoaded(true);
  }, []);

  // 语言切换处理函数
  const toggleLanguage = () => {
    changeLocale(locale === 'zh' ? 'en' : 'zh');
  };

  return (
    <div className="flex flex-col items-center min-h-screen bg-gradient-to-b from-indigo-50 to-white text-gray-800">
      {/* 语言切换按钮 - 右侧 */}
      <div className="fixed top-4 right-4 z-20">
        <button 
          onClick={toggleLanguage}
          className="px-3 py-1.5 bg-white/80 backdrop-blur-sm hover:bg-white text-gray-700 rounded-full text-sm transition-all duration-300 flex items-center gap-1 shadow-sm"
        >
          <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M12 22C17.5228 22 22 17.5228 22 12C22 6.47715 17.5228 2 12 2C6.47715 2 2 6.47715 2 12C2 17.5228 6.47715 22 12 22Z" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
            <path d="M2 12H22" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
            <path d="M12 2C14.5013 4.73835 15.9228 8.29203 16 12C15.9228 15.708 14.5013 19.2616 12 22" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
            <path d="M12 2C9.49872 4.73835 8.07725 8.29203 8 12C8.07725 15.708 9.49872 19.2616 12 22" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
          </svg>
          {locale === 'zh' ? 'English' : '中文'}
        </button>
      </div>
      
      {/* 顶部标题区域 */}
      <div className="w-full max-w-5xl mx-auto pt-24 pb-8 px-4 text-center">
        <h1 className="text-5xl md:text-7xl font-bold mb-6 bg-clip-text text-transparent bg-gradient-to-r from-indigo-600 via-purple-600 to-indigo-500 drop-shadow-sm">
          {locale === 'zh' ? '创作属于你的艺术作品' : 'Create Your Own Artworks'}
        </h1>
        
        <p className="text-xl md:text-2xl text-gray-600 mb-10 max-w-3xl mx-auto">
          {locale === 'zh' 
            ? '无需注册 · 免费使用 · 每日额度更新' 
            : 'No registration · Free to use · Daily quota updates'}
        </p>
      </div>

      {/* 主卡片区域 - 带背景图片 */}
      <div className="w-full max-w-6xl mx-auto px-4 mb-16">
        <div className="relative w-full overflow-hidden rounded-2xl shadow-2xl transform transition-all duration-500 hover:scale-[1.01] group">
          {/* 背景图片容器 */}
          <div className="w-full h-[65vh] max-h-[650px] min-h-[500px] relative">
            {/* 背景图片 */}
            <Image 
              src="/images/blue-armor.jpg" 
              alt="AI generated artwork" 
              fill
              className="object-cover transition-transform duration-700 group-hover:scale-105"
              priority
            />
            {/* 渐变遮罩 */}
            <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/40 to-transparent"></div>
            
            {/* 文字内容 - 底部居中 */}
            <div className="absolute bottom-0 left-0 right-0 p-8 md:p-12 text-center transform transition-all duration-500">
              <h2 className="text-6xl md:text-7xl font-bold mb-6 text-transparent bg-clip-text bg-gradient-to-r from-purple-300 to-purple-100 drop-shadow-lg">
                Kirami
              </h2>
              <p className="text-2xl md:text-3xl text-white/90 mb-12 max-w-3xl mx-auto font-light">
                {locale === 'zh' ? '助你生成独特的图像' : 'helps you generate unique images'}
              </p>
              
              <a 
                href="/home"
                className="inline-flex items-center justify-center gap-2 px-8 py-4 bg-indigo-600 text-white font-medium rounded-full hover:bg-indigo-500 transition-all duration-300 text-lg shadow-xl hover:shadow-indigo-500/30 transform hover:-translate-y-1"
              >
                {locale === 'zh' ? '立即开始创作' : 'Start Creating Now'} 
                <svg className="w-5 h-5" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <path d="M5 12H19" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                  <path d="M12 5L19 12L12 19" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                </svg>
              </a>
            </div>
          </div>
        </div>
      </div>
      
      {/* 功能描述区域 */}
      <div className="w-full max-w-4xl mx-auto px-4 mb-24">
        <div className="bg-white rounded-2xl shadow-lg p-8 md:p-12 border border-gray-100">
          <div className="prose prose-lg md:prose-xl mx-auto text-gray-600">
            <p>
              {locale === 'zh' 
                ? '这是一款强大的 AI 图像生成工具，无需注册即可使用，每天都有免费额度更新。它适合设计师、创作者和任何需要灵感的人。' 
                : 'This is a powerful AI image generation tool that you can use without registration. It has daily free quotas and is perfect for designers, creators, and anyone looking for inspiration.'}
            </p>
            <p>
              {locale === 'zh'
                ? '不论是创意草图、概念设计还是艺术创作，都能帮助你将想法转化为图像。只需输入描述，几秒钟内就能获得高质量的图片。'
                : 'Whether you need creative sketches, concept designs, or artistic creations, this tool can help you transform your ideas into images. Just enter a description and get high-quality images in seconds.'}
            </p>
            <div className="text-center mt-8">
              <p className="font-medium text-indigo-600 text-xl">
                {locale === 'zh'
                  ? '参与内测，您的反馈将帮助我们打造更好的产品！'
                  : 'Join our beta test, your feedback will help us build a better product!'}
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
} 