import { siriusStore } from "@/store/sirius";

const workingNodeConfigString = JSON.stringify({
  protocol: "https",
  hostname: "bctestnet1.brimstone.xpxsirius.io",
});

const wrongNetworkNodeConfigString = JSON.stringify({
  protocol: "http",
  hostname: "arcturus.xpxsirius.io",
  port: 3000,
});

const invalidNodeConfigString = JSON.stringify({
  protocol: "http",
  hostname: "fake.xpxsirius.io",
  port: 3000,
});

describe("add working node", () => {
  it("returns 1", async () => {
    const res = await siriusStore.addChainNode(workingNodeConfigString);
    expect(res).toBe(1);
  });
});

describe("add duplicate node", () => {
  it("returns -1", async () => {
    await siriusStore.addChainNode(workingNodeConfigString);
    const res = await siriusStore.addChainNode(workingNodeConfigString);
    expect(res).toBe(-1);
  });
});

describe("add wrong network node", () => {
  it("returns 0", async () => {
    const res = await siriusStore.addChainNode(wrongNetworkNodeConfigString);
    expect(res).toBe(0);
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
    const res = await siriusStore.selectNewChainNode(workingNodeConfigString);
    expect(res).toBeTruthy();
  });
});

describe("change to non-existing node", () => {
  it("returns false", async () => {
    const res = await siriusStore.selectNewChainNode(invalidNodeConfigString);
    expect(res).toBeFalsy();
  });
});

describe("check listener running", () => {
  it("returns Websocket Object", () => {
    expect(siriusStore.chainWSListener.websocketInjected).toBeDefined();
  });
});
