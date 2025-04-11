import { NextResponse } from 'next/server';

export const maxDuration = 60; // 设置最大执行时间为60秒
export const dynamic = 'force-dynamic'; // 避免缓存问题

export async function POST(request: Request) {
  try {
    const { imageUrl } = await request.json();
    
    if (!imageUrl) {
      return NextResponse.json({ error: 'Image URL is required' }, { status: 400 });
    }
    
    console.log('Downloading image:', imageUrl.substring(0, 50) + '...');
    
    // 从OpenAI服务器获取图像
    const response = await fetch(imageUrl, {
      headers: {
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36',
        'Accept': 'image/*'
      },
      cache: 'no-store' // 确保不使用缓存
    });
    
    if (!response.ok) {
      console.error(`Failed to fetch image: ${response.status} ${response.statusText}`);
      throw new Error(`Failed to fetch image: ${response.status} ${response.statusText}`);
    }
    
    // 获取图像数据
    const imageData = await response.arrayBuffer();
    
    if (!imageData || imageData.byteLength === 0) {
      console.error('Received empty image data');
      throw new Error('Received empty image data');
    }
    
    console.log(`Successfully fetched image, size: ${imageData.byteLength} bytes`);
    
    const contentType = response.headers.get('content-type') || 'image/png';
    
    // 返回图像数据
    return new NextResponse(imageData, {
      headers: {
        'Content-Type': contentType,
        'Content-Disposition': 'attachment; filename="kira-image.png"',
        'Cache-Control': 'no-cache, no-store, must-revalidate',
        'Pragma': 'no-cache',
        'Expires': '0'
      },
    });
  } catch (error) {
    console.error('Error downloading image:', error);
    return NextResponse.json(
      { error: error instanceof Error ? error.message : 'Failed to download image' },
      { status: 500 }
    );
  }
} 