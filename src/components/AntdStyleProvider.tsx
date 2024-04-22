'use client';

import { PropsWithChildren, useEffect, useState } from 'react';
import { ConfigProvider, theme, ThemeConfig } from 'antd';
import { AntdProvider } from './AntdProvider';

export function AntdStyleProvider({ children }: PropsWithChildren) {
  const themeConfig: ThemeConfig = {
    cssVar: true,
    algorithm: theme.darkAlgorithm,

    token: {
      colorPrimary: 'hsl(83 34 55)',

      fontSize: 16,
      fontSizeHeading1: 28,
      fontSizeHeading2: 20,
      fontSizeHeading3: 18,
      fontSizeHeading4: 16,
      fontSizeHeading5: 14,
      fontWeightStrong: 300,
    }
  }
  return (
      <ConfigProvider
        theme={themeConfig}
      >
        <AntdProvider>{children}</AntdProvider>
      </ConfigProvider>
  );
}
