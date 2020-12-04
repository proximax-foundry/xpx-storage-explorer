import { reactive, readonly } from "vue";

const config = require("@/../config/config.json");

const coreVersion = require("@/../package.json").version;
const name = "ProximaX Sirius Storage Explorer";
const state = reactive({
  darkTheme: false,
});

function toggleDarkTheme() {
  if (config.debug) {
    console.log("toggleDarkTheme triggered");
  }

  state.darkTheme = !state.darkTheme;
}

export const appStore = readonly({
  name,
  state,
  toggleDarkTheme,
  version: coreVersion,
});
