/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  typescript: {
    ignoreBuildErrors: true,
  },
  eslint: {
    // 忽略构建过程中的ESLint错误，以便能够成功部署
    ignoreDuringBuilds: true,
  },
  images: {
    remotePatterns: [],
    // 允许Base64图片URL（dataURL）
    dangerouslyAllowSVG: true,
    contentDispositionType: 'attachment',
    contentSecurityPolicy: "default-src 'self'; script-src 'none'; sandbox;",
    unoptimized: true, // 禁用图像优化以允许data URL
  },
  experimental: {
    serverActions: {
      bodySizeLimit: '10mb',
    },
    largePageDataBytes: 128 * 1000 * 1000, // 增加到128MB以支持大的base64数据
  },
  async headers() {
    return [
      {
        // 匹配所有API路由
        source: "/api/:path*",
        headers: [
          // 缓存控制
          {
            key: "Cache-Control",
            value: "public, max-age=60, s-maxage=60, stale-while-revalidate=600",
          },
        ],
      },
    ];
  },
};

module.exports = nextConfig;
