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
      const toastId = toast.loading(t('downloadingImage').toString());
      
      if (imageUrl.startsWith('data:')) {
        // 如果已经是data URL，直接使用
        const link = document.createElement('a');
        link.href = imageUrl;
        link.download = `kira-image-${Date.now()}.png`;
        
        // 添加到DOM，点击并移除
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
        
        toast.dismiss(toastId);
        toast.success(t('downloadSuccess').toString());
      } else {
        // 对于OpenAI URL，使用后端代理下载
        console.log('使用API下载图像URL:', imageUrl.substring(0, 50) + '...');
        
        // 先检查URL是否有效
        if (!imageUrl.startsWith('http')) {
          throw new Error('Invalid image URL');
        }
        
        const response = await fetch('/api/download', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({ imageUrl }),
        });
        
        if (!response.ok) {
          const errorText = await response.text();
          console.error('Download API error:', response.status, errorText);
          throw new Error(`Download failed: ${response.status}`);
        }
        
        // 检查响应类型
        const contentType = response.headers.get('content-type');
        if (contentType && contentType.includes('application/json')) {
          // 如果返回JSON，可能是错误
          const errorData = await response.json();
          throw new Error(errorData.error || 'Unknown error');
        }
        
        // 获取图像blob
        const blob = await response.blob();
        
        if (blob.size === 0) {
          throw new Error('Received empty image data');
        }
        
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
        
        toast.dismiss(toastId);
        toast.success(t('downloadSuccess').toString());
      }
    } catch (error) {
      console.error('Error downloading image:', error);
      toast.dismiss();
      
      // 针对常见错误提供更具体的消息
      const errorMessage = error instanceof Error ? error.message : 'Unknown error';
      if (errorMessage.includes('Failed to fetch')) {
        toast.error(t('downloadErrorExpired').toString());
      } else if (errorMessage.includes('Network Error')) {
        toast.error(t('downloadErrorNetwork').toString());
      } else {
        toast.error(`${t('downloadError').toString()}: ${errorMessage}`);
      }
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