import { reactive, readonly } from "vue";

const config = require("@/../config/config.json");

const name = "Storage Explorer";

const state = reactive({
  darkTheme: false,
  browseStorageNode: true,
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

function setBrowseMode(useStorageNode = true) {
  if (config.debug) {
    console.log("setBrowseMode triggered with", useStorageNode);
  }

  state.browseStorageNode = useStorageNode;
}

export const appStore = readonly({
  name,
  version: require("@/../package.json").version,
  state,
  explorerBlockHttp,
  explorerPublicKeyHttp,
  ipLocation: config.ipLocation,
  ipLocationHttp,
  mapboxToken: config.mapboxToken,
  toggleDarkTheme,
  setBrowseMode,
});
