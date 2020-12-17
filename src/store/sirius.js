import { computed, reactive, ref, readonly } from "vue";
import { BlockHttp, ChainHttp, Listener, NodeHttp } from "tsjs-xpx-chain-sdk";
// import parse from "url-parse";

const config = require("@/../config/config.json");

// ALWAYS use function selectNewNode to change currentNode value, to avoid web socket listening on old node
const currentNode = ref(config.blockchainNodes[0]);
const listenerWS = ref(null);

const state = reactive({
  nodes: config.blockchainNodes,
  networkType: config.networkType,
  selectedNode: computed(() => currentNode.value),
});

const blockHttp = computed(() => new BlockHttp(parseNodeConfig(state.selectedNode)));
const chainHttp = computed(() => new ChainHttp(parseNodeConfig(state.selectedNode)));
const nodeHttp = computed(() => new NodeHttp(parseNodeConfig(state.selectedNode)));

const wsListener = computed(() => {
  if (listenerWS.value == null) {
    const node = siriusStore.state.selectedNode
    listenerWS.value = new Listener(
      `${node.protocol.startsWith("http") ? "ws://" : "wss://"}${node.hostname}:${node.port}`,
      WebSocket
    )
  }

  return listenerWS.value;
});

async function addNode(nodeConfigString) {
  const nodeConfig = JSON.parse(nodeConfigString)
  if (config.debug) {
    console.log("addNode triggered with", nodeConfig.hostname);
  }

  // if (state.nodes.includes(node)) {
  //   return -1;
  // }

  const node = parseNodeConfig(nodeConfig)

  const http = new ChainHttp(node);
  try {
    await http.getBlockchainHeight().toPromise();
    state.nodes.push(nodeConfig);
    return 1;
  } catch (err) {
    if (config.debug) {
      console.error("addNode error caught", err);
    }
    return 0;
  }
}

function selectNewNode(nodeConfigString) {
  const nodeConfig = JSON.parse(nodeConfigString)
  // if (state.nodes.indexOf(nodeConfig) == -1) {
  //   if (config.debug) {
  //     console.error("selectNewNode triggered with invalid node url", nodeConfig.hostname);
  //   }
  //   return false;
  // }

  if (config.debug) {
    console.log("selectNewNode triggered with", nodeConfig.hostname);
  }
  currentNode.value = nodeConfig;
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

function parseNodeConfig(nodeConfig) {
  return (
    nodeConfig.protocol + "://" + nodeConfig.hostname + ":" + nodeConfig.port
  );
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
