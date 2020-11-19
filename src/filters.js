import { Deadline } from "tsjs-xpx-chain-sdk";

export default {
  getRelativeTimestamp(blockTimestamp) {
    return new Date(
      blockTimestamp.compact() + Deadline.timestampNemesisBlock * 1000
    );
  },
};
