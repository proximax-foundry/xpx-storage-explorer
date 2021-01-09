import utils from "@/utils";
import { computed, reactive, ref, readonly } from "vue";
import { BlockHttp, ChainHttp, Listener, NodeHttp } from "tsjs-xpx-chain-sdk";

const config = require("@/../config/config.json");

// ALWAYS use function selectNewChainNode to change currentChainNode value, to avoid web socket listening on old node
const currentChainNode = ref(config.chainNodes[0]);
const listenerChainWS = ref(null);

const state = reactive({
  chainNodes: config.chainNodes,
  networkType: config.networkType,
  selectedChainNode: computed(() =>
    utils.parseNodeConfig(currentChainNode.value)
  ),
});

const blockHttp = computed(() => new BlockHttp(state.selectedChainNode));
const chainHttp = computed(() => new ChainHttp(state.selectedChainNode));
const nodeHttp = computed(() => new NodeHttp(state.selectedChainNode));

const chainWSListener = computed(() => {
  if (listenerChainWS.value == null) {
    listenerChainWS.value = new Listener(
      `${
        currentChainNode.value.protocol.startsWith("http") ? "ws://" : "wss://"
      }${currentChainNode.value.hostname}:${currentChainNode.value.port}`,
      WebSocket
    );
  }

  return listenerChainWS.value;
});

async function addChainNode(nodeConfigString) {
  const newNodeConfig = JSON.parse(nodeConfigString);
  if (config.debug) {
    console.log("addChainNode triggered with", newNodeConfig.hostname);
  }

  if (
    state.chainNodes.find(
      (element) =>
        element.protocol == newNodeConfig.protocol &&
        element.hostname == newNodeConfig.hostname &&
        element.port == newNodeConfig.port
    )
  ) {
    return -1;
  }

  try {
    const http = new NodeHttp(utils.parseNodeConfig(newNodeConfig));
    const nodeInfo = await http.getNodeInfo().toPromise();
    if (nodeInfo.networkIdentifier != config.networkType.number) {
      return 0;
    }
    state.chainNodes.push({
      protocol: newNodeConfig.protocol,
      hostname: newNodeConfig.hostname,
      port: newNodeConfig.port,
    });
    return 1;
  } catch (err) {
    if (config.debug) {
      console.error("addChainNode error caught", err);
    }
    return 0;
  }
}

function selectNewChainNode(nodeConfigString) {
  const nodeConfig = JSON.parse(nodeConfigString);
  const found = state.chainNodes.find(
    (element) =>
      element.protocol == nodeConfig.protocol &&
      element.hostname == nodeConfig.hostname &&
      element.port == nodeConfig.port
  );

  if (!found) {
    if (config.debug) {
      console.error(
        "selectNewChainNode triggered with invalid node url",
        nodeConfig.hostname
      );
    }
    return false;
  }

  if (config.debug) {
    console.log("selectNewChainNode triggered with", nodeConfig.hostname);
  }
  currentChainNode.value = found;
  stopChainWSListener();
  return true;
}

function stopChainWSListener() {
  if (config.debug) {
    console.log("stopChainWSListener triggered");
  }

  if (listenerChainWS.value != null) {
    listenerChainWS.value.terminate();
    listenerChainWS.value = null;
  }
}

export const siriusStore = readonly({
  state,
  blockHttp,
  chainHttp,
  nodeHttp,
  chainWSListener,
  addChainNode,
  selectNewChainNode,
  stopChainWSListener,
});
