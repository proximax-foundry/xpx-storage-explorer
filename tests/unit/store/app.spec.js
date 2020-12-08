import { appStore } from "@/store/app";

test("app name", () => {
  expect(appStore.name).toBe("Storage Explorer");
});

test("version", () => {
  expect(appStore.version).toBe(require("@/../package.json").version);
});

describe("change to dark theme", () => {
  it("defaults false", () => {
    expect(appStore.state.darkTheme).toBeFalsy();
  });

  it("returns true", () => {
    appStore.toggleDarkTheme();
    expect(appStore.state.darkTheme).toBeTruthy();
  });
});
