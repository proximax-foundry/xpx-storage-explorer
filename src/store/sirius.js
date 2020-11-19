import { computed, reactive, ref, readonly } from "vue";
import { BlockHttp, ChainHttp, Listener, NodeHttp } from "tsjs-xpx-chain-sdk";
import parse from "url-parse";

const config = require("@/../config/config.json");

const currentNode = ref(config.nodes[0]);
const listenerWS = ref(null);

const state = reactive({
  nodes: config.nodes,
  networkType: config.networkType,
  selectedNode: computed(() => currentNode.value),
});

const blockHttp = computed(() => new BlockHttp(state.selectedNode));
const chainHttp = computed(() => new ChainHttp(state.selectedNode));
const nodeHttp = computed(() => new NodeHttp(state.selectedNode));

const wsListener = computed(() => {
  const url = parse(siriusStore.state.selectedNode, true);
  listenerWS.value = new Listener("wss://" + url.hostname + ":443", WebSocket);

  return listenerWS.value;
});

async function addNode(newUrl) {
  if (config.debug) {
    console.log("addUrl triggered with", newUrl);
  }

  if (state.nodes.includes(newUrl)) {
    return -1;
  }

  const http = new ChainHttp(newUrl);
  try {
    await http.getBlockchainHeight().toPromise();
    state.nodes.push(newUrl);
    selectNewNode(state.nodes.length - 1);
    return 1;
  } catch (e) {
    if (config.debug) {
      console.error("addUrl error caught", e);
    }
    return 0;
  }
}

function selectNewNode(index) {
  if (index < 0 || index >= state.nodes.length) {
    if (config.debug) {
      console.log("updatedNode triggered with invalid index", index);
    }
    return false;
  }

  if (config.debug) {
    console.log("updateNode triggered with", state.nodes[index]);
  }
  currentNode.value = state.nodes[index];
  stopListener();
  return true;
}

function stopListener() {
  if (config.debug) {
    console.log("stopListener triggered");
  }

  if (listenerWS.value != null) {
    listenerWS.value.terminate();
    listenerWS.value = null;
  }
}

export const siriusStore = readonly({
  state,
  blockHttp,
  chainHttp,
  nodeHttp,
  wsListener,
  addNode,
  selectNewNode,
  stopListener,
});
