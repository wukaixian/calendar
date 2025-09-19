import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import { VitePWA } from 'vite-plugin-pwa';

export default defineConfig(({ command }) => ({
  base: command === 'build' ? '/calendar/' : '/',
  plugins: [
    react(),
    VitePWA({
      registerType: 'autoUpdate',
      injectRegister: false,
      devOptions: {
        enabled: true,
      },
      manifest: {
        scope: '/calendar/',
        name: '����',
        short_name: '����',
        description: 'һ����Ϲ�����ũ�����ڼ�����Ϣ���ִ� Web ������',
        theme_color: '#0b1c2d',
        background_color: '#0b1c2d',
        display: 'standalone',
        start_url: '/calendar/',
        lang: 'zh-CN',
        icons: [
          {
            src: 'icons/icon-192x192.png',
            sizes: '192x192',
            type: 'image/png',
          },
          {
            src: 'icons/icon-512x512.png',
            sizes: '512x512',
            type: 'image/png',
          },
          {
            src: 'icons/maskable-icon-512x512.png',
            sizes: '512x512',
            type: 'image/png',
            purpose: 'maskable',
          },
        ],
      },
    }),
  ],
}));

