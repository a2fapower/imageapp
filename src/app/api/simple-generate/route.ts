import { NextResponse } from 'next/server';
import OpenAI from 'openai';

export const maxDuration = 60; // 设置最大执行时间为60秒

// 如果没有API密钥，使用模拟图像
const MOCK_IMAGES = [
  '/examples/moon-cat.jpg',
  '/examples/mountain-lake-sunset.jpg',
  '/examples/city-future.jpg',
  '/examples/fantasy-forest.jpg',
  '/examples/elephant-tv.jpg',
];

export async function POST(request: Request) {
  try {
    const { prompt, size = "1024x1024" } = await request.json();
    
    if (!prompt) {
      return NextResponse.json({ error: "提示词是必需的" }, { status: 400 });
    }
    
    // 不再检查API密钥，总是使用模拟数据
    console.log("使用模拟数据（API调用已禁用）");
    console.log("模拟生成图像，提示词:", prompt, "尺寸:", size);
    
    // 模拟API延迟
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    // 生成随机不重复的图片URL
    const shuffledImages = [...MOCK_IMAGES].sort(() => 0.5 - Math.random());
    const imageUrls = shuffledImages.slice(0, 1);
    
    // 构建修改后的提示词（模拟DALL-E的修改行为）
    const revisedPrompt = `${prompt} (高清, 专业级照片, 强烈的视觉效果)`;
    
    console.log("模拟图像生成成功，使用样本图片:", imageUrls);
    
    // 添加尺寸信息到URL中，以便前端可以识别
    const imageUrlsWithSize = imageUrls.map(url => 
      url.includes('?') ? `${url}&size=${size}` : `${url}?size=${size}`
    );
    
    return NextResponse.json({
      imageUrls: imageUrlsWithSize,
      revisedPrompt: revisedPrompt,
    });
  } catch (error: any) {
    console.error("图像生成错误:", error.message, error.stack);
    
    // 确保返回一个有效的JSON响应
    return new Response(
      JSON.stringify({
        error: "生成图像时出错",
        message: error.message || "未知错误",
        stack: error.stack
      }),
      {
        status: 500,
        headers: {
          "Content-Type": "application/json"
        }
      }
    );
  }
}
