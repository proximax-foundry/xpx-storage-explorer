import { siriusStore } from "@/store/sirius";

const workingChainNodeConfigString = JSON.stringify({
  protocol: "https",
  hostname: "bctestnet1.brimstone.xpxsirius.io",
});

const wrongNetworkChainNodeConfigString = JSON.stringify({
  protocol: "http",
  hostname: "arcturus.xpxsirius.io",
  port: 3000,
});

const workingStorageNodeConfigString = JSON.stringify({
  protocol: "http",
  hostname: "usw2-testnet1.dfms.io",
  port: 6366,
});

const invalidNodeConfigString = JSON.stringify({
  protocol: "http",
  hostname: "fake.xpxsirius.io",
  port: 3000,
});

describe("add working chain node", () => {
  it("returns 1", async () => {
    const res = await siriusStore.addChainNode(workingChainNodeConfigString);
    expect(res).toBe(1);
  });
});

describe("add duplicate chain node", () => {
  it("returns -1", async () => {
    const res = await siriusStore.addChainNode(workingChainNodeConfigString);
    expect(res).toBe(-1);
  });
});

describe("add wrong network chain node", () => {
  it("returns 0", async () => {
    const res = await siriusStore.addChainNode(
      wrongNetworkChainNodeConfigString
    );
    expect(res).toBe(0);
  });
});

// describe("add non-working chain node", () => {
//   it("returns 0", async () => {
//     const res = await siriusStore.addChainNode(invalidNodeConfigString);
//     expect(res).toBe(0);
//   })
// })

describe("add working storage node", () => {
  it("returns 1", async () => {
    const res = await siriusStore.addStorageNode(
      workingStorageNodeConfigString
    );
    expect(res).toBe(1);
  });
});

describe("add duplicate storage node", () => {
  it("returns -1", async () => {
    const res = await siriusStore.addStorageNode(
      workingStorageNodeConfigString
    );
    expect(res).toBe(-1);
  });
});

describe("change to working chain node", () => {
  it("returns true", async () => {
    const res = await siriusStore.selectNewChainNode(
      workingChainNodeConfigString
    );
    expect(res).toBeTruthy();
  });
});

describe("change to non-existing chain node", () => {
  it("returns false", async () => {
    const res = await siriusStore.selectNewChainNode(invalidNodeConfigString);
    expect(res).toBeFalsy();
  });
});

describe("change to working storage node", () => {
  it("returns true", async () => {
    const res = await siriusStore.selectNewStorageNode(
      workingStorageNodeConfigString
    );
    expect(res).toBeTruthy();
  });
});

describe("change to non-existing storage node", () => {
  it("returns false", async () => {
    const res = await siriusStore.selectNewStorageNode(invalidNodeConfigString);
    expect(res).toBeFalsy();
  });
});

describe("check chain WS listener", () => {
  it("returns Websocket Object", () => {
    expect(siriusStore.chainWSListener.websocketInjected).toBeDefined();
  });
});
