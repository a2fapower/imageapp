# Kirami 图像生成应用

这是一个基于 [Next.js](https://nextjs.org) 的AI图像生成应用，支持文本到图像的生成功能。

## 功能特点

- 多语言支持（中文和英文）
- 响应式布局设计
- 支持多种图像比例（1:1, 16:9, 9:16）
- 生成历史记录
- 提示词建议

## 快速开始

首先，克隆项目并安装依赖：

```bash
git clone https://github.com/yourusername/kirami-imageapp.git
cd kirami-imageapp
npm install
```

然后，创建一个 `.env.local` 文件并添加以下环境变量：

```
OPENAI_API_KEY=your_openai_api_key_here
```

如果没有提供API密钥，应用将使用示例图像进行模拟。

最后，运行开发服务器：

```bash
npm run dev
```

打开 [http://localhost:3000](http://localhost:3000)（或系统分配的其他端口）浏览应用。

## 部署

### 部署到Vercel

推荐使用 [Vercel平台](https://vercel.com/new) 部署此Next.js应用：

1. 将代码推送到GitHub仓库
2. 在Vercel导入项目
3. 添加环境变量
4. 点击部署

### 其他部署方式

也可以构建项目并在任何支持Node.js的环境中运行：

```bash
npm run build
npm run start
```

## 本地开发

```bash
# 启动开发服务器
npm run dev

# 运行ESLint检查
npm run lint

# 构建生产版本
npm run build
```

## 技术栈

- [Next.js 15](https://nextjs.org/)
- [React 19](https://react.dev/)
- [TailwindCSS](https://tailwindcss.com/)
- [OpenAI API](https://platform.openai.com/)

## 注意事项

- 此应用使用OpenAI的DALL-E 3模型生成图像
- 生成图像需要OpenAI API密钥
- 如需在生产环境使用，请确保遵循OpenAI的使用政策

## Getting Started

First, run the development server:

```bash
npm run dev
# or
yarn dev
# or
pnpm dev
# or
bun dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

You can start editing the page by modifying `app/page.tsx`. The page auto-updates as you edit the file.

This project uses [`next/font`](https://nextjs.org/docs/app/building-your-application/optimizing/fonts) to automatically optimize and load [Geist](https://vercel.com/font), a new font family for Vercel.

## Learn More

To learn more about Next.js, take a look at the following resources:

- [Next.js Documentation](https://nextjs.org/docs) - learn about Next.js features and API.
- [Learn Next.js](https://nextjs.org/learn) - an interactive Next.js tutorial.

You can check out [the Next.js GitHub repository](https://github.com/vercel/next.js) - your feedback and contributions are welcome!

## Deploy on Vercel

The easiest way to deploy your Next.js app is to use the [Vercel Platform](https://vercel.com/new?utm_medium=default-template&filter=next.js&utm_source=create-next-app&utm_campaign=create-next-app-readme) from the creators of Next.js.

Check out our [Next.js deployment documentation](https://nextjs.org/docs/app/building-your-application/deploying) for more details.
