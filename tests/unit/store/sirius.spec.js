import { siriusStore } from "@/store/sirius";

var workingNodeConfig = {};
workingNodeConfig["protocol"] = "http"
workingNodeConfig["hostname"] = "arcturus.xpxsirius.io"
workingNodeConfig["port"] = 3000
const workingNodeConfigString = JSON.stringify(workingNodeConfig)

var invalidNodeConfig = {};
invalidNodeConfig["protocol"] = "http"
invalidNodeConfig["hostname"] = "fake.xpxsirius.io"
invalidNodeConfig["port"] = 3000
const invalidNodeConfigString = JSON.stringify(invalidNodeConfig)

describe("add working node", () => {
  it("returns 1", async () => {
    const res = await siriusStore.addNode(workingNodeConfigString);
    expect(res).toBe(1);
  });
});

describe("add duplicate node", () => {
  it("returns -1", async () => {
    await siriusStore.addNode(workingNodeConfigString);
    const res = await siriusStore.addNode(workingNodeConfigString);
    expect(res).toBe(-1);
  });
});

// describe("add non-working node", () => {
//   it("returns 0", async () => {
//     expect.assertions(1)
//     try {
//       await siriusStore.addNode("https://fake.xpxsirius.io")
//     } catch (e) {
//       expect(res).toEqual(new Error())
//     }
//   })
// })

describe("change to working node", () => {
  it("returns true", async () => {
    const res = await siriusStore.selectNewNode(
      workingNodeConfigString
    );
    expect(res).toBeTruthy();
  });
});

describe("change to non-existing node", () => {
  it("returns false", async () => {
    const res = await siriusStore.selectNewNode(invalidNodeConfigString);
    expect(res).toBeFalsy();
  });
});

describe("check listener running", () => {
  it("returns Websocket Object", () => {
    expect(siriusStore.wsListener.websocketInjected).toBeDefined();
  });
});
