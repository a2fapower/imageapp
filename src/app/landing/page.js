'use client';

import Link from 'next/link';
import { useState, useEffect } from 'react';

// 定义文本内容
const textContent = {
  zh: {
    title: "创作属于你的艺术作品",
    subtitle: "无需注册 · 免费使用 · 每天更新额度",
    feature1: {
      title: "创意无限",
      description: "用AI生成独特的艺术作品，释放你的想象力。"
    },
    feature2: {
      title: "快速生成",
      description: "瞬间生成高质量图像，无需等待，即刻创作。"
    },
    feature3: {
      title: "多样风格",
      description: "支持多种艺术风格和格式，满足各类创作需求。"
    },
    cta: "立即体验",
    switchLang: "English"
  },
  en: {
    title: "Create Your Own Artworks",
    subtitle: "No registration · Free to use · Daily quota updates",
    feature1: {
      title: "Unlimited Creativity",
      description: "Generate unique artworks with AI, unleash your imagination."
    },
    feature2: {
      title: "Fast Generation",
      description: "Create high-quality images instantly, no waiting, create now."
    },
    feature3: {
      title: "Diverse Styles",
      description: "Support for various artistic styles and formats, meeting all creative needs."
    },
    cta: "Try Now",
    switchLang: "中文"
  }
};

export default function LandingPage() {
  const [currentLang, setCurrentLang] = useState('zh');
  
  // 在客户端初始化时检查localStorage中的语言设置
  useEffect(() => {
    const savedLang = localStorage.getItem('kirami-lang');
    if (savedLang === 'en' || savedLang === 'zh') {
      setCurrentLang(savedLang);
    }
  }, []);
  
  // 切换语言
  const toggleLanguage = () => {
    const newLang = currentLang === 'zh' ? 'en' : 'zh';
    setCurrentLang(newLang);
    localStorage.setItem('kirami-lang', newLang);
  };
  
  const text = textContent[currentLang];

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gradient-to-b from-white to-gray-50 text-gray-800 px-4 py-12">
      {/* 语言切换按钮 */}
      <div className="absolute top-4 right-4">
        <button 
          onClick={toggleLanguage}
          className="px-3 py-1.5 bg-gray-100 hover:bg-gray-200 text-gray-700 rounded-full text-sm transition-colors flex items-center gap-1"
        >
          <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M12 22C17.5228 22 22 17.5228 22 12C22 6.47715 17.5228 2 12 2C6.47715 2 2 6.47715 2 12C2 17.5228 6.47715 22 12 22Z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
            <path d="M2 12H22" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
            <path d="M12 2C14.5013 4.73835 15.9228 8.29203 16 12C15.9228 15.708 14.5013 19.2616 12 22C9.49872 19.2616 8.07725 15.708 8 12C8.07725 8.29203 9.49872 4.73835 12 2Z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
          </svg>
          {text.switchLang}
        </button>
      </div>
      
      <div className="max-w-4xl mx-auto text-center">
        <div className="pt-4"></div>
        <h1 className="text-4xl md:text-5xl font-bold mb-4 bg-clip-text text-transparent bg-gradient-to-r from-indigo-600 to-purple-600">{text.title}</h1>
        <p className="text-lg md:text-xl text-gray-600 mb-8 max-w-2xl mx-auto">
          {text.subtitle}
        </p>
        
        <div className="w-full max-w-[1000px] h-[600px] mx-auto my-10 rounded-xl overflow-hidden shadow-lg relative">
          <img 
            src="/images/blue-armor.jpg" 
            alt="Kirami AI艺术创作示例" 
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/70 to-black/30 flex flex-col items-center justify-end px-4 pb-12">
            <h2 className="text-7xl font-bold gradient-text leading-tight text-center text-transparent bg-clip-text bg-gradient-to-r from-indigo-500 to-purple-600">Kirami</h2>
            <p className="text-3xl text-white/90 mt-4 text-center mb-2">
              {currentLang === 'zh' ? '帮你生成独特图像' : 'helps you generate unique images'}
            </p>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 my-12">
          <div className="bg-white p-6 rounded-xl shadow-sm hover:shadow-md transition-shadow">
            <span className="text-4xl mb-4 block">🎨</span>
            <h3 className="text-xl font-bold mb-2">{text.feature1.title}</h3>
            <p className="text-gray-600">{text.feature1.description}</p>
          </div>
          <div className="bg-white p-6 rounded-xl shadow-sm hover:shadow-md transition-shadow">
            <span className="text-4xl mb-4 block">⚡</span>
            <h3 className="text-xl font-bold mb-2">{text.feature2.title}</h3>
            <p className="text-gray-600">{text.feature2.description}</p>
          </div>
          <div className="bg-white p-6 rounded-xl shadow-sm hover:shadow-md transition-shadow">
            <span className="text-4xl mb-4 block">🖼️</span>
            <h3 className="text-xl font-bold mb-2">{text.feature3.title}</h3>
            <p className="text-gray-600">{text.feature3.description}</p>
          </div>
        </div>
        
        <Link href="/" className="px-8 py-4 bg-indigo-600 text-white font-medium rounded-lg hover:bg-indigo-700 transition-colors text-lg shadow-md hover:shadow-lg">
          {text.cta}
        </Link>
      </div>
    </div>
  );
} 