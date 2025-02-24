import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';
import enMessages from '../locales/en/en.json';
import viMessages from '../locales/vi/vi.json';

i18n
  .use(initReactI18next)
  .init({
    fallbackLng: 'vi',
    debug: true,
    interpolation: {
      escapeValue: false,
    },
    resources:{
        en:{
            translation:enMessages
        },
        vi:{
            translation:viMessages
        }
    },
  });

export default i18n;
