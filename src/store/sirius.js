import utils from "@/utils";
import { computed, reactive, ref, readonly } from "vue";
import { BlockHttp, ChainHttp, Listener, NodeHttp } from "tsjs-xpx-chain-sdk";
import axios from "axios";

const config = require("@/../config/config.json");

function getChainNodes() {
  const existingNodes = sessionStorage.getItem(
    config.sessionStorage.chainNodesKey
  );
  return existingNodes ? JSON.parse(existingNodes) : config.chainNodes;
}

function getStorageNodes() {
  const existingNodes = sessionStorage.getItem(
    config.sessionStorage.storageNodesKey
  );
  return existingNodes ? JSON.parse(existingNodes) : config.storageNodes;
}

// ALWAYS use function selectNewChainNode to change currentChainNode value, to avoid web socket listening on old node
const currentChainNode = ref(getChainNodes()[0]);
const currentStorageNode = ref(getStorageNodes()[0]);
const listenerChainWS = ref(null);

const state = reactive({
  chainNodes: getChainNodes(),
  storageNodes: getStorageNodes(),
  network: config.network,
  selectedChainNode: computed(() =>
    utils.parseNodeConfig(currentChainNode.value)
  ),
  selectedStorageNode: computed(() =>
    utils.parseNodeConfig(currentStorageNode.value)
  ),
  selectedStorageNodeType: computed(() => currentStorageNode.value.type),
});

const blockHttp = computed(() => new BlockHttp(state.selectedChainNode));
const chainHttp = computed(() => new ChainHttp(state.selectedChainNode));
const nodeHttp = computed(() => new NodeHttp(state.selectedChainNode));

const driveHttp = (drivePublicKey) => {
  return `${state.selectedChainNode}/drive/${drivePublicKey}`;
};

const drivesHttp = (pageSize = 24, pageNumber = 1) => {
  return `${state.selectedChainNode}/drives?pageSize=${pageSize}&pageNumber=${pageNumber}`;
};

// Awaiting storage SDK for proper infrastructure implementation
const netIdHttp = computed(() => state.selectedStorageNode + "/api/v1/net/id");
const versionHttp = computed(
  () => state.selectedStorageNode + "/api/v1/version"
);
const keyHttp = computed(
  () => state.selectedStorageNode + "/api/v1/ledger/key"
);
const peersHttp = computed(
  () => state.selectedStorageNode + "/api/v1/net/peers"
);
const contractLsHttp = computed(
  () => state.selectedStorageNode + "/api/v1/contract/ls"
);
const driveLsHttp = (driveCID, path) => {
  return `${state.selectedStorageNode}/api/v1/drive/ls?arg=${driveCID}${
    path && path != "" ? "&arg=" + path : ""
  }`;
};
const driveFileHttp = (driveCID, fileCID) => {
  return `${state.selectedStorageNode}/api/v1/drive/file?arg=${driveCID}&arg=${fileCID}`;
};

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
    const http = new BlockHttp(utils.parseNodeConfig(newNodeConfig));
    const blockInfo = await http.getBlockByHeight(1).toPromise();
    if (
      blockInfo.generationHash.toUpperCase() !=
      config.network.generationHash.toUpperCase()
    ) {
      return 0;
    }

    state.chainNodes.unshift({
      protocol: newNodeConfig.protocol,
      hostname: newNodeConfig.hostname,
      port: newNodeConfig.port,
    });
    sessionStorage.setItem(
      config.sessionStorage.chainNodesKey,
      JSON.stringify(state.chainNodes)
    );
    return 1;
  } catch (err) {
    if (config.debug) {
      console.error("addChainNode error caught", err);
    }
    return 0;
  }
}

async function addStorageNode(nodeConfigString) {
  const newNodeConfig = JSON.parse(nodeConfigString);
  if (config.debug) {
    console.log("addStorageNode triggered with", newNodeConfig.hostname);
  }

  if (
    state.storageNodes.find(
      (element) =>
        element.protocol == newNodeConfig.protocol &&
        element.hostname == newNodeConfig.hostname &&
        element.port == newNodeConfig.port
    )
  ) {
    return -1;
  }

  try {
    const resp = await axios.get(
      utils.parseNodeConfig(newNodeConfig) + "/api/v1/version"
    );
    if (
      resp.status != 200 ||
      (resp.data.App && !resp.data.App.toLowerCase().startsWith("dfms"))
    ) {
      return 0;
    }

    state.storageNodes.unshift({
      protocol: newNodeConfig.protocol,
      hostname: newNodeConfig.hostname,
      type: resp.data.App.toLowerCase().endsWith("client") ? "SDN" : "SRN",
      port: newNodeConfig.port,
    });
    sessionStorage.setItem(
      config.sessionStorage.storageNodesKey,
      JSON.stringify(state.storageNodes)
    );
    return 1;
  } catch (err) {
    if (config.debug) {
      console.error("addStorageNode error caught", err);
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

function selectNewStorageNode(nodeConfigString) {
  const nodeConfig = JSON.parse(nodeConfigString);
  const found = state.storageNodes.find(
    (element) =>
      element.protocol == nodeConfig.protocol &&
      element.hostname == nodeConfig.hostname &&
      element.port == nodeConfig.port
  );

  if (!found) {
    if (config.debug) {
      console.error(
        "selectNewStorageNode triggered with invalid node url",
        nodeConfig.hostname
      );
    }
    return false;
  }

  if (config.debug) {
    console.log("selectNewStorageNode triggered with", nodeConfig.hostname);
  }
  currentStorageNode.value = found;
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
  driveHttp,
  drivesHttp,
  netIdHttp,
  versionHttp,
  keyHttp,
  peersHttp,
  contractLsHttp,
  driveLsHttp,
  driveFileHttp,
  chainWSListener,
  addChainNode,
  addStorageNode,
  selectNewChainNode,
  selectNewStorageNode,
  stopChainWSListener,
});
