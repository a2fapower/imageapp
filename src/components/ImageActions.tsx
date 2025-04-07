import React from 'react';
import { ArrowDownTrayIcon, DocumentDuplicateIcon, ShareIcon } from '@heroicons/react/24/outline';
import { toast } from 'react-hot-toast';
import { useTranslation } from '@/lib/i18n';

interface ImageActionsProps {
  imageUrl: string | null;
  prompt: string;
  hideShareCopy?: boolean;
}

const ImageActions: React.FC<ImageActionsProps> = ({ imageUrl, prompt, hideShareCopy = false }) => {
  const { t } = useTranslation();
  
  if (!imageUrl) return null;

  const downloadImage = async () => {
    try {
      toast.loading('Downloading image...');
      
      // 使用我们的代理API
      const response = await fetch('/api/download', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ imageUrl }),
      });
      
      if (!response.ok) {
        throw new Error(`Download failed: ${response.status} ${response.statusText}`);
      }
      
      // 获取图像blob
      const blob = await response.blob();
      
      // 创建一个blob URL
      const url = window.URL.createObjectURL(blob);
      
      // 创建一个临时链接元素
      const link = document.createElement('a');
      link.href = url;
      link.download = `kira-image-${Date.now()}.png`;
      
      // 添加到DOM，点击并移除
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      
      // 释放blob URL
      window.URL.revokeObjectURL(url);
      
      toast.dismiss();
      toast.success('Image downloaded successfully');
    } catch (error) {
      console.error('Error downloading image:', error);
      toast.dismiss();
      toast.error('Failed to download image');
    }
  };

  const copyPrompt = () => {
    navigator.clipboard.writeText(prompt)
      .then(() => toast.success('Prompt copied to clipboard'))
      .catch(() => toast.error('Failed to copy prompt'));
  };
  
  const shareImage = () => {
    if (navigator.share) {
      navigator.share({
        title: 'Kira Generated Image',
        text: prompt,
        url: imageUrl
      })
        .then(() => toast.success('Shared successfully'))
        .catch((error) => {
          console.error('Error sharing:', error);
          toast.error('Failed to share');
        });
    } else {
      copyPrompt();
      toast.success('Prompt copied. Share functionality not available in this browser.');
    }
  };

  return (
    <div className="flex flex-wrap gap-3 mt-6">
      <button
        onClick={downloadImage}
        className="btn-primary flex items-center gap-2 py-2 px-4"
      >
        <ArrowDownTrayIcon className="h-4 w-4" />
        <span>{t('download')}</span>
      </button>
      
      {!hideShareCopy && (
        <>
          <button
            onClick={copyPrompt}
            className="btn-secondary flex items-center gap-2 py-2 px-4"
          >
            <DocumentDuplicateIcon className="h-4 w-4" />
            <span>{t('copyPrompt')}</span>
          </button>
          
          <button
            onClick={shareImage}
            className="btn-secondary flex items-center gap-2 py-2 px-4"
          >
            <ShareIcon className="h-4 w-4" />
            <span>{t('share')}</span>
          </button>
        </>
      )}
    </div>
  );
};

export default ImageActions; 