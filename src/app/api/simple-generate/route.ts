import { NextResponse } from 'next/server';
import OpenAI from 'openai';

export const maxDuration = 60; // 设置最大执行时间为60秒

export async function POST(request: Request) {
  try {
    const { prompt, size = "1024x1024" } = await request.json();
    
    if (!prompt) {
      return NextResponse.json({ error: "提示词是必需的" }, { status: 400 });
    }
    
    const openai = new OpenAI({
      apiKey: process.env.OPENAI_API_KEY,
    });
    
    console.log("正在生成图像，提示词:", prompt, "尺寸:", size);
    
    // DALL-E 3 仅支持 1024x1024, 1024x1792, 1792x1024 尺寸
    // DALL-E 2 支持 256x256, 512x512, 1024x1024
    
    // 确保尺寸兼容 DALL-E 3
    let dalleSize: "1024x1024" | "1024x1792" | "1792x1024" = "1024x1024";
    
    if (size === "1024x1792" || size === "1792x1024") {
      dalleSize = size as "1024x1792" | "1792x1024";
    }
    
    const response = await openai.images.generate({
      model: "dall-e-3", // 明确指定使用 DALL-E 3
      prompt: prompt,
      n: 1,
      size: dalleSize,
    });
    
    if (!response.data[0].url) {
      throw new Error("未能获取图像URL");
    }
    
    console.log("图像生成成功，URL:", response.data[0].url?.substring(0, 20) + "...");
    
    // 立即下载图像数据
    const imageResponse = await fetch(response.data[0].url, {
      headers: {
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36'
      }
    });
    
    if (!imageResponse.ok) {
      throw new Error(`无法获取图像数据: ${imageResponse.status} ${imageResponse.statusText}`);
    }
    
    // 获取图像数据为Buffer
    const imageBuffer = await imageResponse.arrayBuffer();
    
    // 获取图像内容类型
    const contentType = imageResponse.headers.get('content-type') || 'image/png';
    
    // 将图像数据转换为Base64
    const base64Image = Buffer.from(imageBuffer).toString('base64');
    const dataURL = `data:${contentType};base64,${base64Image}`;
    
    return NextResponse.json({
      imageUrl: dataURL,
      revisedPrompt: response.data[0].revised_prompt,
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
