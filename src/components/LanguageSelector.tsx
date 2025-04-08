import React from 'react';
import { useTranslation } from '@/lib/i18n';
import { GlobeAltIcon } from '@heroicons/react/24/outline';

const languageNames: Record<string, string> = {
  en: 'English',
  zh: '中文',
  es: 'Español',
  fr: 'Français',
  de: 'Deutsch',
  ja: '日本語'
};

const LanguageSelector: React.FC = () => {
  const { locale, changeLocale, supportedLocales, t } = useTranslation();

  const handleLanguageChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const newLocale = e.target.value;
    changeLocale(newLocale as any);
  };

  return (
    <div className="relative inline-block w-full">
      <div className="absolute inset-y-0 left-0 pl-2 flex items-center pointer-events-none">
        <GlobeAltIcon className="h-4 w-4 text-gray-500" />
      </div>
      <select
        id="language-select"
        value={locale}
        onChange={handleLanguageChange}
        className="w-full pl-8 pr-6 py-2 bg-white text-gray-700 text-sm shadow-md hover:shadow-lg rounded-lg border border-gray-200 focus:ring-2 focus:ring-indigo-500 transition-all duration-200 appearance-none"
        aria-label={t('language')}
      >
        {supportedLocales.map((loc) => (
          <option key={loc} value={loc}>
            {languageNames[loc]}
          </option>
        ))}
      </select>
      <div className="absolute inset-y-0 right-0 flex items-center pr-2 pointer-events-none">
        <svg className="h-4 w-4 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7" />
        </svg>
      </div>
    </div>
  );
};

export default LanguageSelector; 