export default {
  string: process.env?.REACT_APP_VERSION?.replace(/\./g, "_") || "dev",
  semver: process.env?.REACT_APP_VERSION || "dev",
  isDev: process.env?.REACT_APP_VERSION?.indexOf("dev") !== -1,
};
