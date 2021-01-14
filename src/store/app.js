import { reactive, readonly } from "vue";

const config = require("@/../config/config.json");

const coreVersion = require("@/../package.json").version;
const name = "Storage Explorer";
const ipLocationHostname = config.ipLocation.url;

const state = reactive({
  darkTheme: false,
});

const ipLocationHttp = (ip) => {
  return `${ipLocationHostname}/${config.ipLocation.endpoint}/${ip}`;
};

function toggleDarkTheme() {
  if (config.debug) {
    console.log("toggleDarkTheme triggered");
  }

  state.darkTheme = !state.darkTheme;
}

export const appStore = readonly({
  name,
  state,
  ipLocationHostname,
  ipLocationHttp,
  toggleDarkTheme,
  version: coreVersion,
});
