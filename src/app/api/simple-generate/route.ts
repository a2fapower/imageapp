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
    
    const response = await openai.images.generate({
      prompt,
      n: 1,
      size: size as "1024x1024" | "1024x1792" | "1792x1024",
    });
    
    console.log("图像生成成功，URL:", response.data[0].url?.substring(0, 20) + "...");
    
    return NextResponse.json({
      imageUrl: response.data[0].url,
      revisedPrompt: response.data[0].revised_prompt,
    });
  } catch (error: any) {
    console.error("图像生成错误:", error.message);
    
    // 确保返回一个有效的JSON响应
    return new Response(
      JSON.stringify({
        error: "生成图像时出错",
        message: error.message
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
