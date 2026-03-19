import React from 'react';
import { useLanguage } from '@/contexts/LanguageContext';
import { Button } from '@/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';

const LANGUAGE_OPTIONS = [
  { code: 'en' as const, label: 'English', flag: '🇺🇸' },
  { code: 'zh' as const, label: '中文', flag: '🇨🇳' },
];

export const LanguageSwitcher: React.FC = () => {
  const { language, setLanguage, t } = useLanguage();
  const selected = LANGUAGE_OPTIONS.find(l => l.code === language) ?? LANGUAGE_OPTIONS[0];

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button
          variant="ghost"
          size="sm"
          className="gap-1.5 text-foreground hover:bg-accent px-2"
          title={t('common.language')}
        >
          <span className="text-base leading-none">{selected.flag}</span>
          <span className="hidden sm:inline text-xs font-semibold text-muted-foreground">
            {selected.code.toUpperCase()}
          </span>
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end">
        {LANGUAGE_OPTIONS.map(lang => (
          <DropdownMenuItem
            key={lang.code}
            onClick={() => setLanguage(lang.code)}
            className={`gap-2 ${language === lang.code ? 'bg-accent' : ''}`}
          >
            <span className="text-base">{lang.flag}</span>
            <span>{lang.label}</span>
            {language === lang.code && <span className="ml-auto text-primary">✓</span>}
          </DropdownMenuItem>
        ))}
      </DropdownMenuContent>
    </DropdownMenu>
  );
};
