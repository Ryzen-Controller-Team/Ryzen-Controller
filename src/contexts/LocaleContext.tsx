import { createContext } from "react";
import LocaleTranslations from "../locales/LocaleTranslations";
import AppVersion from "./AppVersion";
const fs = window.require("fs");

const electronSettings = window.require("electron-settings");
const localeSettingsKey = `${AppVersion.string}.locale`;

const LocaleContext = createContext({
  is: "en",
  change: (to: AvailableLanguages): void => {},
});

LocaleContext.displayName = "LocaleContext";

/**
 * Will add the key to the current locale file.
 *
 * @param id The message id
 * @param currentLocale The current locale
 * @param fallback The fallback message for the given message id
 */
function addKeyToLocale(_id: string, _currentLocale: string, _fallback: string | undefined): void {
  let id = _id;
  let currentLocale = _currentLocale;
  let fallback = _fallback;
  let localeFile = `src/locales/${_currentLocale}.json`;

  let inter = setInterval(() => {
    let lock = electronSettings.get("lock");
    if (lock) {
      return;
    }
    clearInterval(inter);
    electronSettings.set("lock", true);
    console.log(`Writting key ${id} to locale ${currentLocale}...`);
    fs.readFile(localeFile, (err: string | null, data: string) => {
      if (err) {
        console.warn(err);
        return;
      }
      let localeTranslation = JSON.parse(data);
      localeTranslation[id] = "";
      if (currentLocale === "en" && fallback) {
        localeTranslation[id] = fallback;
      }
      fs.writeFile(localeFile, JSON.stringify(localeTranslation, null, 2), function(err: string | null) {
        electronSettings.delete("lock");
        if (err) {
          console.log("error", err);
          return;
        }
        console.log(`Written key ${id} to locale ${currentLocale}.`);
      });
    });
  }, 1000);
}

/**
 * Will replace the variables in translated sentences.
 *
 * @param sentence The return value of getTranslation() below.
 * @param variables The variables to be replaced.
 */
function variablesInTranslation(sentence: string, variables: Record<string, string>): string {
  for (const variable in variables) {
    if (variables.hasOwnProperty(variable)) {
      const value = variables[variable];
      sentence = sentence.replace(new RegExp(`{${variable}}`, "g"), value);
    }
  }
  return sentence;
}

/**
 * Will return the translated message.
 *
 * Exemple:
 *   - Given the message id "test" which give "Hello {firstname}!" as translation
 *   - Usage would be getTranslation("test", {firstname: "Bob"})
 *   - Would return "Hello Bob!"
 *
 * Warning:
 *   - For "en" locale, fallback prevail over locales/en.json
 *   - Using dev, id are added in the current locale
 *   - Using dev and "en" locale, en.json will be updated with fallback content
 *
 * @param id The message id
 * @param fallback The fallback message for the given message id
 * @param variables Variables to replace in the sentence
 */
function getTranslation(id: string, fallback?: string, variables?: Record<string, string>): string {
  const currentLocale = electronSettings.get(localeSettingsKey)
    ? (electronSettings.get(localeSettingsKey) as AvailableLanguages)
    : "en";
  var sentence: string | undefined = LocaleTranslations[currentLocale][id];

  if (!sentence && sentence !== "") {
    console.warn(`Missing translation for ${id} in locale ${currentLocale}.`);

    if (AppVersion.isDev) {
      addKeyToLocale(id, currentLocale, fallback);
    }
  }

  if (!sentence || currentLocale === "en") {
    sentence = fallback ? fallback : id;
  }

  if (variables) {
    variablesInTranslation(sentence, variables);
  }

  return sentence;
}

export { localeSettingsKey, getTranslation, variablesInTranslation };
export default LocaleContext;
