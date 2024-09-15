import './assets/main.css';

import id from '@/lang/id';
import { createApp, ref } from 'vue';
import { createI18n } from 'vue-i18n';
import App from './App.vue';
import type { Settings } from './Settings';

const i18n = createI18n({
  locale: 'id',
  fallbackLocale: 'en',
  messages: {
    id,
  }
});

const settings: Settings = (function(): Settings {
  const item = localStorage.getItem(import.meta.env.VITE_STORAGE_KEY);
  if (item) return JSON.parse(item);
  return {
    difficulty: 'easy',
  };
})();

window.addEventListener('unload', () => {
  localStorage.setItem(import.meta.env.VITE_STORAGE_KEY, JSON.stringify(settings));
})

createApp(App)
  .use(i18n)
  .provide('overlay', ref(false))
  .provide('settings', settings)
  .mount('body')
