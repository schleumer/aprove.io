/**
 * i18n.js
 *
 * This will setup the i18n language files and locale data for your src.
 *
 *   IMPORTANT: This file is used by the internal build
 *   script `extract-intl`, and must use CommonJS module syntax
 *   You CANNOT use import/export in this file.
 */
const addLocaleData = require('react-intl').addLocaleData; //eslint-disable-line
const ptLocaleData = require('react-intl/locale-data/pt');

const ptTranslationMessages = require('./translations/pt.json');

addLocaleData(ptLocaleData);

export const DEFAULT_LOCALE = 'pt';

// prettier-ignore
export const appLocales = [
  'pt',
];

export const formatTranslationMessages = (locale, messages) => {
  const defaultFormattedMessages =
    locale !== DEFAULT_LOCALE
      ? formatTranslationMessages(DEFAULT_LOCALE, ptTranslationMessages)
      : {};
  const flattenFormattedMessages = (formattedMessages, key) => {
    const formattedMessage =
      !messages[key] && locale !== DEFAULT_LOCALE
        ? defaultFormattedMessages[key]
        : messages[key];
    return Object.assign(formattedMessages, { [key]: formattedMessage });
  };
  return Object.keys(messages).reduce(flattenFormattedMessages, {});
};

export const translationMessages = {
  pt: formatTranslationMessages('pt', ptTranslationMessages),
};
