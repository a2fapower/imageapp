import { useState, useEffect, useCallback } from 'react';
import { 
  getActiveCount, 
  increaseCount, 
  decreaseCount, 
  resetCount,
  enterQueueAndGenerate
} from './queueManager';

/**
 * React Hook，用于管理图像生成队列
 * 提供队列状态和操作方法，并在组件间保持同步
 */
export const useQueueManager = () => {
  const [activeCount, setActiveCount] = useState<number>(0);
  
  // 初始化和同步状态
  useEffect(() => {
    // 首次加载时获取当前计数
    setActiveCount(getActiveCount());
    
    // 创建事件监听器，以便在其他组件/标签页中更改计数时同步
    const handleStorageChange = (e: StorageEvent) => {
      if (e.key === 'imageapp_active_requests') {
        const newCount = e.newValue ? parseInt(e.newValue, 10) : 0;
        setActiveCount(newCount);
      }
    };
    
    // 添加事件监听器
    window.addEventListener('storage', handleStorageChange);
    
    // 清理监听器
    return () => {
      window.removeEventListener('storage', handleStorageChange);
    };
  }, []);
  
  // 增加请求计数
  const increase = useCallback(() => {
    const newCount = increaseCount();
    setActiveCount(newCount);
    return newCount;
  }, []);
  
  // 减少请求计数
  const decrease = useCallback(() => {
    const newCount = decreaseCount();
    setActiveCount(newCount);
    return newCount;
  }, []);
  
  // 重置请求计数
  const reset = useCallback(() => {
    const newCount = resetCount();
    setActiveCount(newCount);
    return newCount;
  }, []);
  
  // 进入队列并生成
  const generateWithQueue = useCallback(async (generateFn: () => Promise<void>) => {
    // 使用导入的函数
    await enterQueueAndGenerate(generateFn);
    // 同步状态
    setActiveCount(getActiveCount());
  }, []);
  
  return {
    activeCount,       // 当前活动请求数
    increase,          // 增加计数方法
    decrease,          // 减少计数方法
    reset,             // 重置计数方法
    generateWithQueue, // 使用队列生成图像
    hasActiveRequests: activeCount > 0  // 是否有活动请求的便捷标志
  };
};

export default useQueueManager; 