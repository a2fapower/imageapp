/** @type {import("next").NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  typescript: {
    // !! 警告 !!
    // TypeScript错误会被忽略
    ignoreBuildErrors: true,
  },
  eslint: {
    // ESLint错误会被忽略
    ignoreDuringBuilds: true,
  },
  images: {
    domains: ["oaidalleapiprodscus.blob.core.windows.net"],
  },
};

module.exports = nextConfig;
