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
    
    // 检查是否有OpenAI API密钥
    const apiKey = process.env.OPENAI_API_KEY;
    console.log("API密钥状态:", apiKey ? "已设置" : "未设置");
    
    // 如果有API密钥，调用真实的OpenAI API
    if (apiKey && apiKey !== "your_openai_api_key_here") {
      console.log("正在调用OpenAI API生成图像，提示词:", prompt);
      
      try {
        const openai = new OpenAI({
          apiKey: apiKey
        });
        
        // 转换尺寸格式为OpenAI API需要的格式
        let dalleSize;
        switch (size) {
          case "1024x1024":
            dalleSize = "1024x1024";
            break;
          case "1024x1792":
            dalleSize = "1024x1792";
            break;
          case "1792x1024":
            dalleSize = "1792x1024";
            break;
          default:
            dalleSize = "1024x1024";
        }
        
        console.log("调用DALL-E API, 尺寸:", dalleSize);
        
        const response = await openai.images.generate({
          model: "dall-e-3", // 或 "dall-e-2" 根据您的需求
          prompt: prompt,
          n: 1, // 图像数量
          size: dalleSize as "1024x1024" | "1024x1792" | "1792x1024",
        });
        
        // 获取图像URL和修改后的提示词
        const imageUrl = response.data[0].url;
        const revisedPrompt = response.data[0].revised_prompt || prompt;
        
        console.log("OpenAI图像生成成功, 返回URL:", imageUrl?.substring(0, 30) + "...");
        
        return NextResponse.json({
          imageUrls: [imageUrl],
          revisedPrompt: revisedPrompt,
        });
      } catch (apiError: any) {
        console.error("OpenAI API错误:", apiError.message, apiError.stack);
        console.log("回退到模拟图像...");
        
        // API调用失败，回退到模拟数据
        const shuffledImages = [...MOCK_IMAGES].sort(() => 0.5 - Math.random());
        const imageUrls = shuffledImages.slice(0, 2);
        const revisedPrompt = `${prompt} (API调用失败，使用模拟图像)`;
        
        return NextResponse.json({
          imageUrls: imageUrls,
          revisedPrompt: revisedPrompt,
          error: apiError.message
        });
      }
    } 
    // 如果没有API密钥，使用模拟数据
    else {
      console.log("使用模拟数据，无API密钥或密钥为占位符");
      console.log("模拟生成图像，提示词:", prompt, "尺寸:", size);
      
      // 模拟API延迟
      await new Promise(resolve => setTimeout(resolve, 3000));
      
      // 生成2张随机不重复的图片URL
      const shuffledImages = [...MOCK_IMAGES].sort(() => 0.5 - Math.random());
      const imageUrls = shuffledImages.slice(0, 2);
      
      // 构建修改后的提示词（模拟DALL-E的修改行为）
      const revisedPrompt = `${prompt} (高清, 专业级照片, 强烈的视觉效果)`;
      
      console.log("模拟图像生成成功，使用样本图片:", imageUrls);
      
      return NextResponse.json({
        imageUrls: imageUrls,
        revisedPrompt: revisedPrompt,
      });
    }
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
