/* Add language here with the corresponding json file, use en.json as reference */
export default {
  en: require("./en.json") as Record<string, string>,
  es: require("./es.json") as Record<string, string>,
  fr: require("./fr.json") as Record<string, string>,
  ch: require("./ch.json") as Record<string, string>,
  de: require("./de.json") as Record<string, string>,
  tr: require("./tr.json") as Record<string, string>,
};
