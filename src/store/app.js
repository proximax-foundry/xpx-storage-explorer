import { reactive, readonly } from "vue";

const config = require("@/../config/config.json");

const name = "Storage Explorer";

const state = reactive({
  darkTheme: false,
});

const explorerBlockHttp = (compactBlock) => {
  return `${config.chainExplorer.url}/${config.chainExplorer.blockRoute}/${compactBlock}`;
};

const explorerPublicKeyHttp = (publicKey) => {
  return `${config.chainExplorer.url}/${config.chainExplorer.publicKeyRoute}/${publicKey}`;
};

const ipLocationHttp = (ip) => {
  return `${config.ipLocation.url}/${config.ipLocation.endpoint}/${ip}`;
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
  explorerBlockHttp,
  explorerPublicKeyHttp,
  ipLocation: config.ipLocation,
  ipLocationHttp,
  mapboxToken: config.mapboxToken,
  toggleDarkTheme,
  version: require("@/../package.json").version,
});
