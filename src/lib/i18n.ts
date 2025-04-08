import { useState, useEffect } from 'react';

type Locale = 'en' | 'zh' | 'es' | 'fr' | 'de' | 'ja';

const translations = {
  en: {
    title: 'Kira',
    promptPlaceholder: 'Describe what you want to see (e.g. A sunset over a mountain lake)',
    generateButton: 'Generate',
    generatingButton: 'Generating...',
    settings: 'Image Size',
    square: 'Square',
    portrait: 'Portrait',
    landscape: 'Landscape',
    download: 'Download',
    copyPrompt: 'Copy Prompt',
    history: 'History',
    clearAll: 'Clear',
    noImages: 'No images generated yet.',
    suggestions: 'Prompt Suggestions',
    language: 'Language',
    share: 'Share',
    showSuggestions: 'Show Suggestions',
    hideSuggestions: 'Hide Suggestions',
    moreSuggestions: 'More Suggestions',
    slogan: 'Professional design in 10 seconds with AI',
    testimonial: 'Create beautiful images with just a simple prompt',
    startDescription: 'Start with a detailed description',
    surpriseMe: 'Surprise me',
    chooseSize: 'Choose size',
    tryExample: 'Try an example made with Kira',
  },
  zh: {
    title: '闪画',
    promptPlaceholder: '描述你想看到的图像（例如：日落时的山湖）',
    generateButton: '生成',
    generatingButton: '生成中...',
    settings: '图像尺寸',
    square: '正方形',
    portrait: '竖向',
    landscape: '横向',
    download: '下载',
    copyPrompt: '复制提示词',
    history: '历史记录',
    clearAll: '清除全部',
    noImages: '尚未生成图像。',
    suggestions: '提示建议',
    language: '语言',
    share: '分享',
    showSuggestions: '显示建议',
    hideSuggestions: '隐藏建议',
    moreSuggestions: '更多建议',
    slogan: '让AI帮你10秒钟搞定专业级设计图',
    testimonial: '只需一句简单的提示词，即可创建精美图像',
    startDescription: '从详细描述开始',
    surpriseMe: '给我惊喜',
    chooseSize: '选择尺寸',
    tryExample: '尝试示例',
  },
  es: {
    title: 'Generador de Imágenes IA',
    promptPlaceholder: 'Describe la imagen que quieres generar...',
    generateButton: 'Generar',
    generatingButton: 'Generando...',
    settings: 'Configuración de Imagen',
    square: 'Cuadrado',
    portrait: 'Retrato',
    landscape: 'Paisaje',
    download: 'Descargar',
    copyPrompt: 'Copiar Prompt',
    history: 'Historial',
    clearAll: 'Borrar Todo',
    noImages: 'Aún no se han generado imágenes.',
    suggestions: 'Sugerencias de Prompts',
    language: 'Idioma',
    share: 'Compartir',
    showSuggestions: 'Mostrar Sugerencias',
    hideSuggestions: 'Ocultar Sugerencias',
    moreSuggestions: 'Más Sugerencias',
    slogan: 'Diseño profesional en 10 segundos con IA',
    testimonial: 'Crea hermosas imágenes con un simple prompt',
    startDescription: 'Comienza con una descripción detallada',
    surpriseMe: 'Sorpréndeme',
    chooseSize: 'Elegir tamaño',
    tryExample: 'Prueba un ejemplo',
  },
  fr: {
    title: 'Générateur d\'Images IA',
    promptPlaceholder: 'Décrivez l\'image que vous souhaitez générer...',
    generateButton: 'Générer',
    generatingButton: 'Génération...',
    settings: 'Paramètres d\'Image',
    square: 'Carré',
    portrait: 'Portrait',
    landscape: 'Paysage',
    download: 'Télécharger',
    copyPrompt: 'Copier le Prompt',
    history: 'Historique',
    clearAll: 'Tout Effacer',
    noImages: 'Aucune image générée pour le moment.',
    suggestions: 'Suggestions de Prompts',
    language: 'Langue',
    share: 'Partager',
    showSuggestions: 'Afficher les Suggestions',
    hideSuggestions: 'Masquer les Suggestions',
    moreSuggestions: 'Plus de Suggestions',
    slogan: 'Design professionnel en 10 secondes avec l\'IA',
    testimonial: 'Créez de belles images avec un simple prompt',
    startDescription: 'Commencez par une description détaillée',
    surpriseMe: 'Surprenez-moi',
    chooseSize: 'Choisir la taille',
    tryExample: 'Essayez un exemple',
  },
  de: {
    title: 'KI-Bildgenerator',
    promptPlaceholder: 'Beschreiben Sie das Bild, das Sie generieren möchten...',
    generateButton: 'Generieren',
    generatingButton: 'Generiere...',
    settings: 'Bildeinstellungen',
    square: 'Quadrat',
    portrait: 'Hochformat',
    landscape: 'Querformat',
    download: 'Herunterladen',
    copyPrompt: 'Prompt Kopieren',
    history: 'Verlauf',
    clearAll: 'Alles Löschen',
    noImages: 'Noch keine Bilder generiert.',
    suggestions: 'Prompt-Vorschläge',
    language: 'Sprache',
    share: 'Teilen',
    showSuggestions: 'Vorschläge Anzeigen',
    hideSuggestions: 'Vorschläge Ausblenden',
    moreSuggestions: 'Mehr Vorschläge',
    slogan: 'Professionelles Design in 10 Sekunden mit KI',
    testimonial: 'Erstellen Sie wunderschöne Bilder mit einem einfachen Prompt',
    startDescription: 'Beginnen Sie mit einer detaillierten Beschreibung',
    surpriseMe: 'Überraschen Sie mich',
    chooseSize: 'Größe wählen',
    tryExample: 'Beispiel ausprobieren',
  },
  ja: {
    title: 'AI画像ジェネレーター',
    promptPlaceholder: '生成したい画像を説明してください...',
    generateButton: '生成',
    generatingButton: '生成中...',
    settings: '画像設定',
    square: '正方形',
    portrait: '縦向き',
    landscape: '横向き',
    download: 'ダウンロード',
    copyPrompt: 'プロンプトをコピー',
    history: '履歴',
    clearAll: 'すべて消去',
    noImages: 'まだ画像が生成されていません。',
    suggestions: 'プロンプト提案',
    language: '言語',
    share: 'シェア',
    showSuggestions: '提案を表示',
    hideSuggestions: '提案を非表示',
    moreSuggestions: 'その他の提案',
    slogan: 'AIで10秒でプロレベルのデザインを',
    testimonial: 'シンプルなプロンプトで美しい画像を作成',
    startDescription: '詳細な説明から始める',
    surpriseMe: '驚かせて',
    chooseSize: 'サイズを選択',
    tryExample: '例を試す',
  }
};

// 使用一个全局变量来存储当前语言，这样可以在组件间共享
let globalLocale: Locale = 'en';

export const useTranslation = () => {
  const [locale, setLocale] = useState<Locale>(globalLocale);
  const [, forceUpdate] = useState({});

  useEffect(() => {
    // 获取浏览器语言或存储的语言偏好
    const browserLocale = navigator.language.split('-')[0] as Locale;
    const savedLocale = localStorage.getItem('locale') as Locale;
    
    const supportedLocales = Object.keys(translations) as Locale[];
    const defaultLocale = savedLocale && supportedLocales.includes(savedLocale) 
      ? savedLocale 
      : supportedLocales.includes(browserLocale) 
        ? browserLocale 
        : 'en';
    
    globalLocale = defaultLocale;
    setLocale(defaultLocale);
  }, []);

  const changeLocale = (newLocale: Locale) => {
    globalLocale = newLocale;
    setLocale(newLocale);
    localStorage.setItem('locale', newLocale);
    
    // 强制刷新页面以应用新语言
    window.location.reload();
  };

  const t = (key: keyof typeof translations.en) => {
    return translations[locale][key] || translations.en[key];
  };

  return { t, locale, changeLocale, supportedLocales: Object.keys(translations) as Locale[] };
}; 