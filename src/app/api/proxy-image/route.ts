import { NextResponse } from 'next/server';

export const maxDuration = 60; // 设置最大执行时间为60秒

export async function GET(request: Request) {
  try {
    // 从URL参数中获取图片URL
    const { searchParams } = new URL(request.url);
    const imageUrl = searchParams.get('url');
    
    if (!imageUrl) {
      return NextResponse.json({ error: 'Image URL is required' }, { status: 400 });
    }
    
    // 解码URL（可能进行了多次编码）
    let decodedUrl = decodeURIComponent(imageUrl);
    
    console.log('Proxying image:', decodedUrl.substring(0, 50) + '...');
    
    // 从OpenAI服务器获取图像
    const response = await fetch(decodedUrl, {
      headers: {
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36'
      }
    });
    
    if (!response.ok) {
      throw new Error(`Failed to fetch image: ${response.status} ${response.statusText}`);
    }
    
    // 获取图像数据
    const imageData = await response.arrayBuffer();
    const contentType = response.headers.get('content-type') || 'image/png';
    
    // 返回图像数据
    return new NextResponse(imageData, {
      headers: {
        'Content-Type': contentType,
        'Cache-Control': 'public, max-age=31536000', // 缓存1年
      },
    });
  } catch (error) {
    console.error('Error proxying image:', error);
    return NextResponse.json(
      { error: error instanceof Error ? error.message : 'Failed to proxy image' },
      { status: 500 }
    );
  }
} 