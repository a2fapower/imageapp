import React, { useState, useRef, useEffect } from 'react';
import { SparklesIcon, ChevronDownIcon } from '@heroicons/react/24/outline';
import { useTranslation } from '@/lib/i18n';

interface PromptSuggestionsProps {
  onApplySuggestion: (suggestion: string) => void;
}

// 各语言的提示词建议
const localizedSuggestions = {
  en: [
    "A photorealistic image of a mountain landscape at sunset",
    "A stylized digital art of a futuristic city",
    "A watercolor painting of a forest with a river",
    "A professional portrait photo of a person in business attire",
    "A surreal dreamlike scene with floating islands",
    "A cyberpunk scene with neon lights and rain",
    "A whimsical cartoon character in a meadow",
    "An anime-style drawing of a hero with magical powers",
    "A Renaissance-style painting of a modern cafe",
    "A steampunk airship flying over Victorian London"
  ],
  zh: [
    "日落时分的山川风景照片写实图",
    "未来城市的科幻风格数字艺术",
    "水彩画风格的森林和小溪",
    "穿着正装的人物专业肖像照",
    "梦幻场景：漂浮的岛屿和彩虹桥",
    "赛博朋克城市夜景，霓虹灯和雨",
    "在草地上的可爱卡通角色",
    "拥有魔法力量的动漫风格角色",
    "文艺复兴风格绘制的现代咖啡馆",
    "蒸汽朋克风格的飞艇和维多利亚伦敦"
  ],
  es: [
    "Una imagen fotorrealista de un paisaje montañoso al atardecer",
    "Un arte digital estilizado de una ciudad futurista",
    "Una pintura de acuarela de un bosque con un río",
    "Una foto de retrato profesional de una persona con ropa de negocios",
    "Una escena onírica surrealista con islas flotantes",
    "Una escena cyberpunk con luces de neón y lluvia",
    "Un personaje de dibujos animados caprichoso en un prado",
    "Un dibujo de estilo anime de un héroe con poderes mágicos",
    "Una pintura estilo Renacimiento de un café moderno",
    "Un dirigible steampunk volando sobre el Londres victoriano"
  ],
  fr: [
    "Une image photoréaliste d'un paysage montagneux au coucher du soleil",
    "Un art numérique stylisé d'une ville futuriste",
    "Une peinture aquarelle d'une forêt avec une rivière",
    "Une photo portrait professionnelle d'une personne en tenue d'affaires",
    "Une scène onirique surréaliste avec des îles flottantes",
    "Une scène cyberpunk avec des néons et de la pluie",
    "Un personnage de dessin animé fantaisiste dans une prairie",
    "Un dessin de style anime d'un héros aux pouvoirs magiques",
    "Une peinture de style Renaissance d'un café moderne",
    "Un dirigeable steampunk survolant le Londres victorien"
  ],
  de: [
    "Ein fotorealistisches Bild einer Berglandschaft bei Sonnenuntergang",
    "Eine stilisierte digitale Kunst einer futuristischen Stadt",
    "Ein Aquarell eines Waldes mit einem Fluss",
    "Ein professionelles Porträtfoto einer Person in Geschäftskleidung",
    "Eine surreale traumhafte Szene mit schwebenden Inseln",
    "Eine Cyberpunk-Szene mit Neonlichtern und Regen",
    "Eine fantasievolle Zeichentrickfigur auf einer Wiese",
    "Eine Anime-Zeichnung eines Helden mit magischen Kräften",
    "Ein Gemälde im Renaissance-Stil eines modernen Cafés",
    "Ein Steampunk-Luftschiff über dem viktorianischen London"
  ],
  ja: [
    "夕日の山の風景の写真リアルな画像",
    "未来都市のスタイリッシュなデジタルアート",
    "川のある森の水彩画",
    "ビジネス服を着た人物のプロフェッショナルなポートレート写真",
    "浮かぶ島のあるシュールな夢のような風景",
    "ネオンライトと雨のあるサイバーパンクシーン",
    "草原にいるかわいい漫画のキャラクター",
    "魔法の力を持つアニメ風のヒーロー",
    "現代のカフェのルネサンス風の絵画",
    "ヴィクトリア朝のロンドン上空を飛ぶスチームパンクの飛行船"
  ]
};

const PromptSuggestions: React.FC<PromptSuggestionsProps> = ({ onApplySuggestion }) => {
  const { t, locale } = useTranslation();
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);
  const buttonRef = useRef<HTMLButtonElement>(null);
  
  // 根据当前语言选择提示词，如果没有对应的提示词则使用英语
  const currentSuggestions = localizedSuggestions[locale] || localizedSuggestions.en;
  
  // 将提示词分为显示和隐藏部分
  const visibleSuggestions = currentSuggestions.slice(0, 4);
  const hiddenSuggestions = currentSuggestions.slice(4);
  
  // 切换下拉菜单状态
  const toggleDropdown = () => {
    setDropdownOpen(prevState => !prevState);
  };
  
  // 点击外部关闭下拉框，但排除切换按钮本身
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        dropdownRef.current && 
        !dropdownRef.current.contains(event.target as Node) &&
        buttonRef.current && 
        !buttonRef.current.contains(event.target as Node)
      ) {
        setDropdownOpen(false);
      }
    };
    
    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);
  
  return (
    <div>
      <div className="flex justify-between items-center mb-2">
        <h2 className="text-md font-medium text-gray-300 dark:text-gray-400">{t('suggestions')}</h2>
        {hiddenSuggestions.length > 0 && (
          <button
            ref={buttonRef}
            onClick={toggleDropdown}
            className="flex items-center justify-center w-6 h-6 rounded-full bg-slate-800/50 dark:bg-slate-800/30 hover:bg-slate-700 dark:hover:bg-slate-700 transition-all hover:scale-105 text-gray-300"
            title={t('moreSuggestions')}
            aria-expanded={dropdownOpen}
          >
            <ChevronDownIcon 
              className={`h-3.5 w-3.5 transition-transform duration-200 ${dropdownOpen ? 'transform rotate-180' : ''}`} 
            />
          </button>
        )}
      </div>
      
      <div className="grid grid-cols-2 gap-2">
        {visibleSuggestions.map((suggestion, index) => (
          <button
            key={index}
            onClick={() => onApplySuggestion(suggestion)}
            className="p-2.5 text-sm rounded-md bg-slate-800/70 dark:bg-slate-800/50 text-gray-200 dark:text-gray-200 hover:bg-indigo-600/80 dark:hover:bg-indigo-600/70 transition-all duration-200 hover:scale-102 text-left overflow-hidden border-0 shadow-sm"
          >
            <span className="truncate block">{suggestion}</span>
          </button>
        ))}
      </div>
      
      {dropdownOpen && hiddenSuggestions.length > 0 && (
        <div className="mt-2 grid grid-cols-2 gap-2" ref={dropdownRef}>
          {hiddenSuggestions.map((suggestion, index) => (
            <button
              key={index}
              onClick={() => {
                onApplySuggestion(suggestion);
                setDropdownOpen(false);
              }}
              className="p-2.5 text-sm rounded-md bg-slate-800/70 dark:bg-slate-800/50 text-gray-200 dark:text-gray-200 hover:bg-indigo-600/80 dark:hover:bg-indigo-600/70 transition-all duration-200 hover:scale-102 text-left overflow-hidden border-0 shadow-sm"
            >
              <span className="truncate block">{suggestion}</span>
            </button>
          ))}
        </div>
      )}
    </div>
  );
};

export default PromptSuggestions; 