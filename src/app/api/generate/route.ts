import { NextResponse } from 'next/server';
import OpenAI from 'openai';

// 初始化OpenAI客户端
const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
  timeout: 60000, // 添加60秒超时设置
});

export async function POST(request: Request) {
  try {
    const { prompt, size } = await request.json();
    
    if (!prompt) {
      return NextResponse.json({ error: 'Prompt is required' }, { status: 400 });
    }
    
    // 检查API密钥是否配置
    if (!process.env.OPENAI_API_KEY) {
      return NextResponse.json(
        { error: "OpenAI API key is not configured" },
        { status: 500 }
      );
    }
    
    // 根据选择的尺寸设置DALL-E参数
    let dalleSize;
    switch (size) {
      case '1024x1024':
        dalleSize = '1024x1024';
        break;
      case '1024x1792':
        dalleSize = '1024x1792';
        break;
      case '1792x1024':
        dalleSize = '1792x1024';
        break;
      default:
        dalleSize = '1024x1024';
    }
    
    // 调用OpenAI API生成图像
    const response = await openai.images.generate({
      model: "dall-e-3",
      prompt: prompt,
      n: 1,
      size: dalleSize as "1024x1024" | "1024x1792" | "1792x1024",
    });
    
    const imageUrl = response.data[0].url;
    const revisedPrompt = response.data[0].revised_prompt;
    
    return NextResponse.json({ imageUrl, revisedPrompt });
  } catch (error: any) {
    console.error('Error generating image:', error);
    
    // 特别处理账单限额错误
    if (error.message && error.message.includes('Billing hard limit')) {
      return NextResponse.json(
        { 
          error: "OpenAI API billing limit reached. Please try again later.",
          code: 429,
          billingError: true
        },
        { status: 429 }
      );
    }
    
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
