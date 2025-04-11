import React, { useState } from 'react';
import useQueueManager from '@/lib/useQueueManager';

interface QueueExampleProps {
  onGenerate?: () => Promise<void>;
}

/**
 * 展示如何使用队列管理器的示例组件
 */
const QueueExample: React.FC<QueueExampleProps> = ({ onGenerate }) => {
  const { activeCount, increase, decrease, reset, hasActiveRequests, generateWithQueue } = useQueueManager();
  const [statusMessages, setStatusMessages] = useState<string[]>([]);

  // 添加状态消息
  const addStatusMessage = (message: string) => {
    setStatusMessages(prev => [message, ...prev].slice(0, 5));
  };

  // 模拟图像生成过程 - 手动管理计数的方式
  const handleGenerateImageManual = async () => {
    try {
      // 增加活动请求计数
      increase();
      addStatusMessage('开始生成图像（手动计数方式）');
      
      // 执行生成操作
      if (onGenerate) {
        await onGenerate();
      } else {
        // 模拟API请求延迟
        await new Promise(resolve => setTimeout(resolve, 2000));
      }
      
      addStatusMessage('图像生成成功');
    } catch (error) {
      console.error('图像生成失败:', error);
      addStatusMessage('图像生成失败');
    } finally {
      // 无论成功或失败，都要减少活动请求计数
      decrease();
    }
  };

  // 模拟图像生成过程 - 使用队列管理的方式
  const handleGenerateImageWithQueue = async () => {
    addStatusMessage('请求进入队列...');
    
    // 使用队列管理工具生成图像
    await generateWithQueue(async () => {
      addStatusMessage('开始生成图像（队列管理方式）');
      
      // 执行生成操作
      if (onGenerate) {
        await onGenerate();
      } else {
        // 模拟API请求延迟
        await new Promise(resolve => setTimeout(resolve, 2000));
      }
      
      addStatusMessage('图像生成成功');
    });
  };

  return (
    <div className="p-4 border rounded-lg bg-white shadow-sm">
      <h3 className="text-lg font-medium mb-4">队列管理示例</h3>
      
      <div className="mb-4">
        <p className="text-gray-700">
          当前活动请求数: <span className="font-bold">{activeCount}</span>
        </p>
        
        {hasActiveRequests && (
          <p className="mt-1 text-blue-600">
            有正在进行的图像生成请求
          </p>
        )}
      </div>
      
      <div className="flex flex-wrap gap-2 mb-4">
        <button 
          onClick={handleGenerateImageManual}
          className="px-3 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors"
        >
          手动方式生成
        </button>
        
        <button 
          onClick={handleGenerateImageWithQueue}
          className="px-3 py-2 bg-indigo-600 text-white rounded-md hover:bg-indigo-700 transition-colors"
        >
          队列方式生成
        </button>
        
        <button 
          onClick={decrease}
          className="px-3 py-2 bg-gray-200 text-gray-800 rounded-md hover:bg-gray-300 transition-colors"
          disabled={!hasActiveRequests}
        >
          手动减少计数
        </button>
        
        <button 
          onClick={reset}
          className="px-3 py-2 bg-red-600 text-white rounded-md hover:bg-red-700 transition-colors"
          disabled={!hasActiveRequests}
        >
          重置计数
        </button>
      </div>
      
      {statusMessages.length > 0 && (
        <div className="mt-4 border rounded p-2">
          <h4 className="text-sm font-medium mb-2">状态消息：</h4>
          <ul className="text-sm">
            {statusMessages.map((msg, index) => (
              <li key={index} className="border-b last:border-0 py-1">
                {msg}
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
};

export default QueueExample; 