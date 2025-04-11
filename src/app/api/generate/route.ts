import { NextResponse } from 'next/server';
import OpenAI from 'openai';

// 模拟图像数据
const MOCK_IMAGES = [
  '/examples/moon-cat.jpg',
  '/examples/mountain-lake-sunset.jpg',
  '/examples/city-future.jpg',
  '/examples/fantasy-forest.jpg',
  '/examples/elephant-tv.jpg',
];

export async function POST(request: Request) {
  try {
    const { prompt, size } = await request.json();
    
    if (!prompt) {
      return NextResponse.json({ error: 'Prompt is required' }, { status: 400 });
    }
    
    console.log("使用模拟数据（API调用已禁用）");
    console.log("模拟生成图像，提示词:", prompt);
    
    // 模拟API延迟
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    // 随机选择一张图片
    const randomIndex = Math.floor(Math.random() * MOCK_IMAGES.length);
    const imageUrl = MOCK_IMAGES[randomIndex];
    
    // 构建修改后的提示词
    const revisedPrompt = `${prompt} (高清, 专业级照片, 强烈的视觉效果)`;
    
    return NextResponse.json({ imageUrl, revisedPrompt });
  } catch (error: any) {
    console.error('Error generating image:', error);
    
    // 改进错误处理，确保返回有效的JSON
    return NextResponse.json(
      { 
        error: error.message || "生成图像过程中发生错误",
        details: error.response?.data || {},
        code: error.status || 500
      },
      { status: error.status || 500 }
    );
  }
}
