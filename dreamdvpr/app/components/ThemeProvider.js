'use client';

import { usePathname } from 'next/navigation';
import { useTheme } from '@/app/lib/theme';

/**
 * ThemeProvider - Conditionally applies theme only to homepage and blog pages
 * Other pages (login, client, admin) use static themes
 */
export function ThemeProvider({ children, initialTheme = null }) {
  const pathname = usePathname();
  
  // Only apply dynamic theme to homepage and blog pages
  const shouldApplyTheme = pathname === '/' || 
                          pathname?.startsWith('/blog');
  
  useTheme(initialTheme, shouldApplyTheme);

  return <>{children}</>;
}
