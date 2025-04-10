"use client";

import React from 'react';
import { useTranslation } from '@/lib/i18n';

const FeedbackButton = () => {
  const { t } = useTranslation();

  return (
    <a
      href="https://tally.so/r/n9rDGK"
      target="_blank"
      rel="noopener noreferrer"
      className="fixed bottom-6 right-6 bg-blue-600 hover:bg-blue-700 text-white font-medium py-2 px-4 rounded-full shadow-lg transition-all duration-300 flex items-center gap-2 z-50"
    >
      <svg 
        xmlns="http://www.w3.org/2000/svg" 
        className="h-5 w-5" 
        fill="none" 
        viewBox="0 0 24 24" 
        stroke="currentColor"
      >
        <path 
          strokeLinecap="round" 
          strokeLinejoin="round" 
          strokeWidth={2} 
          d="M7 8h10M7 12h4m1 8l-4-4H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-3l-4 4z" 
        />
      </svg>
      {t('feedback')}
    </a>
  );
};

export default FeedbackButton; 