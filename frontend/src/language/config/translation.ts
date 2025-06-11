import { createIntl, createIntlCache } from 'react-intl';
import fr from '../locales/fr/translation_fr.json';
import en from '../locales/en/translation_en.json';

export const messages = {
  fr,
  en,
};

const cache = createIntlCache();

export const getIntl = (locale: string) => {
  return createIntl(
    {
      locale,
      messages: messages[locale as keyof typeof messages],
    },
    cache
  );
};