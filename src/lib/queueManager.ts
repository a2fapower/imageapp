/**
 * 客户端图像生成队列管理工具
 * 
 * 使用localStorage跟踪全局活动请求计数
 */

const STORAGE_KEY = 'imageapp_active_requests';
const MAX_QUEUE_SIZE = 3; // 最大并发请求数
const DAILY_COUNT_KEY = 'imageapp_daily_count';
const LAST_DATE_KEY = 'imageapp_last_date';

/**
 * 获取当前日期，格式为 'YYYY-MM-DD'
 * @returns 格式化的日期字符串
 */
const getTodayFormatted = (): string => {
  const today = new Date();
  return today.toISOString().split('T')[0]; // 格式 'YYYY-MM-DD'
};

/**
 * 检查并重置每日限制
 * 如果当前日期与上次记录的日期不同，重置每日计数
 */
export const checkAndResetDailyLimit = (): void => {
  if (typeof window === 'undefined') return; // 服务器端渲染兼容
  
  const today = getTodayFormatted();
  const lastDate = localStorage.getItem(LAST_DATE_KEY);
  
  // 如果日期不同，重置每日计数
  if (lastDate !== today) {
    localStorage.setItem(DAILY_COUNT_KEY, '0');
    localStorage.setItem(LAST_DATE_KEY, today);
    console.log('Daily limit reset for new day:', today);
  }
};

/**
 * 获取当前活动请求数量
 * @returns 活动请求计数
 */
export const getActiveCount = (): number => {
  if (typeof window === 'undefined') return 0; // 服务器端渲染兼容
  
  const count = localStorage.getItem(STORAGE_KEY);
  return count ? parseInt(count, 10) : 0;
};

/**
 * 增加活动请求计数
 * @returns 增加后的新计数
 */
export const increaseCount = (): number => {
  if (typeof window === 'undefined') return 0; // 服务器端渲染兼容
  
  const currentCount = getActiveCount();
  const newCount = currentCount + 1;
  localStorage.setItem(STORAGE_KEY, newCount.toString());
  return newCount;
};

/**
 * 减少活动请求计数（不会低于0）
 * @returns 减少后的新计数
 */
export const decreaseCount = (): number => {
  if (typeof window === 'undefined') return 0; // 服务器端渲染兼容
  
  const currentCount = getActiveCount();
  const newCount = Math.max(0, currentCount - 1);
  localStorage.setItem(STORAGE_KEY, newCount.toString());
  return newCount;
};

/**
 * 重置活动请求计数为0
 * @returns 0
 */
export const resetCount = (): number => {
  if (typeof window === 'undefined') return 0; // 服务器端渲染兼容
  
  localStorage.setItem(STORAGE_KEY, '0');
  return 0;
};

/**
 * 进入队列并生成图像
 * 
 * 1. 检查并重置每日限制
 * 2. 检查是否已达到每日限制
 * 3. 如果活动计数 >= 3，等待直到有空位（每2秒检查一次）
 * 4. 有空位时，调用increaseCount()
 * 5. 运行传入的生成函数
 * 6. 完成后，调用decreaseCount()
 * 7. 所有操作包装在try/finally中
 * 
 * @param generateFn 生成图像的函数
 * @returns Promise<void>
 */
export const enterQueueAndGenerate = async (generateFn: () => Promise<void>): Promise<void> => {
  if (typeof window === 'undefined') return; // 服务器端渲染兼容
  
  // 检查并重置每日限制
  checkAndResetDailyLimit();
  
  // 检查是否已达到每日限制
  if (hasReachedDailyLimit()) {
    alert("Daily limit reached. Please come back tomorrow.");
    return; // 停止继续执行
  }
  
  // 每2秒检查一次队列，直到有空位
  const waitForSpace = async (): Promise<void> => {
    while (getActiveCount() >= MAX_QUEUE_SIZE) {
      console.log('队列已满，等待空位...');
      await new Promise(resolve => setTimeout(resolve, 2000));
    }
  };
  
  try {
    // 等待队列有空位
    await waitForSpace();
    
    // 增加活动请求计数
    increaseCount();
    
    // 执行生成函数
    await generateFn();
    
    // 增加每日计数
    incrementDailyCount();
  } finally {
    // 无论成功还是失败，都减少活动请求计数
    decreaseCount();
  }
};

/**
 * 检查是否已达到每日限制
 * @returns 如果达到或超过每日限制(250)则返回true，否则返回false
 */
export const hasReachedDailyLimit = (): boolean => {
  if (typeof window === 'undefined') return false; // 服务器端渲染兼容
  
  const dailyCountStr = localStorage.getItem(DAILY_COUNT_KEY);
  const dailyCount = dailyCountStr ? parseInt(dailyCountStr, 10) : 0;
  
  return dailyCount >= 250;
};

/**
 * 增加每日计数
 * @returns 增加后的新计数
 */
export const incrementDailyCount = (): number => {
  if (typeof window === 'undefined') return 0; // 服务器端渲染兼容
  
  const dailyCountStr = localStorage.getItem(DAILY_COUNT_KEY);
  const dailyCount = dailyCountStr ? parseInt(dailyCountStr, 10) : 0;
  const newCount = dailyCount + 1;
  
  localStorage.setItem(DAILY_COUNT_KEY, newCount.toString());
  console.log('Daily count incremented:', newCount);
  return newCount;
};

export default {
  getActiveCount,
  increaseCount,
  decreaseCount,
  resetCount,
  enterQueueAndGenerate,
  checkAndResetDailyLimit,
  hasReachedDailyLimit,
  incrementDailyCount
}; 