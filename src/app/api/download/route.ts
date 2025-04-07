import { NextResponse } from 'next/server';

export async function POST(request: Request) {
  try {
    const { imageUrl } = await request.json();
    
    if (!imageUrl) {
      return NextResponse.json({ error: 'Image URL is required' }, { status: 400 });
    }
    
    // 从OpenAI服务器获取图像
    const response = await fetch(imageUrl);
    
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
        'Content-Disposition': 'attachment; filename="kira-image.png"',
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