import i18n from "i18next";
import { initReactI18next } from "react-i18next";
import enJSON from "./locales/en.json";
import deJSON from "./locales/de.json";

import { Languages } from "./types/Languages.ts";

i18n.use(initReactI18next).init({
  resources: {
    [Languages.English]: { ...enJSON },
    [Languages.German]: { ...deJSON },
  },
  lng: Languages.German,
});
