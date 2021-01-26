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
  port: 6466,
});

const wrongNetworkStorageNodeConfigString = JSON.stringify({
  protocol: "https",
  hostname: "ipfs.io",
});

describe("add chain node", () => {
  it("given new node, returns 1", async () => {
    const res = await siriusStore.addChainNode(workingChainNodeConfigString);
    expect(res).toBe(1);
  });

  it("given duplicate node, returns -1", async () => {
    const res = await siriusStore.addChainNode(workingChainNodeConfigString);
    expect(res).toBe(-1);
  });

  it("given wrong network node, returns 0", async () => {
    const res = await siriusStore.addChainNode(
      wrongNetworkChainNodeConfigString
    );
    expect(res).toBe(0);
  });

//  it("given non-working node, returns 0", async () => {
//    const res = await siriusStore.addChainNode(
//      workingStorageNodeConfigString
//    );
//    expect(res).toBe(0);
//  });
});

describe("select chain node", () => {
  it("given existing node, returns true", async () => {
    const res = await siriusStore.selectNewChainNode(
      workingChainNodeConfigString
    );
    expect(res).toBeTruthy();
  });

  it("websocket object is defined", () => {
    expect(siriusStore.chainWSListener.websocketInjected).toBeDefined();
  });

  it("given non-existing node, returns false", async () => {
    const res = await siriusStore.selectNewChainNode(wrongNetworkChainNodeConfigString);
    expect(res).toBeFalsy();
  });
});

describe("add storage node", () => {
  it("given new node, returns 1", async () => {
    const res = await siriusStore.addStorageNode(
      workingStorageNodeConfigString
    );
    expect(res).toBe(1);
  });

  it("given duplicate node, returns -1", async () => {
    const res = await siriusStore.addStorageNode(
      workingStorageNodeConfigString
    );
    expect(res).toBe(-1);
  });

  it("given wrong network node, returns 0", async () => {
    const res = await siriusStore.addStorageNode(
      wrongNetworkStorageNodeConfigString
    );
    expect(res).toBe(0);
  });
});

describe("select storage node", () => {
  it("given existing node, returns true", async () => {
    const res = await siriusStore.selectNewStorageNode(
      workingStorageNodeConfigString
    );
    expect(res).toBeTruthy();
  });

  it("node type is SRN", () => {
    expect(siriusStore.state.selectedStorageNodeType).toBe("SRN");
  });

  it("given non-existing node, returns false", async () => {
    const res = await siriusStore.selectNewStorageNode(wrongNetworkStorageNodeConfigString);
    expect(res).toBeFalsy();
  });
});
