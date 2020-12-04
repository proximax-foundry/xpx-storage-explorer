import { siriusStore } from "../../../src/store/sirius";

describe("add working node", () => {
  it("returns 1", async () => {
    const res = await siriusStore.addNode("https://arcturus.xpxsirius.io")
    expect(res).toBe(1)
  })
})

describe("add duplicate node", () => {
  it("returns -1", async () => {
    await siriusStore.addNode("https://arcturus.xpxsirius.io")
    const res = await siriusStore.addNode("https://arcturus.xpxsirius.io")
    expect(res).toBe(-1)
  })
})

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
    const res = await siriusStore.selectNewNode("https://arcturus.xpxsirius.io")
    expect(res).toBeTruthy()
  })
})

describe("change to non-existing node", () => {
  it("returns false", async () => {
    const res = await siriusStore.selectNewNode("https://fake.xpxsirius.io")
    expect(res).toBeFalsy()
  })
})

describe("check listener running", () => {
  it("returns Websocket Object", () => {
    expect(siriusStore.wsListener.websocketInjected).toBeDefined()
  })
})
