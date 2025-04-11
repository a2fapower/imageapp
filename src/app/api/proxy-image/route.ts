import { NextResponse } from 'next/server';

export const maxDuration = 60; // 设置最大执行时间为60秒
export const dynamic = 'force-dynamic'; // 避免缓存问题

export async function GET(request: Request) {
  try {
    // 从URL参数中获取图片URL
    const { searchParams } = new URL(request.url);
    const imageUrl = searchParams.get('url');
    
    if (!imageUrl) {
      return NextResponse.json({ error: 'Image URL is required' }, { status: 400 });
    }
    
    // 解码URL（可能进行了多次编码）
    const decodedUrl = decodeURIComponent(imageUrl);
    
    console.log('Proxying image:', decodedUrl.substring(0, 50) + '...');
    
    // 从OpenAI服务器获取图像
    const response = await fetch(decodedUrl, {
      headers: {
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36',
        'Accept': 'image/*, */*;q=0.8'
      },
      next: { revalidate: 0 }, // 不使用缓存
      cache: 'no-store'
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
    
    console.log(`Image proxied successfully, size: ${imageData.byteLength} bytes`);
    
    const contentType = response.headers.get('content-type') || 'image/png';
    
    // 返回图像数据
    return new NextResponse(imageData, {
      headers: {
        'Content-Type': contentType,
        'Cache-Control': 'public, max-age=31536000', // 缓存1年
        'Access-Control-Allow-Origin': '*', // 允许跨域
        'Access-Control-Allow-Methods': 'GET, OPTIONS',
        'Access-Control-Max-Age': '86400',
      },
    });
  } catch (error) {
    console.error('Error proxying image:', error);
    
    // 返回一个默认的错误图像或错误响应
    return new Response(
      JSON.stringify({ error: error instanceof Error ? error.message : 'Failed to proxy image' }),
      {
        status: 500,
        headers: {
          'Content-Type': 'application/json',
          'Cache-Control': 'no-cache, no-store, must-revalidate',
        }
      }
    );
  }
} 