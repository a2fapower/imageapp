"use client";

import { useState, useEffect } from 'react';

// 只支持英文和中文
type Locale = 'en' | 'zh';

// 翻译类型定义
export type TranslationType = {
  title: string;
  promptPlaceholder: string;
  generateButton: string;
  generatingButton: string;
  settings: string;
  square: string;
  portrait: string;
  landscape: string;
  download: string;
  copyPrompt: string;
  history: string;
  clearAll: string;
  noImages: string;
  suggestions: string;
  language: string;
  share: string;
  showSuggestions: string;
  hideSuggestions: string;
  moreSuggestions: string;
  slogan: string;
  testimonial: string;
  startDescription: string;
  surpriseMe: string;
  chooseSize: string;
  tryExample: string;
  generating: string;
  cancel: string;
  generateAgain: string;
  goBack: string;
  selectImage: string;
  aiDisclaimer: string;
  emptyPromptError: string;
  promptGuidanceShort: string;
  promptGuidanceGood: string;
  characters: string;
  thumbsUp: string;
  thumbsDown: string;
  feedback: string;
  todayUsage: string;
  saveReminder: string;
  // 下载相关翻译
  downloadingImage: string;
  downloadSuccess: string;
  downloadError: string;
  downloadErrorExpired: string;
  downloadErrorNetwork: string;
  // 示例提示词
  examplePrompts: string[];
  // 随机提示词模板
  promptTemplates: string[];
};

// 翻译对象
export const translations: Record<Locale, TranslationType> = {
  en: {
    title: 'Kirami',
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
    tryExample: 'Try an example',
    generating: 'Generating',
    cancel: 'Cancel',
    generateAgain: 'Generate again',
    goBack: 'Go back',
    selectImage: 'Select this image',
    aiDisclaimer: "This technology is new and improving, please check its accuracy and report these images if they don't seem right.",
    emptyPromptError: "Please enter a description first",
    promptGuidanceShort: "More detailed descriptions create better results",
    promptGuidanceGood: "Looks good!",
    characters: "characters",
    thumbsUp: "Like this image",
    thumbsDown: "Dislike this image",
    feedback: "Feedback",
    todayUsage: "Today: {count} / 250 images used",
    saveReminder: "💬 Remember to save images after generation. Resources are limited, please use responsibly.",
    // 下载相关翻译
    downloadingImage: "Downloading image...",
    downloadSuccess: "Image downloaded successfully",
    downloadError: "Failed to download image",
    downloadErrorExpired: "Image URL may have expired. Try regenerating the image.",
    downloadErrorNetwork: "Network error. Please check your connection.",
    // 示例提示词
    examplePrompts: [
      "A cat standing on the moon with humans beside it, Earth in the background, realistic style",
      "A beautiful sunset over a mountain lake with golden light, realistic photo",
      "Future city panorama, skyscrapers towering into the sky, cyberpunk style",
      "Fantasy forest scene, sunlight peaking through leaves, magical atmosphere",
      "An elephant watching TV, home environment, surrealism photo"
    ],
    // 随机提示词模板
    promptTemplates: [
      "A cat in a space suit floating in space with nebulas and planets in the background, photorealistic",
      "An ancient library where books fly and organize themselves, magical light illuminating, surrealism",
      "A crystal castle built on clouds with a rainbow as bridge, dreamlike style",
      "A fox and rabbit having afternoon tea, dressed in Victorian-era clothing, fairy tale style",
      "A city made of giant mechanical gears and antique clock parts, steampunk style",
      "A river of stars flowing across the night sky with glowing creatures around, fantasy art",
      "A miniature world existing on a leaf with tiny houses and inhabitants, macro photography",
      "An abandoned amusement park reclaimed by nature, vines wrapping around roller coasters, realistic style",
      "A city built on giant trees with wooden bridges and lanterns, magical realism",
      "Ancient civilization ruins underwater with statues and buildings, underwater photography effect",
      "A massive crystal ball containing the entire universe, reflecting galaxies and nebulas, concept art",
      "Dinosaurs and modern animals peacefully coexisting in an oasis, nature documentary style",
      "A robot barista making beautiful lattes in a futuristic coffee shop, cyberpunk style",
      "A fantasy world made of candy and desserts, vibrant illustration style",
      "A path built from books leading to a palace of knowledge, surrealist painting",
      "A mysterious figure controlling the weather on a mountaintop, surrounded by lightning and clouds, epic scene",
      "Giant whales swimming in the sky above a city as if in the ocean, surrealism",
      "A palace made of various musical instruments with musical notes floating in the air, fantasy art",
      "An old-fashioned train station with a steam train just arriving, 1920s vintage style",
      "A future city established on the moon surface, domes protecting green vegetation, sci-fi art",
      "A firefly illuminating the entire forest with magical light, dreamy photograph",
      "An ice-sculpted palace with northern lights dancing in the sky, winter wonderland",
      "Giant mechanical creatures coexisting harmoniously with small organic beings, cyborg style",
      "A tunnel through time and space showing important historical moments from ancient to present, concept art",
      "A world made of folded paper including mountains, trees and animals, origami art",
      "A deep-sea octopus conducting an underwater orchestra with sea creatures as musicians, fantasy art",
      "An island floating in the sky with waterfalls cascading down to the clouds below, fantasy landscape",
      "A surreal space made of various clocks where time flows visibly, surrealism",
      "A miniature city built in a bonsai pot with trains circling small mountains and trees, miniature photography",
      "Various fruits floating in space and exploding into juice nebulas, high-speed photography",
      "A being made of light wandering in an ancient forest, emitting mysterious glow, dreamy forest",
      "A bridge connecting two completely different worlds: medieval castle on one side, futuristic city on the other, fantasy concept art",
      "A magic mirror that sees all possible futures, surrounded by mysterious runes, fantasy illustration",
      "An underwater city made of coral and marine life with fish as residents, ocean fantasy",
      "Stunning northern lights with glowing reindeer running in the snow, magical winter scene",
      "A beautiful geisha with cherry blossoms falling around her in an ancient Japanese garden, anime style",
      "A mighty dragon perched on a castle tower with a knight approaching, fantasy digital painting",
      "A stunning portrait of a woman with galaxy and stars as her hair, cosmic fantasy",
      "A samurai standing in a bamboo forest during sunset, foggy atmosphere, dramatic lighting",
      "A futuristic neon-lit street market in Tokyo at night with flying cars, cyberpunk style",
      "An ancient scholar's desk with scrolls, candles, and magical artifacts, detailed illustration",
      "A tree of life with branches reaching to the cosmos and roots connecting to underwater worlds",
      "A Chinese ink painting style landscape with misty mountains and a small boat on a river",
      "A divine being descending from the heavens with light radiating, renaissance style",
      "A realistic portrait of a lion with a majestic galaxy mane, cosmic nature",
      "A fantasy mushroom forest with glowing plants and tiny magical creatures, vibrant colors",
      "A steampunk airship fleet sailing through clouds, detailed mechanical design",
      "A tranquil zen garden with perfect rake patterns in sand, minimalist Japanese style",
      "A door opening between dimensions showing beautiful cosmic phenomena, surrealism",
      "An ancient Egyptian temple with mysterious light beams and hieroglyphics, archaeological style"
    ]
  },
  zh: {
    title: 'Kirami',
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
    slogan: 'AI帮你10秒钟搞定专业设计图',
    testimonial: '只需一句简单的提示词，即可创建精美图像',
    startDescription: '从详细描述开始',
    surpriseMe: '给我惊喜',
    chooseSize: '选择尺寸',
    tryExample: '尝试示例',
    generating: '正在生成',
    cancel: '取消',
    generateAgain: '重新生成',
    goBack: '返回',
    selectImage: '选择此图像',
    aiDisclaimer: "这项技术还在不断改进中，请检查其准确性，如果发现生成的图像有问题，请进行反馈。",
    emptyPromptError: "请先输入描述内容",
    promptGuidanceShort: "更详细的描述可以获得更好的结果",
    promptGuidanceGood: "看起来不错！",
    characters: "字符",
    thumbsUp: "喜欢这张图片",
    thumbsDown: "不喜欢这张图片",
    feedback: "反馈",
    todayUsage: "今日：已用 {count} / 250 张图片",
    saveReminder: "💬 图像生成后记得保存，资源有限，请节约使用～",
    // 下载相关翻译
    downloadingImage: "正在下载图像...",
    downloadSuccess: "图像下载成功",
    downloadError: "下载图像失败",
    downloadErrorExpired: "图像链接可能已过期，请尝试重新生成图像。",
    downloadErrorNetwork: "网络错误，请检查您的连接。",
    // 示例提示词
    examplePrompts: [
      "一只猫站在月球上，旁边还有几个人类，背景是地球，贴近现实",
      "日落时分的山间湖泊，金色阳光照耀，真实照片",
      "未来城市的全景图，高耸入云的摩天大楼，赛博朋克风格",
      "奇幻森林景色，阳光从树叶间穿透，充满魔法的氛围",
      "一头大象看着电视，家居环境，超现实主义照片"
    ],
    // 随机提示词模板
    promptTemplates: [
      "一只穿着太空服的猫咪漂浮在太空中，背景是星云和行星，照片风格",
      "一个古老的图书馆，书籍自动飞舞整理，魔法般的光芒照耀，超现实主义",
      "一座水晶城堡建在云端上，彩虹作为桥梁，梦幻风格",
      "一只狐狸和一只兔子在下午茶，身穿维多利亚时代服装，童话风格",
      "巨大的机械齿轮和老式钟表零件组成的城市，蒸汽朋克风格",
      "一条由星星组成的河流在夜空中流淌，周围有发光的生物，幻想艺术",
      "一个微型世界存在于一片树叶上，有小房子和居民，微距摄影",
      "一个被遗弃的游乐园被大自然重新占领，藤蔓缠绕过山车，写实风格",
      "一座建在巨树上的城市，有木制天桥和灯笼，魔幻现实主义",
      "海底的古代文明遗迹，有雕像和建筑，水下摄影效果",
      "一个巨大的水晶球中包含了整个宇宙，反射出星系和星云，概念艺术",
      "恐龙和现代动物和平共处在一个绿洲中，自然纪录片风格",
      "一位机器人咖啡师在未来风格的咖啡店制作精美的拿铁，赛博朋克风格",
      "一个由糖果和甜点组成的奇幻世界，色彩鲜艳的插画风格",
      "一条由书本搭建的路通向一座知识宫殿，超现实主义绘画",
      "一个能控制天气的神秘人物站在山顶，周围有闪电和云雾，史诗般的场景",
      "巨大的鲸鱼在城市的天空中游弋，如同在海洋中一样，超现实主义",
      "一座由各种乐器组成的宫殿，音符在空中飘舞，幻想艺术",
      "一个老式火车站，蒸汽火车刚刚进站，1920年代的复古风格",
      "在月球表面建立的未来城市，穹顶保护着绿色植被，科幻艺术",
      "一只萤火虫照亮了整个森林，魔法般的光芒，梦幻照片",
      "一座由冰雕成的宫殿，北极光在天空中舞动，冬季仙境",
      "巨型机械生物和小型有机生物和谐共处，赛博格风格",
      "一条穿越时空的隧道，展示从古至今的重要历史时刻，概念艺术",
      "一个由纸折成的世界，包括山脉、树木和动物，折纸艺术",
      "深海章鱼指挥着水下管弦乐队，海洋生物作为乐手，奇幻艺术",
      "一座漂浮在天空中的岛屿，有瀑布垂落到下方的云层，幻想风景",
      "一个由各种钟表组成的超现实空间，时间以可视方式流动，超现实主义",
      "一个微缩的城市建在盆栽中，火车环绕着小山和树木行驶，微缩摄影",
      "各种水果在太空中漂浮并爆炸成汁液星云，高速摄影",
      "一个由光组成的存在在古老森林中游荡，发出神秘光芒，梦幻森林",
      "一座桥梁连接两个截然不同的世界：一边是中世纪城堡，另一边是未来都市，幻想概念艺术",
      "一个能看到所有可能未来的魔法镜子，周围环绕着神秘符文，奇幻插画",
      "一个由珊瑚和海洋生物组成的水下城市，鱼类作为居民，海洋幻想",
      "绚丽的北极光下，一群发光的驯鹿在雪地上奔跑，魔幻冬季场景",
      "一位美丽的艺妓站在古代日本花园中，樱花飘落在她周围，动漫风格",
      "一条强大的龙栖息在城堡塔楼上，一位骑士正在接近，奇幻数字绘画",
      "一幅令人惊叹的女性肖像，她的头发是星系和星星组成的，宇宙幻想",
      "一位武士站在日落时分的竹林中，雾气环绕，戏剧性的光影效果",
      "未来东京夜晚霓虹灯照亮的街头市场，有飞行汽车，赛博朋克风格",
      "古代学者的书桌，上面有卷轴、蜡烛和魔法神器，细节丰富的插画",
      "生命之树，树枝延伸至宇宙，根部连接水下世界",
      "中国水墨画风格的风景，有云雾缭绕的山脉和河上的小船",
      "一位神圣的存在从天堂降临，光芒四射，文艺复兴风格",
      "一幅写实的狮子肖像，有壮丽的星系鬃毛，宇宙自然",
      "一片幻想蘑菇森林，有发光的植物和微小的魔法生物，色彩鲜艳",
      "蒸汽朋克风格的飞艇舰队在云中航行，精细的机械设计",
      "宁静的禅宗花园，沙地上有完美的耙痕图案，极简主义日本风格",
      "一扇连接不同维度的门，展示着美丽的宇宙现象，超现实主义",
      "一座古埃及神庙，有神秘的光束和象形文字，考古风格"
    ]
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
    // 优先使用保存的语言设置，其次是浏览器语言（如果支持），最后才是默认语言
    // 优先使用中文作为默认语言
    let defaultLocale: Locale = 'zh';
    
    if (savedLocale && supportedLocales.includes(savedLocale)) {
      defaultLocale = savedLocale;
    } else if (browserLocale && supportedLocales.includes(browserLocale)) {
      defaultLocale = browserLocale;
    }
    
    globalLocale = defaultLocale;
    setLocale(defaultLocale);
    localStorage.setItem('locale', defaultLocale);
  }, []);

  const changeLocale = (newLocale: Locale) => {
    globalLocale = newLocale;
    setLocale(newLocale);
    localStorage.setItem('locale', newLocale);
    
    // 强制刷新页面以应用新语言
    window.location.reload();
  };

  // 修改t函数确保返回正确的类型
  const t = (key: keyof TranslationType): string => {
    const value = translations[locale][key] || translations.en[key];
    // 确保返回字符串类型，如果是数组则返回第一个元素或空字符串
    if (Array.isArray(value)) {
      return value[0] || '';
    }
    return value as string;
  };

  // 添加特殊函数来获取字符串数组（如提示词列表）
  const tArray = (key: 'examplePrompts' | 'promptTemplates'): string[] => {
    const value = translations[locale][key] || translations.en[key];
    return value as string[];
  };

  return { 
    t, 
    tArray,
    locale, 
    changeLocale, 
    supportedLocales: Object.keys(translations) as Locale[] 
  };
}; 