import { computed, reactive, ref, readonly } from "vue";
import { BlockHttp, ChainHttp, Deadline, NodeHttp } from "tsjs-xpx-chain-sdk";

const config = require("@/../config/config.json");

const currentNode = ref(config.nodes[0]);

const state = reactive({
  nodes: config.nodes,
  networkType: config.networkType,
  selectedNode: computed(() => currentNode.value),
});

const blockHttp = computed(
  () => new BlockHttp("http://" + state.selectedNode + ":3000")
);
const chainHttp = computed(
  () => new ChainHttp("https://" + state.selectedNode)
);
const nodeHttp = computed(() => new NodeHttp("https://" + state.selectedNode));

function addNode(newUrl) {
  if (config.debug) {
    console.log("addUrl triggered with", newUrl);
  }

  state.nodes.push(newUrl);
}

function selectNewNode(index) {
  if (index < 0 || index >= state.nodes.length) {
    if (config.debug) {
      console.log("updatedNode triggered with invalid index", index);
    }
    return;
  }

  if (config.debug) {
    console.log("updateNode triggered with", state.nodes[index]);
  }
  currentNode.value = state.nodes[index];
}

function getRelativeTimestamp(blockTimestamp) {
  if (config.debug) {
    console.log("getRelativeTimestamp triggered with", blockTimestamp);
  }

  return new Date(
    blockTimestamp.compact() + Deadline.timestampNemesisBlock * 1000
  );
}

export const siriusStore = readonly({
  state,
  blockHttp,
  chainHttp,
  nodeHttp,
  addNode,
  selectNewNode,
  getRelativeTimestamp,
});
