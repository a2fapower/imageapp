import { NextResponse } from 'next/server';
// import OpenAI from 'openai';

export const maxDuration = 60; // 设置最大执行时间为60秒

// 模拟图像URL数组，用于测试
const MOCK_IMAGES = [
  '/examples/moon-cat.jpg',
  '/examples/mountain-lake-sunset.jpg',
];

export async function POST(request: Request) {
  try {
    const { prompt, size = "1024x1024" } = await request.json();
    
    if (!prompt) {
      return NextResponse.json({ error: "提示词是必需的" }, { status: 400 });
    }
    
    console.log("模拟生成图像，提示词:", prompt, "尺寸:", size);
    
    // 模拟API延迟，让用户体验进度页面
    await new Promise(resolve => setTimeout(resolve, 3000));
    
    // 随机选择两张不同的测试图像
    const availableImages = [...MOCK_IMAGES];
    const imageUrls = [];
    
    // 选择第一张图
    const firstIndex = Math.floor(Math.random() * availableImages.length);
    imageUrls.push(availableImages[firstIndex]);
    availableImages.splice(firstIndex, 1);
    
    // 选择第二张图（确保与第一张不同）
    const secondIndex = Math.floor(Math.random() * availableImages.length);
    imageUrls.push(availableImages[secondIndex]);
    
    // 构建修改后的提示词（模拟DALL-E的修改行为）
    const revisedPrompt = `${prompt} (高清, 专业级照片, 强烈的视觉效果)`;
    
    console.log("模拟图像生成成功，使用样本图片:", imageUrls);
    
    return NextResponse.json({
      imageUrls: imageUrls,
      revisedPrompt: revisedPrompt,
    });
  } catch (error: any) {
    console.error("图像生成错误:", error.message);
    
    // 确保返回一个有效的JSON响应
    return new Response(
      JSON.stringify({
        error: "生成图像时出错",
        message: error.message || "未知错误"
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
