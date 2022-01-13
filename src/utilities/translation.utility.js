/**
 * Developer                    - Aung Htet Paing
 * Start Date                   - 25 Dec 2021
 * Phone                        - 09421038123, 09758276201
 * Email                        - aunghtetpaing.info@gmail.com
**/
import i18n from 'i18next';

import enTranslation from '../assets/i18n/en.json';
import unicodeTranslation   from '../assets/i18n/unicode.json';
import zawgyiTranslation from '../assets/i18n/zawgyi.json';
import { LANG_VALUE } from '../redux/actionTypes';

export const zawgyi = (lng) => {
    const language = lng === 'zawgyi' ? 'zawgyi' : '';
    return language;
}

export const t = (value) => {
    return i18n.t(value);
};

const getLng = localStorage.getItem(LANG_VALUE) ? localStorage.getItem(LANG_VALUE) : 'unicode';

i18n.init({
    resources : {
        en: { translation: enTranslation },
        unicode: { translation: unicodeTranslation },
        zawgyi: { translation: zawgyiTranslation }
    },
    lng: getLng,
    fallbackLng: getLng,
    debug: true,
    interpolation: {
        escapeValue: false
    }
})

export default i18n;