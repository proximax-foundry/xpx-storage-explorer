import App from "@/App.vue";

describe("App", () => {
  it("has setup", () => {
    expect(typeof App.setup).toBe("function");
  });
});
