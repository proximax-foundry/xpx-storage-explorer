import { computed, reactive, ref, readonly } from "vue";
import { BlockHttp, ChainHttp, Listener, NodeHttp } from "tsjs-xpx-chain-sdk";
import parse from "url-parse";

const config = require("@/../config/config.json");

// ALWAYS use function selectNewNode to change currentNode value, to avoid web socket listening on old node
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
  if (listenerWS.value == null) {
    const url = parse(siriusStore.state.selectedNode, true);
    listenerWS.value = new Listener(
      "wss://" + url.hostname + ":443",
      WebSocket
    );
  }

  return listenerWS.value;
});

async function addNode(newUrl) {
  if (config.debug) {
    console.log("addNode triggered with", newUrl);
  }

  if (state.nodes.includes(newUrl)) {
    return -1;
  }

  const http = new ChainHttp(newUrl);
  try {
    await http.getBlockchainHeight().toPromise();
    state.nodes.push(newUrl);
    return 1;
  } catch (err) {
    if (config.debug) {
      console.error("addNode error caught", err);
    }
    return 0;
  }
}

function selectNewNode(nodeUrl) {
  if (state.nodes.indexOf(nodeUrl) == -1) {
    if (config.debug) {
      console.error("selectNewNode triggered with invalid node url", nodeUrl);
    }
    return false;
  }

  if (config.debug) {
    console.log("selectNewNode triggered with", nodeUrl);
  }
  currentNode.value = nodeUrl;
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
