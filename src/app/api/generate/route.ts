import { NextResponse } from 'next/server';
import OpenAI from 'openai';

// 初始化OpenAI客户端
const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

export async function POST(request: Request) {
  try {
    const { prompt, size } = await request.json();
    
    if (!prompt) {
      return NextResponse.json({ error: 'Prompt is required' }, { status: 400 });
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
  } catch (error) {
    console.error('Error generating image:', error);
    return NextResponse.json(
      { error: error instanceof Error ? error.message : 'Failed to generate image' },
      { status: 500 }
    );
  }
} 